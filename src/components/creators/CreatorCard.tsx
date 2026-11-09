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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-[#e5e7eb] bg-white p-5 shadow-[0_6px_20px_rgba(20,25,32,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4e64]/30 hover:shadow-[0_14px_34px_rgba(20,25,32,0.09)]">
      <div>
        {/* En-tête : Avatar, Nom, Badge et Bouton Suivre */}
        <div className="flex items-start justify-between gap-3">
          <div
            onClick={() => onSelectCreator(creator)}
            className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
          >
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-[#ff4e64]/10 transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4e64] to-[#ff7e8e] text-lg font-black text-white shadow-sm">
                {initials(creator.name)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[16px] font-bold text-[#20252c] transition group-hover:text-[#ff4e64]">
                {creator.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-[#f3f4f6] px-2.5 py-0.5 text-[11px] font-bold text-[#555d68]">
                  {creator.kind}
                </span>
                <span className="text-[11px] text-[#787f8a]">
                  {creator.followersCount || 100} abonnés
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFollow(creator.id)
            }}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-bold transition shadow-xs ${
              creator.isFollowed
                ? "border border-[#e2e5e9] bg-[#f8f9fa] text-[#4b5563] hover:bg-[#eef1f4]"
                : "bg-[#ff4e64] text-white hover:bg-[#f23f56] shadow-[0_3px_8px_rgba(255,78,100,0.22)]"
            }`}
          >
            {creator.isFollowed ? "Abonné(e)" : "+ Suivre"}
          </button>
        </div>

        {/* Adresse (pour les salles et bars) */}
        {creator.address && (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#6b7280]">
            <PinIcon className="h-3.5 w-3.5 shrink-0 text-[#ff4e64]" />
            <span className="truncate">{creator.address}</span>
          </p>
        )}

        {/* Bio courte */}
        {!compact && creator.bio && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[#555d68]">
            {creator.bio}
          </p>
        )}
      </div>

      {/* Pied de carte : Prochain événement & Événements passés */}
      <div className="mt-5 border-t border-[#f0f2f4] pt-3.5 space-y-2">
        {upcomingEvent ? (
          <div
            onClick={() => onSelectEvent?.(upcomingEvent)}
            className="flex items-center justify-between rounded-xl bg-[#fff2f4] p-2 px-3 text-[12px] cursor-pointer hover:bg-[#ffe5e9] transition"
          >
            <div className="min-w-0 flex-1">
              <span className="block font-bold text-[#ff4e64] text-[10px] uppercase tracking-wider">
                Prochain concert
              </span>
              <span className="truncate block font-semibold text-[#20252c]">
                {upcomingEvent.title}
              </span>
            </div>
            <span className="ml-2 shrink-0 font-bold text-[#ff4e64] text-[11px]">
              {upcomingEvent.dateStr.slice(5)}
            </span>
          </div>
        ) : (
          <div className="rounded-xl bg-[#f8f9fa] p-2 px-3 text-[11px] text-[#8e95a0]">
            Pas de concert annoncé cette semaine
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-[#717882] px-1">
          <button
            type="button"
            onClick={() => onSelectCreator(creator)}
            className="hover:text-[#ff4e64] hover:underline font-medium"
          >
            {pastEventsCount} concert{pastEventsCount > 1 ? "s" : ""} passé
            {pastEventsCount > 1 ? "s" : ""}
          </button>

          <button
            type="button"
            onClick={() => onSelectCreator(creator)}
            className="font-bold text-[#ff4e64] hover:underline flex items-center gap-0.5"
          >
            Voir le profil →
          </button>
        </div>
      </div>
    </div>
  )
}
