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
          {/* Côté Gauche : Description de l'application & 3 Piliers */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[#e5e7eb] bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(20,25,35,0.05)]">
            <div>
              <span className="inline-block rounded-full bg-[#ff4e64]/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ff4e64] mb-3">
                Agenda Collaboratif · Rennes
              </span>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1a1f27] leading-tight">
                Participez à la vie{" "}
                <span className="text-[#ff4e64]">musicale</span> rennaise !
              </h1>

              <p className="mt-3 text-[14.5px] text-[#555d68] leading-relaxed">
                La plateforme collaborative pour vivre au rythme des concerts,
                découvrir les talents locaux et faire vibrer les scènes, bars et
                festivals de Rennes Métropole.
              </p>

              {/* 3 Piliers avec icônes SVG soignées (pas d'emojis) */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] p-3.5 transition hover:border-[#ff4e64]/30 hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f2] text-[#ff4e64]">
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
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1e232b]">
                      Alertes & favoris
                    </h4>
                    <p className="mt-0.5 text-[12px] text-[#6b7280] leading-snug">
                      Soyez prévenu des concerts de vos artistes et de vos
                      salles préférés.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] p-3.5 transition hover:border-[#4e8ff7]/30 hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4e8ff7]">
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
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1e232b]">
                      Découverte locale
                    </h4>
                    <p className="mt-0.5 text-[12px] text-[#6b7280] leading-snug">
                      Explorez la scène indépendante, les scènes underground et
                      les nouveaux talents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-[#f0f2f5] bg-[#fafbfc] p-3.5 transition hover:border-[#55ae78]/30 hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff9f3] text-[#55ae78]">
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
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1e232b]">
                      Poster vos concerts
                    </h4>
                    <p className="mt-0.5 text-[12px] text-[#6b7280] leading-snug">
                      Ajoutez gratuitement vos propres événements avec adresse
                      GPS certifiée.
                    </p>
                  </div>
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
                Explorer l'Agenda en direct →
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
        <section className="space-y-6 rounded-3xl border border-[#e5e7eb] bg-white p-6 sm:p-9 shadow-[0_8px_30px_rgba(20,25,35,0.04)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff4e64]">
                Communauté & Lieux
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e232b]">
                Découvrir des créateurs rennais
              </h2>
              <p className="mt-1 text-[13.5px] text-[#6b7280]">
                Artistes, scènes mythiques et bars musicaux de la métropole.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToCreators()}
              className="flex items-center gap-1.5 self-start md:self-end text-[13px] font-bold text-[#ff4e64] hover:underline"
            >
              Explorer tous les créateurs ({creators.length}) →
            </button>
          </div>

          {/* Recherche incrustée dans la section */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center rounded-2xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 py-1 transition focus-within:border-[#ff4e64] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/10 shadow-2xs">
              <SearchIcon className="h-4.5 w-4.5 text-[#8b929c]" />
              <input
                type="text"
                placeholder="Rechercher un artiste, une salle ou un bar rennais (ex: L'Ubu, Neon Pulse, L'Antipode)..."
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

        {/* Footer simple et sobre */}
        <footer className="border-t border-[#e5e7eb] pt-6 text-center text-[12px] text-[#8e95a0]">
          <p className="font-semibold text-[#555d68]">
            Agenda Musical Collaboratif – Rennes Métropole
          </p>
          <p className="mt-0.5">
            Projet IHM · INSA Rennes · Base SQLite locale
          </p>
        </footer>
      </div>
    </div>
  )
}
