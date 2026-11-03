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
  day: number;
  hour: string;
  title: string;
  creatorId?: string;
  tag: string;
  description: string;
  color: string;
  textColor: string;
  timeRange: string;
  venueName: string;
  venueAddress: string;
  officialSiteUrl?: string;
  ticketingUrl?: string;
  imageUrl: string;
  multiple?: boolean;
  isFavorite: boolean;
};
