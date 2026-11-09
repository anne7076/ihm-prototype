import { useState, useRef, useEffect, useMemo } from "react"
import { SearchIcon, PinIcon, CloseIcon } from "./Icons"
import type { Tag } from "../../types"
import { filterAndRankFuzzy } from "../../utils/fuzzy"
import { reloadDatabaseFromDisk } from "../../db"

interface HeaderProps {
  currentPage: "home" | "creators" | "app"
  activeView: "calendar" | "map"
  onNavigatePage: (
    page: "home" | "creators" | "app",
    view?: "calendar" | "map",
  ) => void
  onNavigateFavorites: () => void
  query: string
  onQueryChange: (q: string) => void
  tags?: Tag[]
  onOpenCreateModal: () => void
  favoritesCount?: number
  followedCount?: number
}

export function Header({
  currentPage,
  activeView,
  onNavigatePage,
  onNavigateFavorites,
  query,
  onQueryChange,
  tags = [],
  onOpenCreateModal,
  favoritesCount = 0,
  followedCount = 0,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Suggestions de tags/genres uniquement (filtre propre et ciblé)
  const matchingTags = useMemo(() => {
    if (!query.trim() || !tags.length) return []
    const cleanQ = query.replace(/^#/, "")
    return filterAndRankFuzzy(tags, cleanQ, (t) => `${t.name} #${t.id}`).slice(
      0,
      6,
    )
  }, [tags, query])

  const handleSelectTag = (tagId: string) => {
    onQueryChange(`#${tagId}`)
    setIsSuggestionsOpen(false)
    if (currentPage !== "app") {
      onNavigatePage("app", "calendar")
    }
  }

  return (
    <header className="grid h-[74px] grid-cols-[auto_1fr_auto] items-center border-b border-[#e5e7eb] bg-white px-5 sm:px-6 gap-4 sm:gap-6 z-30">
      {/* Logo & Titre (Cliquer retourne à l'accueil) */}
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onNavigatePage("home")}
          className="flex items-center gap-3 text-left group transition"
          title="Retour à l'accueil"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#ff4e64] shadow-[0_5px_12px_rgba(255,78,100,0.22)] group-hover:scale-105 transition-transform">
            <span className="flex items-end gap-[2px]" aria-hidden="true">
              <i className="h-3.5 w-[3.5px] rounded-full bg-white/90" />
              <i className="h-5.5 w-[3.5px] rounded-full bg-white" />
              <i className="h-3 w-[3.5px] rounded-full bg-white/90" />
              <i className="h-4.5 w-[3.5px] rounded-full bg-white" />
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="block text-[14px] font-black tracking-wide text-[#20252c] group-hover:text-[#ff4e64] transition-colors">
              AGENDA MUSIQUE
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b929c]">
              Rennes Métropole
            </span>
          </div>
        </button>
      </div>

      {/* Barre de recherche avec autocomplétion intelligente */}
      <div
        className="relative mx-auto w-full max-w-[500px]"
        ref={searchContainerRef}
      >
        <label className="relative flex h-11 items-center gap-3 rounded-xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 text-[#8b929c] transition focus-within:border-[#ff8a98] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/5 shadow-xs">
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[#8b929c]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#30353b] outline-none placeholder:text-[#9ba1aa]"
            placeholder="Filtrer par genre musical (#rock, #electro, #jazz)..."
            aria-label="Recherche de tags en direct"
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value)
              setIsSuggestionsOpen(true)
            }}
            onFocus={() => setIsSuggestionsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsSuggestionsOpen(false)
              }
              if (e.key === "Enter" && query.trim() && currentPage !== "app") {
                onNavigatePage("app", "calendar")
              }
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                onQueryChange("")
                setIsSuggestionsOpen(false)
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e2e5e9] text-[#555d68] hover:bg-[#d0d4da] transition"
              aria-label="Effacer la recherche"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          )}
        </label>

        {/* Liste déroulante de suggestions de tags "as you type" */}
        {isSuggestionsOpen && query.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 z-[600] overflow-hidden rounded-2xl border border-[#e2e5e9] bg-white p-2 shadow-[0_16px_40px_rgba(20,25,32,0.18)]">
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9ba1aa]">
              <span>Genres & Tags</span>
              <span className="text-[10px] text-[#717882]">Filtre direct</span>
            </div>

            {matchingTags.length > 0 ? (
              <div className="space-y-1">
                {matchingTags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTag(t.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-[#fff2f4] group"
                  >
                    <span className="flex items-center gap-2.5">
                      <i
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-[13px] font-bold text-[#222730] group-hover:text-[#dd4052]">
                        #{t.id}
                      </span>
                      <span className="text-[12px] text-[#717882]">
                        ({t.name})
                      </span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#dd4052] opacity-0 group-hover:opacity-100 transition-opacity">
                      Filtrer l'agenda →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-[12px] text-[#8e95a0]">
                Aucun genre correspondant à « {query} ».
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions : + Poster, Agenda, Map & Profil */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        {/* Bouton + Poster un événement */}
        <button
          onClick={onOpenCreateModal}
          className="flex h-11 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#ff4e64] px-4 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(255,78,100,0.25)] transition hover:bg-[#f23f56]"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">Poster</span>
        </button>

        {/* Bouton Agenda */}
        <button
          type="button"
          onClick={() => onNavigatePage("app", "calendar")}
          className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 sm:px-3.5 text-[13px] font-bold transition ${
            currentPage === "app" && activeView === "calendar"
              ? "border-[#ffd2d8] bg-[#fff2f4] text-[#dd4052]"
              : "border-[#dde0e4] bg-white text-[#40464f] hover:bg-[#f8f9fa]"
          }`}
          title="Afficher l'agenda"
        >
          <svg
            className="h-[17px] w-[17px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="3.5"
              y="5.5"
              width="17"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="hidden sm:inline">Agenda</span>
        </button>

        {/* Bouton Carte */}
        <button
          type="button"
          onClick={() => onNavigatePage("app", "map")}
          className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 sm:px-3.5 text-[13px] font-bold transition ${
            currentPage === "app" && activeView === "map"
              ? "border-[#ffd2d8] bg-[#fff2f4] text-[#dd4052]"
              : "border-[#dde0e4] bg-white text-[#40464f] hover:bg-[#f8f9fa]"
          }`}
          title="Afficher la carte"
        >
          <PinIcon className="h-[17px] w-[17px]" />
          <span className="hidden sm:inline">Map</span>
        </button>

        {/* Profil utilisateur interactif */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e6dd] text-[#6f5141] ring-2 ring-white shadow-xs transition hover:ring-[#ff4e64]/40"
            aria-label="Ouvrir le menu de profil"
            title="Mon profil"
          >
            <span className="text-[12px] font-extrabold uppercase tracking-wide">
              MR
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_18px_40px_rgba(26,30,36,0.18)]">
              <div className="flex items-center gap-3 border-b border-[#f0f2f4] pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff4e64] text-[13px] font-extrabold text-white shadow-xs">
                  MR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#22262d]">
                    Mahamadou
                  </p>
                  <p className="truncate text-[11px] text-[#787f8a]">
                    Membre · INSA Rennes
                  </p>
                </div>
              </div>

              {/* Liens interactifs vers Favoris et Créateurs */}
              <div className="mt-3 space-y-1 text-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onNavigateFavorites()
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 transition hover:bg-[#fff0f2] group text-left cursor-pointer"
                  title="Voir les concerts en favoris"
                >
                  <span className="text-[12.5px] font-medium text-[#4b5563] group-hover:text-[#ff4e64]">
                    Concerts en favoris
                  </span>
                  <span className="rounded-full bg-[#fff0f2] px-2 py-0.5 font-bold text-[#ff4e64] group-hover:bg-[#ff4e64] group-hover:text-white transition">
                    {favoritesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onNavigatePage("creators")
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 transition hover:bg-[#f3f4f6] group text-left cursor-pointer"
                  title="Voir tous les abonnements créateurs"
                >
                  <span className="text-[12.5px] font-medium text-[#4b5563] group-hover:text-[#20252c]">
                    Abonnements créateurs
                  </span>
                  <span className="rounded-full bg-[#f1f3f5] px-2 py-0.5 font-bold text-[#30353c] group-hover:bg-[#1f242c] group-hover:text-white transition">
                    {followedCount}
                  </span>
                </button>
              </div>

              <div className="mt-3 border-t border-[#f0f2f4] pt-2 flex items-center justify-between text-[11px] text-[#8e95a0]">
                <div>
                  <p>Agenda Musical v3.0</p>
                  <p className="text-[10px] text-[#555d68]">
                    Base agenda.db active
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsProfileOpen(false)
                    await reloadDatabaseFromDisk()
                    window.location.reload()
                  }}
                  className="rounded-lg border border-[#e2e5e9] bg-[#f8f9fa] px-2 py-1 text-[10.5px] font-bold text-[#555d68] hover:bg-[#eef1f4] hover:text-[#ff4e64] transition"
                  title="Recharger la base agenda.db depuis le fichier"
                >
                  ⟳ Recharger agenda.db
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
