import type { Event, Creator } from "../../types";
import { initials } from "../../utils/formatters";
import { EventCard } from "../events/EventCard";

interface DayEventsModalProps {
  events: Event[];
  creators: Creator[];
  onClose: () => void;
  onSelectEvent: (event: Event) => void;
  onToggleFavorite: (id: string) => void;
}

export function DayEventsModal({
  events,
  creators,
  onClose,
  onSelectEvent,
  onToggleFavorite,
}: DayEventsModalProps) {
  const creatorById = Object.fromEntries(creators.map((c) => [c.id, c]));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" onClick={onClose} />
      <section
        className="fixed left-1/2 top-1/2 z-50 flex h-[720px] w-[980px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-[#f8f8f9] shadow-[0_30px_90px_rgba(0,0,0,0.32)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-modal-title"
      >
        <header className="flex h-[82px] shrink-0 items-center justify-between border-b border-[#e5e6e9] bg-white px-8">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff4e64]">
              Événements de la journée
            </p>
            <h2 id="day-modal-title" className="text-[22px] font-bold tracking-[-0.02em] text-[#24282e]">
              Vendredi 16 octobre
            </h2>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] bg-white text-[#59606a] transition hover:bg-[#f3f4f5]"
            aria-label="Fermer"
            onClick={onClose}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="event-list min-h-0 flex-1 overflow-y-scroll px-8 py-7">
          <div className="flex flex-col gap-5 pr-3">
            {events.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                creator={event.creatorId ? creatorById[event.creatorId] : undefined}
                focused={idx === 0}
                onClick={() => onSelectEvent(event)}
                onToggleFavorite={() => onToggleFavorite(event.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
