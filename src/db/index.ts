import initSqlJs, { type Database } from "sql.js"
import type { Tag, Creator, Event } from "../types"
import { initialTags, initialCreators, initialEvents } from "./seed"

const STORAGE_KEY = "ihm_rennes_sqlite_db_v6_agenda"

let dbInstance: Database | null = null
let initPromise: Promise<Database> | null = null

// Coordonnées GPS vérifiées des scènes et bars rennais
export const VENUE_COORDS: Record<string, { lat: number lng: number }> = {
  etage: { lat: 48.1054, lng: -1.6775 },
  gilbert: { lat: 48.1144, lng: -1.6808 },
  ubu: { lat: 48.1077, lng: -1.6738 },
  antipode: { lat: 48.0988, lng: -1.7126 },
  barhic: { lat: 48.113, lng: -1.683 },
  mondo: { lat: 48.112, lng: -1.679 },
  liberte: { lat: 48.105, lng: -1.677 },
}

function saveDatabaseToLocalStorage(db: Database) {
  try {
    const data = db.export()
    let binaryString = ""
    const len = data.byteLength
    for (let i = 0; i < len; i++) {
      binaryString += String.fromCharCode(data[i])
    }
    const base64 = btoa(binaryString)
    localStorage.setItem(STORAGE_KEY, base64)
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde SQLite dans localStorage:",
      error,
    )
  }
}

