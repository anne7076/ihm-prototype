import type { Event, Creator } from "../../types";
import { initials } from "../../utils/formatters";
import { PinIcon, HeartIcon } from "../common/Icons";

interface EventDetailModalProps {
  event: Event;
  creator?: Creator;
  onClose: () => void;
  onBackToDay?: () => void;
  onLocateOnMap: () => void;
  onToggleFavorite: () => void;
}

export function EventDetailModal({
  event,
  creator,
  onClose,
  onBackToDay,
  onLocateOnMap,
  onToggleFavorite,
}: EventDetailModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" onClick={onClose} />
      <section
        className="fixed left-1/2 top-1/2 z-50 flex h-[720px] w-[1040px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.34)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
      >
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6e7ea] px-7">
          {onBackToDay ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-semibold text-[#545b65] transition hover:bg-[#f4f5f6] hover:text-[#252a30]"
              onClick={onBackToDay}
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retour à la journée
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] transition hover:bg-[#f3f4f5]"
            aria-label="Fermer"
            onClick={onClose}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[56%_44%]">
          <div className="min-h-0 overflow-y-auto px-10 py-8">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-[#ff4e64]/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#df3f52] uppercase">
                #{event.tag}
              </span>
              <span className="rounded-md bg-[#f0f1f3] px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#656c75]">
                #FESTIVAL
              </span>
              <span className="rounded-md bg-[#f0f1f3] px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] text-[#656c75]">
                #SCÈNELOCALE
              </span>
            </div>

            <h2 id="event-detail-title" className="max-w-[490px] text-[36px] font-bold leading-[1.08] tracking-[-0.04em] text-[#20242a]">
              {event.title}
            </h2>

            {creator && (
              <div className="mt-4 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f2] text-[11px] font-bold text-[#5b626c]">
                  {initials(creator.name)}
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#343940]">{creator.name}</span>
                  <span className="text-[11px] text-[#858b94]">{creator.kind} · Rennes</span>
                </div>
              </div>
            )}

            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f6f7] text-[#747b84]">
                  <PinIcon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-[#343940]">{event.venueName}</p>
                  <p className="mt-0.5 text-[12px] text-[#858b94]">{event.venueAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f6f7] text-[#747b84]">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="text-[14px] font-bold text-[#343940]">{event.timeRange}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pl-12 text-[12px] font-semibold">
                {event.officialSiteUrl && (
                  <a
                    className="text-[#df3f52] underline decoration-[#df3f52]/30 underline-offset-4 hover:decoration-current"
                    href={event.officialSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Site officiel
                  </a>
                )}
                {event.ticketingUrl && (
                  <a
                    className="text-[#df3f52] underline decoration-[#df3f52]/30 underline-offset-4 hover:decoration-current"
                    href={event.ticketingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Billetterie
                  </a>
                )}
              </div>
            </div>

            <section className="mt-7 rounded-xl border border-[#e3e5e8] bg-[#fafafa] p-5">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#717781]">Description</h3>
              <div className="mt-3 space-y-3 text-[13px] leading-[1.62] text-[#5d646e]">
                <p>{event.description}</p>
              </div>
            </section>
          </div>

          <div className="relative m-5 ml-0 overflow-hidden rounded-2xl bg-[#25262a]">
            <img className="h-full w-full object-cover" src={event.imageUrl} alt={event.title} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/60" />
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition ${
                event.isFavorite ? "text-[#ff4e64]" : "text-[#444a52] hover:text-[#ff4e64]"
              }`}
              aria-label="Ajouter aux favoris"
            >
              <HeartIcon filled={event.isFavorite} />
            </button>
            <button
              type="button"
              onClick={onLocateOnMap}
              className="absolute bottom-5 left-5 right-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-[#2e333a] shadow-[0_8px_25px_rgba(0,0,0,0.22)] transition hover:bg-[#f7f7f8]"
            >
              <PinIcon className="h-[18px] w-[18px] text-[#ff4e64]" />
              Voir sur la carte
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
