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

  // Filter out multiple aggregate events to showcase actual concerts
  const trendingEvents = events.filter((e) => !e.multiple).slice(0, 5)

  if (trendingEvents.length === 0) return null

  const currentEvent = trendingEvents[currentIndex] || trendingEvents[0]
  const tagObj = tags.find((t) => t.id === currentEvent.tag)

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? trendingEvents.length - 1 : prev - 1,
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === trendingEvents.length - 1 ? 0 : prev + 1,
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#e5e7eb] bg-white shadow-[0_12px_36px_rgba(20,25,32,0.06)] transition hover:shadow-[0_16px_44px_rgba(20,25,32,0.1)]">
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
        {/* Visuel du concert avec overlay cliquable */}
        <div
          onClick={() => onSelectEvent(currentEvent)}
          className="group relative h-[280px] sm:h-[340px] lg:h-[400px] cursor-pointer overflow-hidden bg-black"
        >
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badge tendance */}
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#ff4e64] animate-pulse" />
            <span className="text-[12px] font-bold tracking-wide text-white uppercase">
              Tendance à venir · Rennes
            </span>
          </div>

          {/* Informations sur l'image */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider mb-2"
              style={{ backgroundColor: tagObj?.color || "#ff4e64" }}
            >
              #{currentEvent.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-black drop-shadow-md group-hover:text-[#ffd2d8] transition">
              {currentEvent.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/90">
              <PinIcon className="h-4 w-4 text-[#ff4e64]" />
              {currentEvent.venueName}
            </p>
          </div>
        </div>

        {/* Détails et navigation du carrousel */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between text-[13px] text-[#787f8a]">
              <span className="font-semibold text-[#ff4e64] uppercase tracking-wider">
                {currentEvent.dateStr}
              </span>
              <span className="font-medium">
                {currentEvent.timeRange || currentEvent.hour}
              </span>
            </div>

            <h4
              onClick={() => onSelectEvent(currentEvent)}
              className="mt-3 cursor-pointer text-2xl font-black text-[#1e232a] hover:text-[#ff4e64] transition"
            >
              {currentEvent.title}
            </h4>

            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#555d68]">
              <PinIcon className="h-4 w-4 shrink-0 text-[#ff4e64]" />
              <span className="truncate">{currentEvent.venueAddress}</span>
            </p>

            <p className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-[#555d68]">
              {currentEvent.description ||
                "Concert live exceptionnel au cœur de Rennes."}
            </p>

            {/* Badges de genres multiples */}
            {currentEvent.secondaryTags &&
              currentEvent.secondaryTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold text-[#9aa0a6] mr-1">
                    Styles :
                  </span>
                  {currentEvent.secondaryTags.map((st) => (
                    <span
                      key={st}
                      className="rounded-full bg-[#f1f3f6] px-2.5 py-0.5 text-[11px] font-bold text-[#555d68]"
                    >
                      #{st}
                    </span>
                  ))}
                </div>
              )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#f0f2f4] pt-5">
            <button
              type="button"
              onClick={() => onSelectEvent(currentEvent)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#ff4e64] px-5 py-3 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(255,78,100,0.28)] transition hover:bg-[#f23f56]"
            >
              Voir la fiche complète →
            </button>

            {/* Flèches de navigation gauche / droite + indicateurs */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                {trendingEvents.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-6 bg-[#ff4e64]"
                        : "w-2 bg-[#d8dce2] hover:bg-[#b8bec7]"
                    }`}
                    aria-label={`Aller au concert ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e5e9] text-[#4b5563] transition hover:bg-[#f3f4f6]"
                  aria-label="Concert précédent"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e5e9] text-[#4b5563] transition hover:bg-[#f3f4f6]"
                  aria-label="Concert suivant"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
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
        </div>
      </div>
    </div>
  )
}
