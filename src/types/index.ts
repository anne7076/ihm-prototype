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
  day: number; // 0 = Lundi, 6 = Dimanche
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
