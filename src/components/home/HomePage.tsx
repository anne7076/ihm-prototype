import { useState } from "react"
import type { Event, Creator, Tag } from "../../types"
import { TrendingCarousel } from "./TrendingCarousel"
import { CreatorCard } from "../creators/CreatorCard"
import { SearchIcon } from "../common/Icons"

interface HomePageProps {
  events: Event[]
  creators: Creator[]
  tags: Tag[]
  onNavigateToCreators: (initialSearch?: string) => void
  onNavigateToAgenda: () => void
  onOpenCreateModal: () => void
  onSelectEvent: (event: Event) => void
  onSelectCreator: (creator: Creator) => void
  onToggleFollow: (id: string) => void
}

export function HomePage({
  events,
  creators,
  tags,
  onNavigateToCreators,
  onNavigateToAgenda,
  onOpenCreateModal,
  onSelectEvent,
  onSelectCreator,
  onToggleFollow,
}: HomePageProps) {
  const [creatorSearchQuery, setCreatorSearchQuery] = useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNavigateToCreators(creatorSearchQuery.trim())
  }

  // Preview of 4 featured creators
  const featuredCreators = creators.slice(0, 4)

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fa] text-[#20252c]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-10">
        {/* HERO SECTION : Présentation et Événements Tendance CÔTE À CÔTE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Côté Gauche : Description concise & 3 Piliers */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[#e5e7eb] bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(20,25,35,0.05)]">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1a1f27] leading-tight">
                Participez à la vie{" "}
                <span className="text-[#ff4e64]">musicale</span> rennaise !
              </h1>

              {/* 3 Piliers concis avec icônes SVG */}
              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] px-4 py-3.5 transition hover:border-[#ff4e64]/30 hover:bg-white">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0f2] text-[#ff4e64]">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-semibold text-[#1e232b]">
                    Alertes sur vos artistes et salles favoris
                  </p>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] px-4 py-3.5 transition hover:border-[#4e8ff7]/30 hover:bg-white">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4e8ff7]">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-semibold text-[#1e232b]">
                    Découverte des scènes et talents rennais
                  </p>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] px-4 py-3.5 transition hover:border-[#55ae78]/30 hover:bg-white">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff9f3] text-[#55ae78]">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="12" y1="14" x2="12" y2="18" />
                      <line x1="10" y1="16" x2="14" y2="16" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-semibold text-[#1e232b]">
                    Partage libre de vos concerts
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action rapides */}
            <div className="mt-7 flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateToAgenda}
                className="flex items-center gap-2 rounded-xl bg-[#ff4e64] px-5 py-3 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(255,78,100,0.28)] transition hover:bg-[#f23f56]"
              >
                Voir l'Agenda →
              </button>
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="flex items-center gap-2 rounded-xl border border-[#d8dce2] bg-white px-5 py-3 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                + Poster un événement
              </button>
            </div>
          </div>

          {/* Côté Droit : Événements Tendance à Venir (CÔTE À CÔTE) */}
          <div className="lg:col-span-5 flex flex-col">
            <TrendingCarousel
              events={events}
              tags={tags}
              onSelectEvent={onSelectEvent}
            />
          </div>
        </section>

        {/* SECTION CRÉATEURS : "Découvrir des créateurs" avec recherche incrustée */}
        <section className="space-y-5 rounded-3xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,25,35,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#1e232b]">
              Découvrir des créateurs
            </h2>

            <button
              type="button"
              onClick={() => onNavigateToCreators()}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#ff4e64] hover:underline"
            >
              Tout voir ({creators.length}) →
            </button>
          </div>

          {/* Recherche incrustée dans la section */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center rounded-2xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 py-1 transition focus-within:border-[#ff4e64] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/10 shadow-2xs">
              <SearchIcon className="h-4.5 w-4.5 text-[#8b929c]" />
              <input
                type="text"
                placeholder="Rechercher un artiste, une salle ou un bar..."
                value={creatorSearchQuery}
                onChange={(e) => setCreatorSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 text-[14px] text-[#222730] outline-none placeholder:text-[#9aa0a6]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#1f242c] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#323945]"
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* Grille de cartes de créateurs spacieuses sans écrasement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCreators.map((creator) => {
              const creatorUpcoming = events.find(
                (e) => e.creatorId === creator.id && !e.multiple,
              )
              const pastCount = events.filter(
                (e) => e.creatorId === creator.id,
              ).length

              return (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  upcomingEvent={creatorUpcoming}
                  pastEventsCount={pastCount}
                  onSelectCreator={onSelectCreator}
                  onToggleFollow={onToggleFollow}
                  onSelectEvent={onSelectEvent}
                  compact={true}
                />
              )
            })}
          </div>
        </section>

        {/* Footer sobre */}
        <footer className="border-t border-[#e5e7eb] pt-5 text-center text-[12px] text-[#8e95a0]">
          Agenda Musique · Rennes
        </footer>
      </div>
    </div>
  )
}
