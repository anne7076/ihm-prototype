export type CreatorKind = "Artiste" | "Bar" | "Salle";

export type Creator = {
  id: string;
  name: string;
  kind: CreatorKind;
  mutuals?: number;
  isFollowed: boolean;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Event = {
  id: string;
  dateStr: string; // Format ISO: "YYYY-MM-DD" (ex: "2026-10-16")
  hour: string; // ex: "19h00"
  title: string;
  creatorId?: string;
  tag: string;
  description: string;
  color: string;
  textColor: string;
  timeRange: string;
  venueName: string;
  venueAddress: string;
  lat: number;
  lng: number;
  officialSiteUrl?: string;
  ticketingUrl?: string;
  imageUrl: string;
  multiple?: boolean;
  isFavorite: boolean;
};
