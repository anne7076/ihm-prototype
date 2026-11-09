export type CreatorKind = "Artiste" | "Bar" | "Salle" | "Organisme"

export type Creator = {
  id: string

  name: string

  kind: CreatorKind

  mutuals?: number

  isFollowed: boolean

  bio?: string

  avatarUrl?: string

  followersCount?: number

  genreTag?: string

  address?: string
}

export type Tag = {
  id: string

  name: string

  color: string
}

export type Event = {
  id: string

  dateStr: string // Format ISO: "YYYY-MM-DD" (ex: "2026-10-16")

  hour: string // ex: "19h00"

  title: string

  creatorId?: string

  tag: string // Genre prioritaire (définit la couleur d'affichage sur le calendrier)

  secondaryTags?: string[] // Genres/tags secondaires pris en compte dans le filtre et la recherche

  description: string

  color: string

  textColor: string

  timeRange: string

  venueName: string

  venueAddress: string

  lat: number

  lng: number

  officialSiteUrl?: string

  ticketingUrl?: string

  imageUrl: string

  multiple?: boolean

  isFavorite: boolean
}
