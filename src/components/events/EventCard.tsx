import type { Event, Creator } from "../../types";
import { initials } from "../../utils/formatters";
import { HeartIcon } from "../common/Icons";

export function CalendarEvent({ event }: { event: Event }) {
  if (event.multiple) {
    return (
      <div className="group relative flex h-full w-full overflow-visible rounded-[7px] shadow-[0_2px_8px_rgba(33,37,41,0.12)] ring-2 ring-white">
        <span className="h-full flex-1 rounded-l-[7px] bg-[#ef5a5a]" />
        <span className="h-full flex-1 bg-[#4e8ff7]" />
        <span className="h-full flex-1 rounded-r-[7px] bg-[#55ae78]" />
        <svg
          className="pointer-events-none absolute -bottom-4 right-2 z-20 h-7 w-7 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
          viewBox="0 0 30 34"
          aria-hidden="true"
        >
          <path
            d="M5 3.2v23.1l5.8-5.2 4.1 9.6 4.2-1.9-4.1-9.2 7.8-.5L5 3.2Z"
            fill="#20242b"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full items-center overflow-hidden rounded-[7px] px-2.5 text-[11px] font-semibold leading-none shadow-[0_1px_4px_rgba(32,38,45,0.08)]"
      style={{ backgroundColor: event.color, color: event.textColor }}
      title={event.title}
    >
      <span className="truncate">{event.title}</span>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  creator?: Creator;
  focused?: boolean;
  onClick?: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function EventCard({
  event,
  creator,
  focused = false,
  onClick,
  onToggleFavorite,
}: EventCardProps) {
  return (
    <article
      className={`relative grid h-[322px] shrink-0 grid-cols-[52%_48%] overflow-hidden rounded-2xl border bg-white transition ${
        focused
          ? "cursor-pointer border-[#ffb2bc] shadow-[0_14px_35px_rgba(48,32,35,0.11)] ring-1 ring-[#ff4e64]/10"
          : "border-[#e5e7ea] shadow-[0_8px_24px_rgba(48,52,58,0.07)]"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col p-8">
        <div>
          <span
            className="inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase"
            style={{ backgroundColor: `${event.textColor}18`, color: event.textColor }}
          >
            #{event.tag}
          </span>
          <h3 className="mt-4 text-[25px] font-bold leading-tight tracking-[-0.025em] text-[#22262c]">
            {event.title}
          </h3>

          {creator && (
            <div className="mt-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef0f2] text-[10px] font-bold text-[#5b626c]">
                {initials(creator.name)}
              </span>
              <span className="text-[13px] font-semibold text-[#343940]">{creator.name}</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-[14px] font-semibold text-[#4a5059]">
            <svg className="h-[18px] w-[18px] text-[#8a9099]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {event.timeRange}
          </div>
        </div>
        <p className="mt-6 max-w-[350px] text-[14px] leading-[1.65] text-[#6b717b]">{event.description}</p>
        <button type="button" className="mt-auto w-fit text-[13px] font-bold text-[#ff4e64]">
          Voir les détails
        </button>
      </div>

      <div className="relative min-w-0 overflow-hidden">
        <img className="h-full w-full object-cover" src={event.imageUrl} alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(e);
          }}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-[0_5px_16px_rgba(0,0,0,0.18)] backdrop-blur-sm transition ${
            event.isFavorite ? "text-[#ff4e64]" : "text-[#444a52] hover:text-[#ff4e64]"
          }`}
          aria-label={`Ajouter ${event.title} aux favoris`}
        >
          <HeartIcon filled={event.isFavorite} />
        </button>
      </div>

      {focused && (
        <svg
          className="pointer-events-none absolute bottom-[70px] left-[39%] z-20 h-9 w-9 drop-shadow-[0_2px_1px_rgba(255,255,255,0.9)]"
          viewBox="0 0 36 40"
          aria-hidden="true"
        >
          <path
            d="M6 3.5v27l6.8-6.1 4.8 11.2 4.9-2.2-4.8-10.7 9.1-.6L6 3.5Z"
            fill="#1d2127"
            stroke="white"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M28 4.5 31 1.5M31 10h4M25.5 1l1-4" stroke="#1d2127" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </article>
  );
}
