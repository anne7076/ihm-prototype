import initSqlJs, { type Database } from "sql.js";
import type { Tag, Creator, Event } from "../types";
import { initialTags, initialCreators, initialEvents } from "./seed";

const STORAGE_KEY = "ihm_rennes_sqlite_db_v2";

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

function saveDatabaseToLocalStorage(db: Database) {
  try {
    const data = db.export();
    let binaryString = "";
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binaryString += String.fromCharCode(data[i]);
    }
    const base64 = btoa(binaryString);
    localStorage.setItem(STORAGE_KEY, base64);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde SQLite dans localStorage:", error);
  }
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });

      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      let db: Database;

      if (saved) {
        try {
          const binaryString = atob(saved);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          db = new SQL.Database(bytes);
        } catch (err) {
          console.warn("Échec du chargement du cache SQLite, réinitialisation:", err);
          db = new SQL.Database();
        }
      } else {
        db = new SQL.Database();
      }

      // Création des tables
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
          isFollowed INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          day INTEGER NOT NULL,
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
          FOREIGN KEY(creatorId) REFERENCES creators(id),
          FOREIGN KEY(tag) REFERENCES tags(id)
        );
      `);

      // Vérifier si la base doit être peuplée
      const tagCountRes = db.exec("SELECT COUNT(*) FROM tags");
      const count = (tagCountRes[0]?.values[0]?.[0] as number) ?? 0;

      if (count === 0) {
        // Insertion des tags
        const insertTag = db.prepare("INSERT INTO tags (id, name, color) VALUES (?, ?, ?)");
        for (const t of initialTags) {
          insertTag.run([t.id, t.name, t.color]);
        }
        insertTag.free();

        // Insertion des créateurs
        const insertCreator = db.prepare("INSERT INTO creators (id, name, kind, mutuals, isFollowed) VALUES (?, ?, ?, ?, ?)");
        for (const c of initialCreators) {
          insertCreator.run([c.id, c.name, c.kind, c.mutuals ?? 0, c.isFollowed ? 1 : 0]);
        }
        insertCreator.free();

        // Insertion des événements
        const insertEvent = db.prepare(`
          INSERT INTO events (
            id, day, hour, title, creatorId, tag, description, color, textColor,
            timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
            imageUrl, multiple, isFavorite
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const e of initialEvents) {
          insertEvent.run([
            e.id,
            e.day,
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
          ]);
        }
        insertEvent.free();

        saveDatabaseToLocalStorage(db);
      }

      dbInstance = db;
      return dbInstance;
    } catch (e) {
      console.error("FATAL SQL.JS INIT ERROR:", e);
      throw e;
    }
  })();

  return initPromise;
}

// Queries d'accès et mutations
export async function getAllTags(): Promise<Tag[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT id, name, color FROM tags ORDER BY id");
  if (!res.length) return [];
  return res[0].values.map(([id, name, color]) => ({
    id: id as string,
    name: name as string,
    color: color as string,
  }));
}

export async function getAllCreators(): Promise<Creator[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT id, name, kind, mutuals, isFollowed FROM creators");
  if (!res.length) return [];
  return res[0].values.map(([id, name, kind, mutuals, isFollowed]) => ({
    id: id as string,
    name: name as string,
    kind: kind as Creator["kind"],
    mutuals: mutuals as number,
    isFollowed: Boolean(isFollowed),
  }));
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDatabase();
  const res = db.exec(`
    SELECT
      id, day, hour, title, creatorId, tag, description, color, textColor,
      timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
      imageUrl, multiple, isFavorite
    FROM events
    ORDER BY day, hour
  `);
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    day: row[1] as number,
    hour: row[2] as string,
    title: row[3] as string,
    creatorId: (row[4] as string) || undefined,
    tag: row[5] as string,
    description: (row[6] as string) || "",
    color: row[7] as string,
    textColor: row[8] as string,
    timeRange: row[9] as string,
    venueName: row[10] as string,
    venueAddress: row[11] as string,
    lat: (row[12] as number) ?? 48.1113,
    lng: (row[13] as number) ?? -1.6800,
    officialSiteUrl: (row[14] as string) || undefined,
    ticketingUrl: (row[15] as string) || undefined,
    imageUrl: row[16] as string,
    multiple: Boolean(row[17]),
    isFavorite: Boolean(row[18]),
  }));
}

export async function toggleFollowCreator(id: string): Promise<boolean> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT isFollowed FROM creators WHERE id = ?");
  stmt.bind([id]);
  let nextState = true;
  if (stmt.step()) {
    const cur = stmt.getAsObject().isFollowed as number;
    nextState = cur === 0;
  }
  stmt.free();

  db.run("UPDATE creators SET isFollowed = ? WHERE id = ?", [nextState ? 1 : 0, id]);
  saveDatabaseToLocalStorage(db);
  return nextState;
}

export async function toggleFavoriteEvent(id: string): Promise<boolean> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT isFavorite FROM events WHERE id = ?");
  stmt.bind([id]);
  let nextState = true;
  if (stmt.step()) {
    const cur = stmt.getAsObject().isFavorite as number;
    nextState = cur === 0;
  }
  stmt.free();

  db.run("UPDATE events SET isFavorite = ? WHERE id = ?", [nextState ? 1 : 0, id]);
  saveDatabaseToLocalStorage(db);
  return nextState;
}

export async function addEvent(event: Omit<Event, "id" | "isFavorite">): Promise<Event> {
  const db = await getDatabase();
  const id = `evt-${Date.now()}`;
  db.run(
    `
    INSERT INTO events (
      id, day, hour, title, creatorId, tag, description, color, textColor,
      timeRange, venueName, venueAddress, lat, lng, officialSiteUrl, ticketingUrl,
      imageUrl, multiple, isFavorite
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    [
      id,
      event.day,
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
      event.multiple ? 1 : 0,
    ]
  );
  saveDatabaseToLocalStorage(db);

  return {
    ...event,
    id,
    isFavorite: false,
  };
}
