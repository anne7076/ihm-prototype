import type { Creator, Event } from "../../types"
import { initials } from "../../utils/formatters"
import { PinIcon } from "../common/Icons"

interface CreatorCardProps {
  creator: Creator
  upcomingEvent?: Event
  pastEventsCount: number
  onSelectCreator: (creator: Creator) => void
  onToggleFollow: (id: string) => void
  onSelectEvent?: (event: Event) => void
  compact?: boolean
}

export function CreatorCard({
  creator,
  upcomingEvent,
  pastEventsCount,
  onSelectCreator,
  onToggleFollow,
  onSelectEvent,
  compact = false,
}: CreatorCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_4px_16px_rgba(20,25,32,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4e64]/30 hover:shadow-[0_12px_28px_rgba(20,25,32,0.08)]">
      <div>
        {/* En-tête : Avatar + Nom et Type (sur toute la largeur, pas de coupure) */}
        <div
          onClick={() => onSelectCreator(creator)}
          className="flex items-center gap-3.5 cursor-pointer"
        >
          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-black/5 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4e64] to-[#ff7e8e] text-base font-black text-white shadow-xs">
              {initials(creator.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-extrabold text-[#1f242c] transition group-hover:text-[#ff4e64]">
              {creator.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-bold text-[#555d68]">
                {creator.kind}
              </span>
              <span className="text-[11px] text-[#787f8a]">
                {creator.followersCount || 100} abonnés
              </span>
            </div>
          </div>
        </div>

        {/* Adresse si disponible */}
        {creator.address && (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#6b7280]">
            <PinIcon className="h-3.5 w-3.5 shrink-0 text-[#ff4e64]" />
            <span className="truncate">{creator.address}</span>
          </p>
        )}

        {/* Courte bio si non-compact */}
        {!compact && creator.bio && (
          <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#555d68]">
            {creator.bio}
          </p>
        )}
      </div>

      {/* Partie basse : Prochain concert & Footer */}
      <div className="mt-4 border-t border-[#f0f2f4] pt-3 space-y-2.5">
        {upcomingEvent ? (
          <div
            onClick={() => onSelectEvent?.(upcomingEvent)}
            className="flex items-center justify-between rounded-xl bg-[#fff2f4] p-2 px-3 text-[12px] cursor-pointer hover:bg-[#ffe5e9] transition"
          >
            <div className="min-w-0 flex-1">
              <span className="block font-extrabold text-[#ff4e64] text-[9.5px] uppercase tracking-wider">
                Prochain concert
              </span>
              <span className="truncate block font-semibold text-[#20252c] text-[12px]">
                {upcomingEvent.title}
              </span>
            </div>
            <span className="ml-2 shrink-0 font-bold text-[#ff4e64] text-[11px]">
              {upcomingEvent.dateStr.slice(5)}
            </span>
          </div>
        ) : (
          <div className="rounded-xl bg-[#f8f9fa] p-2 px-3 text-[11px] text-[#8e95a0]">
            Aucun concert cette semaine
          </div>
        )}

        {/* Actions : Événements passés + Bouton Suivre */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => onSelectCreator(creator)}
            className="text-[11px] font-medium text-[#717882] hover:text-[#ff4e64] transition"
          >
            {pastEventsCount} concert{pastEventsCount > 1 ? "s" : ""} passé
            {pastEventsCount > 1 ? "s" : ""}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFollow(creator.id)
            }}
            className={`rounded-xl px-3 py-1.5 text-[11.5px] font-bold transition shadow-2xs ${
              creator.isFollowed
                ? "border border-[#e2e5e9] bg-[#f8f9fa] text-[#4b5563] hover:bg-[#eef1f4]"
                : "bg-[#ff4e64] text-white hover:bg-[#f23f56] shadow-[0_2px_8px_rgba(255,78,100,0.22)]"
            }`}
          >
            {creator.isFollowed ? "Abonné(e)" : "+ Suivre"}
          </button>
        </div>
      </div>
    </div>
  )
}
