import { supabase } from "../lib/supabase";
import type { Creator, Event, Tag } from "../types";

const DEFAULT_USER_ID = "user-001";

const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  etage: { lat: 48.1054, lng: -1.6775 },
  gilbert: { lat: 48.1144, lng: -1.6808 },
  ubu: { lat: 48.1077, lng: -1.6738 },
  antipode: { lat: 48.0988, lng: -1.7126 },
  barhic: { lat: 48.113, lng: -1.683 },
  mondo: { lat: 48.112, lng: -1.679 },
  liberte: { lat: 48.105, lng: -1.677 },
};

const TAG_PALETTE: Record<string, { bg: string; text: string }> = {
  rock: { bg: "#f9dedf", text: "#a82f39" },
  electro: { bg: "#dce9ff", text: "#2866c3" },
  jazz: { bg: "#fff1bd", text: "#8b6710" },
  pop: { bg: "#efe1ff", text: "#7036b5" },
  reggae: { bg: "#dff3e7", text: "#277249" },
};

function requireClient() {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env.",
    );
  }
  return supabase;
}

export async function getAllTags(): Promise<Tag[]> {
  const client = requireClient();
  const { data, error } = await client
    .from("tags")
    .select("id, name, color")
    .order("id");
  if (error) throw error;
  return (data ?? []) as Tag[];
}

export async function getAllCreators(): Promise<Creator[]> {
  const client = requireClient();
  const [
    { data: creators, error: cErr },
    { data: subs, error: sErr },
    { data: venues, error: vErr },
  ] = await Promise.all([
    client.from("creators").select("*").order("name"),
    client
      .from("subscriptions")
      .select("creator_id")
      .eq("user_id", DEFAULT_USER_ID),
    client.from("venues").select("id, address"),
  ]);

  if (cErr) throw cErr;
  if (sErr) throw sErr;
  if (vErr) throw vErr;

  const followedSet = new Set((subs ?? []).map((s) => s.creator_id));
  const venueAddrById = new Map((venues ?? []).map((v) => [v.id, v.address]));

  return (creators ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    kind: row.kind as Creator["kind"],
    mutuals: row.friend_followers ?? 0,
    isFollowed: followedSet.has(row.id),
    bio: row.bio || undefined,
    avatarUrl: row.avatar_url || undefined,
    followersCount: row.followers_count ?? 120,
    genreTag: row.main_genre_id || undefined,
    address: venueAddrById.get(row.id) || undefined,
  }));
}