export async function reloadDatabaseFromDisk(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
  dbInstance = null
  initPromise = null
  await getDatabase()
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      })

      let db: Database | null = null
      const saved =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null

      // 1. Essai de chargement depuis le cache local s'il existe
      if (saved) {
        try {
          const binaryString = atob(saved)
          const len = binaryString.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          db = new SQL.Database(bytes)
        } catch (err) {
          console.warn(
            "Échec du chargement du cache SQLite, tentative depuis agenda.db:",
            err,
          )
          db = null
        }
      }

      // 2. Si aucun cache (ex: premier lancement ou instance d'un collègue), charger agenda.db via HTTP
      if (!db && typeof window !== "undefined") {
        try {
          const response = await fetch("/agenda.db")
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer()
            if (arrayBuffer.byteLength > 0) {
              db = new SQL.Database(new Uint8Array(arrayBuffer))
              console.log(
                `[SQLite] Base agenda.db chargée avec succès (${arrayBuffer.byteLength} octets)`,
              )
            }
          }
        } catch (fetchErr) {
          console.warn(
            "[SQLite] Impossible de récupérer /agenda.db par fetch:",
            fetchErr,
          )
        }
      }

      // 3. Fallback création vierge si agenda.db introuvable
      if (!db) {
        db = new SQL.Database()
      }

      // Migrations sécurisées pour assurer la compatibilité entre les schémas
      try {
        db.run("ALTER TABLE creators ADD COLUMN bio TEXT")
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN avatarUrl TEXT")
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN avatar_url TEXT")
      } catch {}
      try {
        db.run(
          "ALTER TABLE creators ADD COLUMN followersCount INTEGER DEFAULT 120",
        )
      } catch {}
      try {
        db.run(
          "ALTER TABLE creators ADD COLUMN followers_count INTEGER DEFAULT 120",
        )
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN genreTag TEXT")
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN main_genre_id TEXT")
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN address TEXT")
      } catch {}
      try {
        db.run("ALTER TABLE creators ADD COLUMN isFollowed INTEGER DEFAULT 0")
      } catch {}
      try {
        db.run("ALTER TABLE events ADD COLUMN secondaryTags TEXT DEFAULT ''")
      } catch {}
      try {
        db.run("ALTER TABLE events ADD COLUMN isFavorite INTEGER DEFAULT 0")
      } catch {}

      // Création des tables de base si elles n'existent pas encore
      db.run(`
        CREATE TABLE IF NOT EXISTS tags (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS creators (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          kind TEXT NOT NULL,
          mutuals INTEGER DEFAULT 0,
          isFollowed INTEGER DEFAULT 0,
          bio TEXT,
          avatarUrl TEXT,
          followersCount INTEGER DEFAULT 0,
          genreTag TEXT,
          address TEXT
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
          creator_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          PRIMARY KEY (creator_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS favorites (
          event_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          PRIMARY KEY (event_id, user_id)
        );
      `)

      // Vérifier si la base doit être peuplée (cas base 100% vide sans agenda.db)
      const eventTableExists =
        db.exec(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='events'",
        ).length > 0

      if (!eventTableExists) {
        db.run(`
          CREATE TABLE events (
            id TEXT PRIMARY KEY,
            dateStr TEXT NOT NULL,
            hour TEXT NOT NULL,
            title TEXT NOT NULL,
            creatorId TEXT,
            tag TEXT NOT NULL,
            description TEXT,
            color TEXT NOT NULL,
            textColor TEXT NOT NULL,
            timeRange TEXT NOT NULL,
            venueName TEXT NOT NULL,
            venueAddress TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            officialSiteUrl TEXT,
            ticketingUrl TEXT,
            imageUrl TEXT NOT NULL,
            multiple INTEGER DEFAULT 0,
            isFavorite INTEGER DEFAULT 0,
            secondaryTags TEXT DEFAULT ''
          );
        `)

        // Insertion des tags initiaux
        const insertTag = db.prepare(
          "INSERT INTO tags (id, name, color) VALUES (?, ?, ?)",
        )
        for (const t of initialTags) {
          insertTag.run([t.id, t.name, t.color])
        }
        insertTag.free()

        // Insertion des créateurs initiaux
        const insertCreator = db.prepare(
          "INSERT INTO creators (id, name, kind, mutuals, isFollowed, bio, avatarUrl, followersCount, genreTag, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        for (const c of initialCreators) {
          insertCreator.run([
            c.id,
            c.name,
            c.kind,
            c.mutuals ?? 0,
            c.isFollowed ? 1 : 0,
            c.bio ?? null,
            c.avatarUrl ?? null,
            c.followersCount ?? 0,
            c.genreTag ?? null,
            c.address ?? null,
          ])
        }
        insertCreator.free()

        // Insertion des événements initiaux
        const insertEvent = db.prepare(`
          INSERT INTO events (
            id, dateStr, hour, title, creatorId, tag, description, color, textColor,
            timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
            imageUrl, multiple, isFavorite, secondaryTags
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        for (const e of initialEvents) {
          insertEvent.run([
            e.id,
            e.dateStr,
            e.hour,
            e.title,
            e.creatorId ?? null,
            e.tag,
            e.description,
            e.color,
            e.textColor,
            e.timeRange,
            e.venueName,
            e.venueAddress,
            e.lat,
            e.lng,
            e.officialSiteUrl ?? null,
            e.ticketingUrl ?? null,
            e.imageUrl,
            e.multiple ? 1 : 0,
            e.isFavorite ? 1 : 0,
            "",
          ])
        }
        insertEvent.free()
      }

      // Sauvegarde dans le localStorage
      saveDatabaseToLocalStorage(db)

      dbInstance = db
      return dbInstance
    } catch (e) {
      console.error("FATAL SQL.JS INIT ERROR:", e)
      throw e
    }
  })()

  return initPromise
}

// Queries d'accès et mutations
export async function getAllTags(): Promise<Tag[]> {
  const db = await getDatabase()
  const res = db.exec("SELECT id, name, color FROM tags ORDER BY id")
  if (!res.length) return initialTags
  return res[0].values.map(([id, name, color]) => ({
    id: id as string,
    name: name as string,
    color: color as string,
  }))
}

export async function getAllCreators(): Promise<Creator[]> {
  const db = await getDatabase()

  const isNormalized =
    db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='venues'",
    ).length > 0

  // Création d'une map des infos riches issues de seed.ts
  const seedMap = Object.fromEntries(initialCreators.map((c) => [c.id, c]))

  if (isNormalized) {
    const res = db.exec(`
      SELECT
        c.id,
        c.name,
        c.kind,
        COALESCE(c.friend_followers, 0) AS mutuals,
        CASE WHEN s.creator_id IS NOT NULL THEN 1 ELSE 0 END AS isFollowed,
        c.bio,
        COALESCE(c.avatar_url, c.avatarUrl) AS avatarUrl,
        COALESCE(c.followers_count, c.followersCount, 120) AS followersCount,
        COALESCE(c.main_genre_id, c.genreTag) AS genreTag,
        v.address AS address
      FROM creators c
      LEFT JOIN venues v ON c.id = v.id
      LEFT JOIN subscriptions s ON c.id = s.creator_id
      GROUP BY c.id
      ORDER BY c.name
    `)

    if (res.length > 0) {
      return res[0].values.map((row) => {
        const id = row[0] as string
        const seed = seedMap[id]
        return {
          id,
          name: row[1] as string || seed?.name || id,
          kind: row[2] as Creator["kind"] || seed?.kind || "Artiste",
          mutuals: row[3] as number ?? seed?.mutuals ?? 0,
          isFollowed: Boolean(row[4] || seed?.isFollowed),
          bio: row[5] as string || seed?.bio,
          avatarUrl: row[6] as string || seed?.avatarUrl,
          followersCount: row[7] as number || seed?.followersCount || 150,
          genreTag: row[8] as string || seed?.genreTag,
          address: row[9] as string || seed?.address,
        }
      })
    }
  }

  // Fallback requête plate
  const resFlat = db.exec(
    "SELECT id, name, kind, mutuals, isFollowed, bio, avatarUrl, followersCount, genreTag, address FROM creators ORDER BY name",
  )
  if (!resFlat.length) return initialCreators

  return resFlat[0].values.map(
    ([
      id,
      name,
      kind,
      mutuals,
      isFollowed,
      bio,
      avatarUrl,
      followersCount,
      genreTag,
      address,
    ]) => {
      const seed = seedMap[(id as string)]
      return {
        id: id as string,
        name: name as string || seed?.name || "",
        kind: kind as Creator["kind"] || seed?.kind || "Artiste",
        mutuals: mutuals as number ?? seed?.mutuals ?? 0,
        isFollowed: Boolean(isFollowed),
        bio: bio as string || seed?.bio,
        avatarUrl: avatarUrl as string || seed?.avatarUrl,
        followersCount: followersCount as number || seed?.followersCount || 100,
        genreTag: genreTag as string || seed?.genreTag,
        address: address as string || seed?.address,
      }
    },
  )
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDatabase()

  const isNormalized =
    db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='venues'",
    ).length > 0

  // Si base relationnelle agenda.db (avec table venues et colonnes date/start_time)
  if (isNormalized) {
    const res = db.exec(`
      SELECT 
        e.id,
        e.date AS dateStr,
        e.start_time AS hour,
        e.title,
        e.creator_id AS creatorId,
        e.tag_id AS tag,
        COALESCE(e.description, '') AS description,
        COALESCE(t.color, '#ff4e64') AS color,
        '#20242b' AS textColor,
        (e.start_time || CASE WHEN e.end_time IS NOT NULL AND e.end_time != '' THEN ' - ' || e.end_time ELSE '' END) AS timeRange,
        COALESCE(v.name, 'Rennes') AS venueName,
        COALESCE(v.address, 'Rennes') AS venueAddress,
        e.venue_id,
        e.site_url AS officialSiteUrl,
        e.ticket_url AS ticketingUrl,
        e.image_url AS imageUrl,
        0 AS multiple,
        CASE WHEN f.event_id IS NOT NULL THEN 1 ELSE 0 END AS isFavorite,
        COALESCE(e.hashtags, '') AS secondaryTags
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN tags t ON e.tag_id = t.id
      LEFT JOIN favorites f ON e.id = f.event_id
      ORDER BY e.date, e.start_time
    `)

    if (res.length > 0) {
      return res[0].values.map((row) => {
        const venueId = row[12] as string || ""
        const coords = VENUE_COORDS[venueId] || { lat: 48.1113, lng: -1.68 }

        let secondaryTags: string[] = []
        const rawSec = row[18] as string | undefined
        if (rawSec) {
          secondaryTags = rawSec
            .split(",")
            .map((s) => s.trim().replace(/^#/, ""))
            .filter(Boolean)
        }

        return {
          id: row[0] as string,
          dateStr: row[1] as string,
          hour: row[2] as string,
          title: row[3] as string,
          creatorId: row[4] as string || undefined,
          tag: row[5] as string,
          description: row[6] as string || "",
          color: row[7] as string,
          textColor: row[8] as string,
          timeRange: row[9] as string,
          venueName: row[10] as string,
          venueAddress: row[11] as string,
          lat: coords.lat,
          lng: coords.lng,
          officialSiteUrl: row[13] as string || undefined,
          ticketingUrl: row[14] as string || undefined,
          imageUrl: row[15] as string || "/images/events/rock-concert.jpg",
          multiple: Boolean(row[16]),
          isFavorite: Boolean(row[17]),
          secondaryTags,
        }
      })
    }
  }

  // Fallback requête plate standard
  const resFlat = db.exec(`
    SELECT
      id, dateStr, hour, title, creatorId, tag, description, color, textColor,
      timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
      imageUrl, multiple, isFavorite, secondaryTags
    FROM events
    ORDER BY dateStr, hour
  `)

  if (!resFlat.length) return initialEvents

  return resFlat[0].values.map((row) => {
    let secondaryTags: string[] = []
    const rawSec = row[19] as string | undefined
    if (rawSec) {
      try {
        secondaryTags = rawSec.startsWith("[")
          ? JSON.parse(rawSec)
          : rawSec
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
      } catch {
        secondaryTags = []
      }
    }

    return {
      id: row[0] as string,
      dateStr: row[1] as string,
      hour: row[2] as string,
      title: row[3] as string,
      creatorId: row[4] as string || undefined,
      tag: row[5] as string,
      description: row[6] as string || "",
      color: row[7] as string,
      textColor: row[8] as string,
      timeRange: row[9] as string,
      venueName: row[10] as string,
      venueAddress: row[11] as string,
      lat: row[12] as number ?? 48.1113,
      lng: row[13] as number ?? -1.68,
      officialSiteUrl: row[14] as string || undefined,
      ticketingUrl: row[15] as string || undefined,
      imageUrl: row[16] as string || "/images/events/rock-concert.jpg",
      multiple: Boolean(row[17]),
      isFavorite: Boolean(row[18]),
      secondaryTags,
    }
  })
}

export async function toggleFollowCreator(id: string): Promise<boolean> {
  const db = await getDatabase()

  const isNormalized =
    db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='subscriptions'",
    ).length > 0

  if (isNormalized) {
    const existing = db.exec(
      "SELECT 1 FROM subscriptions WHERE creator_id = ? AND user_id = 'user-001'",
      [id],
    )
    const isSubscribed =
      existing.length > 0 && (existing[0]?.values?.length ?? 0) > 0
    if (isSubscribed) {
      db.run(
        "DELETE FROM subscriptions WHERE creator_id = ? AND user_id = 'user-001'",
        [id],
      )
    } else {
      db.run(
        "INSERT INTO subscriptions (creator_id, user_id) VALUES (?, 'user-001')",
        [id],
      )
    }
    saveDatabaseToLocalStorage(db)
    return !isSubscribed
  }

  // Fallback table plate
  db.run("UPDATE creators SET isFollowed = NOT isFollowed WHERE id = ?", [id])
  saveDatabaseToLocalStorage(db)
  const res = db.exec("SELECT isFollowed FROM creators WHERE id = ?", [id])
  return Boolean(res[0]?.values[0]?.[0])
}

export async function toggleFavoriteEvent(id: string): Promise<boolean> {
  const db = await getDatabase()

  const isNormalized =
    db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'",
    ).length > 0

  if (isNormalized) {
    const existing = db.exec(
      "SELECT 1 FROM favorites WHERE event_id = ? AND user_id = 'user-001'",
      [id],
    )
    const isFav = existing.length > 0 && (existing[0]?.values?.length ?? 0) > 0
    if (isFav) {
      db.run(
        "DELETE FROM favorites WHERE event_id = ? AND user_id = 'user-001'",
        [id],
      )
    } else {
      db.run(
        "INSERT INTO favorites (event_id, user_id) VALUES (?, 'user-001')",
        [id],
      )
    }
    saveDatabaseToLocalStorage(db)
    return !isFav
  }

  // Fallback table plate
  db.run("UPDATE events SET isFavorite = NOT isFavorite WHERE id = ?", [id])
  saveDatabaseToLocalStorage(db)
  const res = db.exec("SELECT isFavorite FROM events WHERE id = ?", [id])
  return Boolean(res[0]?.values[0]?.[0])
}

export async function addEvent(
  event: Omit<Event, "id" | "isFavorite">,
): Promise<Event> {
  const db = await getDatabase()
  const id = `evt-${Date.now()}`

  const isNormalized =
    db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='venues'",
    ).length > 0

  if (isNormalized) {
    // Insérer la salle si nécessaire
    const venueId = `venue-${Date.now()}`
    try {
      db.run(
        "INSERT OR IGNORE INTO venues (id, name, address, map_x, map_y) VALUES (?, ?, ?, 50, 50)",
        [venueId, event.venueName, event.venueAddress],
      )
    } catch {}

    const hashtags = (event.secondaryTags || []).join(",")
    db.run(
      `INSERT INTO events (
        id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time,
        image_url, site_url, ticket_url, hashtags, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        id,
        event.title,
        event.description,
        event.tag,
        event.creatorId || null,
        venueId,
        event.dateStr,
        event.hour,
        event.timeRange || null,
        event.imageUrl,
        event.officialSiteUrl || null,
        event.ticketingUrl || null,
        hashtags,
      ],
    )
  } else {
    const secTags = JSON.stringify(event.secondaryTags || [])
    db.run(
      `INSERT INTO events (
        id, dateStr, hour, title, creatorId, tag, description, color, textColor,
        timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
        imageUrl, multiple, isFavorite, secondaryTags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      [
        id,
        event.dateStr,
        event.hour,
        event.title,
        event.creatorId ?? null,
        event.tag,
        event.description,
        event.color,
        event.textColor,
        event.timeRange,
        event.venueName,
        event.venueAddress,
        event.lat,
        event.lng,
        event.officialSiteUrl ?? null,
        event.ticketingUrl ?? null,
        event.imageUrl,
        secTags,
      ],
    )
  }

  saveDatabaseToLocalStorage(db)

  return {
    ...event,
    id,
    isFavorite: false,
  }
}

export async function addTag(tag: {
  id: string
  name: string
  color: string
}): Promise<Tag> {
  const db = await getDatabase()
  db.run("INSERT OR REPLACE INTO tags (id, name, color) VALUES (?, ?, ?)", [
    tag.id,
    tag.name,
    tag.color,
  ])
  saveDatabaseToLocalStorage(db)
  return tag
}
