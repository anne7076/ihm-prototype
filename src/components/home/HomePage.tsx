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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-14">
        {/* HERO SECTION : "Participez à la vie musicale rennaise !" */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#181d26] via-[#242b38] to-[#12161f] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(20,25,35,0.2)]">
          {/* Cercles d'ambiance en arrière-plan */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#ff4e64]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#4e8ff7]/15 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block rounded-full bg-[#ff4e64]/20 px-4 py-1 text-[12px] font-bold uppercase tracking-wider text-[#ff8090] backdrop-blur-md mb-4">
              Agenda Musical Collaboratif · Rennes
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Participez à la vie{" "}
              <span className="text-[#ff5c72]">musicale</span> rennaise !
            </h1>

            <p className="mt-4 text-[15px] sm:text-[17px] text-[#c3cad4] leading-relaxed">
              La plateforme collaborative pour vivre au rythme des concerts,
              découvrir les artistes locaux et faire vibrer les salles et bars
              de Rennes.
            </p>

            {/* Trois points clés de l'application */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4e64]/20 text-[#ff7082] text-xl">
                  🔔
                </span>
                <div>
                  <h4 className="text-[14px] font-bold text-white">
                    Alertes & favoris
                  </h4>
                  <p className="mt-1 text-[12px] text-[#a4adb8] leading-snug">
                    Soyez prévenu des concerts de vos artistes et salles
                    préférés.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4e8ff7]/20 text-[#71a5f9] text-xl">
                  🎸
                </span>
                <div>
                  <h4 className="text-[14px] font-bold text-white">
                    Découverte locale
                  </h4>
                  <p className="mt-1 text-[12px] text-[#a4adb8] leading-snug">
                    Explorez de nouveaux talents, scènes underground et
                    festivals rennais.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#55ae78]/20 text-[#7bd39e] text-xl">
                  ➕
                </span>
                <div>
                  <h4 className="text-[14px] font-bold text-white">
                    Poster vos concerts
                  </h4>
                  <p className="mt-1 text-[12px] text-[#a4adb8] leading-snug">
                    Ajoutez gratuitement vos propres événements avec
                    localisation GPS.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action rapides */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onNavigateToAgenda}
                className="flex items-center gap-2 rounded-xl bg-[#ff4e64] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_6px_20px_rgba(255,78,100,0.35)] transition hover:bg-[#f23f56]"
              >
                Explorer l'Agenda en direct →
              </button>
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-[14px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                + Poster un événement
              </button>
            </div>
          </div>
        </section>

        {/* SECTION CARROUSEL : "Événement tendance à venir" */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#ff4e64]">
                À ne pas manquer
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e232b]">
                Événements tendance à venir
              </h2>
            </div>
            <p className="hidden sm:block text-[13px] text-[#717882]">
              Cliquez sur un concert pour consulter sa fiche détaillée
            </p>
          </div>

          <TrendingCarousel
            events={events}
            tags={tags}
            onSelectEvent={onSelectEvent}
          />
        </section>

        {/* SECTION CRÉATEURS : "Découvrir des créateurs" avec recherche incrustée */}
        <section className="space-y-6 rounded-[28px] border border-[#e5e7eb] bg-white p-6 sm:p-10 shadow-[0_10px_30px_rgba(20,25,32,0.03)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#ff4e64]">
                Communauté & Lieux
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e232b]">
                Découvrir des créateurs rennais
              </h2>
              <p className="mt-1 text-[14px] text-[#6b7280]">
                Artistes, salles emblématiques et bars musicaux qui font vibrer
                la métropole.
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
            <div className="relative flex items-center rounded-2xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 py-1 transition focus-within:border-[#ff4e64] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/10 shadow-xs">
              <SearchIcon className="h-5 w-5 text-[#8b929c]" />
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

          {/* Grille de cartes de créateurs vedettes */}
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

        {/* Footer simple et élégant */}
        <footer className="border-t border-[#e5e7eb] pt-8 text-center text-[12px] text-[#8e95a0]">
          <p className="font-semibold text-[#555d68]">
            Agenda Musical Collaboratif – Rennes Métropole
          </p>
          <p className="mt-1">
            Développé pour l'IHM · INSA Rennes · Base de données SQLite locale
            synchronisée
          </p>
        </footer>
      </div>
    </div>
  )
}
