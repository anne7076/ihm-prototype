import type { Creator, Event } from "../../types"
import { initials } from "../../utils/formatters"
import { PinIcon } from "../common/Icons"

interface CreatorDetailModalProps {
  creator: Creator
  upcomingEvents: Event[]
  pastEvents: Event[]
  onClose: () => void
  onToggleFollow: (id: string) => void
  onSelectEvent: (event: Event) => void
}

export function CreatorDetailModal({
  creator,
  upcomingEvents,
  pastEvents,
  onClose,
  onToggleFollow,
  onSelectEvent,
}: CreatorDetailModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={onClose}
      />
      <section
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[920px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="creator-detail-name"
      >
        {/* En-tête de la modale */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e6e7ea] px-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#555d68]">
              Profil {creator.kind}
            </span>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] transition hover:bg-[#f3f4f5]"
            aria-label="Fermer"
            onClick={onClose}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* Corps de la modale avec défilement */}
        <div className="overflow-y-auto px-8 py-6 space-y-7">
          {/* Bannière et informations principales du créateur */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-[#f0f2f4] pb-6">
            <div className="flex items-center gap-4">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[#ff4e64]/20 shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4e64] to-[#ff7d8d] text-2xl font-black text-white shadow-md">
                  {initials(creator.name)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2.5">
                  <h2
                    id="creator-detail-name"
                    className="text-2xl font-bold text-[#1f242c]"
                  >
                    {creator.name}
                  </h2>
                  <span className="rounded-full bg-[#ff4e64]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#ff4e64]">
                    {creator.kind}
                  </span>
                  {creator.genreTag && (
                    <span className="rounded-full bg-[#f1f3f6] px-2.5 py-0.5 text-[11px] font-bold text-[#555d68]">
                      #{creator.genreTag}
                    </span>
                  )}
                </div>

                {creator.address && (
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                    <PinIcon className="h-3.5 w-3.5 text-[#ff4e64]" />
                    {creator.address}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-4 text-[12px] text-[#717882]">
                  <span>
                    <strong className="font-bold text-[#20252c]">
                      {creator.followersCount || 120}
                    </strong>{" "}
                    abonnés
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="font-bold text-[#20252c]">
                      {upcomingEvents.length}
                    </strong>{" "}
                    à venir
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="font-bold text-[#20252c]">
                      {pastEvents.length}
                    </strong>{" "}
                    passés
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFollow(creator.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition shadow-sm ${
                creator.isFollowed
                  ? "border border-[#e2e5e9] bg-[#f8f9fa] text-[#4b5563] hover:bg-[#eef1f4]"
                  : "bg-[#ff4e64] text-white hover:bg-[#f23f56] shadow-[0_4px_12px_rgba(255,78,100,0.25)]"
              }`}
            >
              {creator.isFollowed ? (
                <>
                  <svg
                    className="h-4 w-4 text-[#ff4e64]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Abonné(e)
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  S'abonner
                </>
              )}
            </button>
          </div>

          {/* Bio / Description */}
          {creator.bio && (
            <div className="rounded-2xl bg-[#f9fafb] border border-[#f0f2f5] p-4 text-[14px] leading-relaxed text-[#4b5563]">
              <p>{creator.bio}</p>
            </div>
          )}

          {/* Section: Événements à venir */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#1f242c]">
                Événements programmés ({upcomingEvents.length})
              </h3>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingEvents.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => {
                      onClose()
                      onSelectEvent(evt)
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-3 text-left transition hover:border-[#ff4e64]/40 hover:shadow-md group"
                  >
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#ff4e64]">
                        <span>{evt.dateStr}</span>
                        <span>•</span>
                        <span>{evt.hour}</span>
                      </div>
                      <h4 className="truncate text-[13px] font-bold text-[#20252c] group-hover:text-[#ff4e64]">
                        {evt.title}
                      </h4>
                      <p className="truncate text-[11px] text-[#6b7280]">
                        {evt.venueName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#e2e5e9] py-6 text-center text-[13px] text-[#8e95a0]">
                Aucun concert programmé pour le moment.
              </p>
            )}
          </div>

          {/* Section: Événements passés */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#1f242c]">
                Historique des événements passés ({pastEvents.length})
              </h3>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pastEvents.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => {
                      onClose()
                      onSelectEvent(evt)
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-3 text-left transition hover:bg-white hover:border-[#ff4e64]/40 hover:shadow-sm group"
                  >
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover grayscale-[30%] group-hover:grayscale-0 transition"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-[#8b929c]">
                        {evt.dateStr} · {evt.hour}
                      </div>
                      <h4 className="truncate text-[13px] font-bold text-[#30353b] group-hover:text-[#ff4e64]">
                        {evt.title}
                      </h4>
                      <p className="truncate text-[11px] text-[#6b7280]">
                        {evt.venueName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#e2e5e9] py-4 text-center text-[12px] text-[#8e95a0]">
                Aucun événement archivé pour ce créateur.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
