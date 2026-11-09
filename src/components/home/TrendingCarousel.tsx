import { useState } from "react"
import type { Event, Tag } from "../../types"
import { PinIcon } from "../common/Icons"

interface TrendingCarouselProps {
  events: Event[]
  tags: Tag[]
  onSelectEvent: (event: Event) => void
}

export function TrendingCarousel({
  events,
  tags,
  onSelectEvent,
}: TrendingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Événements tendance uniques
  const trendingEvents = events.filter((e) => !e.multiple).slice(0, 5)

  if (trendingEvents.length === 0) return null

  const currentEvent = trendingEvents[currentIndex] || trendingEvents[0]
  const tagObj = tags.find((t) => t.id === currentEvent.tag)

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) =>
      prev === 0 ? trendingEvents.length - 1 : prev - 1,
    )
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) =>
      prev === trendingEvents.length - 1 ? 0 : prev + 1,
    )
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgba(20,25,35,0.06)]">
      {/* En-tête compact de la section tendance */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#ff4e64] animate-pulse" />
          <h3 className="text-[14px] font-extrabold uppercase tracking-wider text-[#222730]">
            Événements tendance à venir
          </h3>
        </div>
        <span className="rounded-full bg-[#fff0f2] px-2.5 py-0.5 text-[11px] font-bold text-[#ff4e64]">
          {currentIndex + 1} / {trendingEvents.length}
        </span>
      </div>

      {/* Carte visuelle cliquable de l'événement */}
      <div
        onClick={() => onSelectEvent(currentEvent)}
        className="group relative flex-1 min-h-[260px] sm:min-h-[290px] cursor-pointer overflow-hidden rounded-2xl bg-black transition-transform duration-300 hover:shadow-xl"
        title="Voir la fiche de l'événement"
      >
        <img
          src={currentEvent.imageUrl}
          alt={currentEvent.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Dégradé immersif */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

        {/* Badges du haut */}
        <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
            style={{ backgroundColor: tagObj?.color || "#ff4e64" }}
          >
            #{currentEvent.tag}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1 text-[12px] font-bold text-white/95 backdrop-blur-md">
            {currentEvent.dateStr}
          </span>
        </div>

        {/* Informations de base sur le bas de l'image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80 mb-1">
            <span>{currentEvent.hour}</span>
            {currentEvent.timeRange && (
              <>
                <span>•</span>
                <span>{currentEvent.timeRange}</span>
              </>
            )}
          </div>

          <h4 className="text-xl sm:text-2xl font-black leading-snug drop-shadow-md group-hover:text-[#ff94a2] transition-colors">
            {currentEvent.title}
          </h4>

          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-white/90">
            <PinIcon className="h-4 w-4 shrink-0 text-[#ff4e64]" />
            <span className="truncate">{currentEvent.venueName}</span>
          </p>
        </div>
      </div>

      {/* Barre de commandes et pagination du carrousel */}
      <div className="mt-4 flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {trendingEvents.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(idx)
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-6 bg-[#ff4e64]"
                  : "w-2 bg-[#d8dce2] hover:bg-[#b0b7c2]"
              }`}
              aria-label={`Aller au concert ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e5e9] bg-[#f8f9fa] text-[#4b5563] transition hover:bg-[#eef1f4] hover:text-[#1f242c]"
            aria-label="Précédent"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L8.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e5e9] bg-[#f8f9fa] text-[#4b5563] transition hover:bg-[#eef1f4] hover:text-[#1f242c]"
            aria-label="Suivant"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L11.586 10 7.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