export async function getAllEvents(): Promise<Event[]> {
  const client = requireClient();
  const [
    { data: events, error: eErr },
    { data: venues, error: vErr },
    { data: tags, error: tErr },
    { data: favs, error: fErr },
  ] = await Promise.all([
    client.from("events").select("*").order("date").order("start_time"),
    client.from("venues").select("*"),
    client.from("tags").select("id, color"),
    client.from("favorites").select("event_id").eq("user_id", DEFAULT_USER_ID),
  ]);

  if (eErr) throw eErr;
  if (vErr) throw vErr;
  if (tErr) throw tErr;
  if (fErr) throw fErr;

  const venueById = new Map((venues ?? []).map((v) => [v.id, v]));
  const tagColorById = new Map((tags ?? []).map((t) => [t.id, t.color]));
  const favSet = new Set((favs ?? []).map((f) => f.event_id));

  return (events ?? []).map((row) => {
    const venue = row.venue_id ? venueById.get(row.venue_id) : undefined;
    const fallbackCoords = (row.venue_id && VENUE_COORDS[row.venue_id]) || {
      lat: 48.1113,
      lng: -1.68,
    };
    const palette = TAG_PALETTE[row.tag_id];
    const tagColor = tagColorById.get(row.tag_id) || "#ff4e64";

    const secondaryTags = row.hashtags
      ? String(row.hashtags)
          .split(",")
          .map((s) => s.trim().replace(/^#/, ""))
          .filter(Boolean)
      : [];

    const startTime: string = row.start_time || "20:00";
    const timeRange =
      row.end_time && row.end_time !== startTime
        ? `${startTime} - ${row.end_time}`
        : startTime;

    return {
      id: row.id,
      dateStr: row.date,
      hour: startTime.replace(":", "h"),
      title: row.title,
      creatorId: row.creator_id || undefined,
      tag: row.tag_id,
      secondaryTags,
      description: row.description || "",
      color: palette?.bg || `${tagColor}22`,
      textColor: palette?.text || tagColor,
      timeRange,
      venueName: venue?.name || "Rennes",
      venueAddress: venue?.address || "Rennes",
      lat: venue?.lat ?? fallbackCoords.lat,
      lng: venue?.lng ?? fallbackCoords.lng,
      officialSiteUrl: row.site_url || undefined,
      ticketingUrl: row.ticket_url || undefined,
      imageUrl: row.image_url || "/images/events/rock-concert.jpg",
      multiple: false,
      isFavorite: favSet.has(row.id),
    };
  });
}

export async function toggleFollowCreator(id: string): Promise<boolean> {
  const client = requireClient();
  const { data: existing, error: selErr } = await client
    .from("subscriptions")
    .select("creator_id")
    .eq("creator_id", id)
    .eq("user_id", DEFAULT_USER_ID)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing) {
    const { error } = await client
      .from("subscriptions")
      .delete()
      .eq("creator_id", id)
      .eq("user_id", DEFAULT_USER_ID);
    if (error) throw error;
    return false;
  }

  const { error } = await client
    .from("subscriptions")
    .insert({ creator_id: id, user_id: DEFAULT_USER_ID });
  if (error) throw error;
  return true;
}

export async function toggleFavoriteEvent(id: string): Promise<boolean> {
  const client = requireClient();
  const { data: existing, error: selErr } = await client
    .from("favorites")
    .select("event_id")
    .eq("event_id", id)
    .eq("user_id", DEFAULT_USER_ID)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing) {
    const { error } = await client
      .from("favorites")
      .delete()
      .eq("event_id", id)
      .eq("user_id", DEFAULT_USER_ID);
    if (error) throw error;
    return false;
  }

  const { error } = await client
    .from("favorites")
    .insert({ event_id: id, user_id: DEFAULT_USER_ID });
  if (error) throw error;
  return true;
}

export async function addEvent(
  event: Omit<Event, "id" | "isFavorite">,
): Promise<Event> {
  const client = requireClient();
  const id = `evt-${Date.now()}`;
  const venueId = `venue-${Date.now()}`;

  const { error: vErr } = await client.from("venues").upsert({
    id: venueId,
    name: event.venueName,
    address: event.venueAddress,
    lat: event.lat,
    lng: event.lng,
  });
  if (vErr) throw vErr;

  const startTime = event.hour.replace("h", ":");
  const endPart = event.timeRange?.includes("-")
    ? event.timeRange.split("-")[1]?.trim().replace("h", ":")
    : null;

  const { error: eErr } = await client.from("events").insert({
    id,
    title: event.title,
    description: event.description || "",
    tag_id: event.tag,
    creator_id: event.creatorId || null,
    venue_id: venueId,
    date: event.dateStr,
    start_time: startTime,
    end_time: endPart || null,
    image_url: event.imageUrl,
    site_url: event.officialSiteUrl || null,
    ticket_url: event.ticketingUrl || null,
    hashtags: (event.secondaryTags || []).join(","),
  });
  if (eErr) throw eErr;

  return {
    ...event,
    id,
    isFavorite: false,
  };
}

export async function addTag(tag: {
  id: string;
  name: string;
  color: string;
}): Promise<Tag> {
  const client = requireClient();
  const { error } = await client.from("tags").upsert(tag);
  if (error) throw error;
  return tag;
}
