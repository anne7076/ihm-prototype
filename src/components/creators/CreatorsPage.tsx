import { useState, useMemo, useEffect } from "react"
import type { Creator, Event } from "../../types"
import { CreatorCard } from "./CreatorCard"
import { SearchIcon, CloseIcon } from "../common/Icons"
import { matchesFuzzy } from "../../utils/fuzzy"

type CategoryTab = "all" | "Artiste" | "Salle" | "BarOrga"

interface CreatorsPageProps {
  creators: Creator[]
  events: Event[]
  initialSearch?: string
  onSelectCreator: (creator: Creator) => void
  onToggleFollow: (id: string) => void
  onSelectEvent: (event: Event) => void
}

export function CreatorsPage({
  creators,
  events,
  initialSearch = "",
  onSelectCreator,
  onToggleFollow,
  onSelectEvent,
}: CreatorsPageProps) {
  const [search, setSearch] = useState(initialSearch)
  const [activeTab, setActiveTab] = useState<CategoryTab>("all")

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch)
    }
  }, [initialSearch])

  // Counts for each tab category
  const counts = useMemo(() => {
    return {
      all: creators.length,
      Artiste: creators.filter((c) => c.kind === "Artiste").length,
      Salle: creators.filter((c) => c.kind === "Salle").length,
      BarOrga: creators.filter(
        (c) => c.kind === "Bar" || c.kind === "Organisme",
      ).length,
    }
  }, [creators])

  // Filter creators by tab category and fuzzy search
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      // Filter by category tab
      if (activeTab === "Artiste" && c.kind !== "Artiste") return false
      if (activeTab === "Salle" && c.kind !== "Salle") return false
      if (activeTab === "BarOrga" && c.kind !== "Bar" && c.kind !== "Organisme")
        return false

      // Filter by fuzzy search
      if (!search.trim()) return true
      return matchesFuzzy(
        search,
        c.name,
        c.kind,
        c.genreTag || "",
        c.address || "",
        c.bio || "",
      )
    })
  }, [creators, activeTab, search])

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fa] text-[#20242b]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
        {/* Titre et en-tête de la page (style Dribbble Discover) */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#ff4e64]">
            Scène locale & Annuaire
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e232b]">
            Découvrir les créateurs de Rennes
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            Suivez vos artistes favoris, découvrez les salles emblématiques et
            soutenez les bars et organisateurs de la métropole.
          </p>
        </div>

        {/* Barre de recherche principale */}
        <div className="mx-auto max-w-xl">
          <div className="relative flex items-center rounded-2xl border border-[#e2e5e9] bg-white px-4 py-1.5 shadow-sm transition focus-within:border-[#ff4e64] focus-within:ring-4 focus-within:ring-[#ff4e64]/10">
            <SearchIcon className="h-5 w-5 text-[#8b929c]" />
            <input
              type="text"
              placeholder="Rechercher par nom, style musical, adresse (ex: Ubu, Rock, Jazz)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-[14px] text-[#222730] outline-none placeholder:text-[#9aa0a6]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5e7eb] text-[#555d68] hover:bg-[#d8dce2] transition"
                aria-label="Effacer"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Onglets de filtrage par type (Dribbble Tabs) */}
        <div className="flex items-center justify-center border-b border-[#e5e7eb] pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${
                activeTab === "all"
                  ? "bg-[#1f242c] text-white shadow-sm"
                  : "bg-white text-[#555d68] hover:bg-[#eceef2] border border-[#e5e7eb]"
              }`}
            >
              Tous ({counts.all})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("Artiste")}
              className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${
                activeTab === "Artiste"
                  ? "bg-[#ff4e64] text-white shadow-sm"
                  : "bg-white text-[#555d68] hover:bg-[#eceef2] border border-[#e5e7eb]"
              }`}
            >
              Artistes ({counts.Artiste})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("Salle")}
              className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${
                activeTab === "Salle"
                  ? "bg-[#ff4e64] text-white shadow-sm"
                  : "bg-white text-[#555d68] hover:bg-[#eceef2] border border-[#e5e7eb]"
              }`}
            >
              Salles ({counts.Salle})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("BarOrga")}
              className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${
                activeTab === "BarOrga"
                  ? "bg-[#ff4e64] text-white shadow-sm"
                  : "bg-white text-[#555d68] hover:bg-[#eceef2] border border-[#e5e7eb]"
              }`}
            >
              Bars & Organismes ({counts.BarOrga})
            </button>
          </div>
        </div>

        {/* Grille de résultats */}
        {filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => {
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
                  compact={false}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d1d5db] bg-white py-16 text-center text-[#6b7280]">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-3 text-[17px] font-bold text-[#1f242c]">
              Aucun créateur trouvé
            </h3>
            <p className="mt-1 text-[13px] text-[#8e95a0]">
              Aucun résultat pour « {search} » dans cette catégorie.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setActiveTab("all")
              }}
              className="mt-4 rounded-xl bg-[#ff4e64] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#f23f56] transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
