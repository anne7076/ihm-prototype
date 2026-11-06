import type { Event, Creator } from "../../types";
import { initials } from "../../utils/formatters";
import { HeartIcon } from "../common/Icons";

export function CalendarEvent({ event }: { event: Event }) {
  if (event.multiple) {
    return (
      <div
        className="group relative flex h-full w-full overflow-hidden rounded-[7px] shadow-[0_1px_4px_rgba(32,38,45,0.08)] ring-1 ring-black/5 transition hover:brightness-95"
        title={`${event.title} · Événements multiples`}
      >
        <span className="h-full flex-1 bg-[#f9dedf] border-r border-white/80" />
        <span className="h-full flex-1 bg-[#dce9ff] border-r border-white/80" />
        <span className="h-full flex-1 bg-[#dff3e7]" />
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full items-center overflow-hidden rounded-[7px] px-2.5 text-[11px] font-semibold leading-none shadow-[0_1px_4px_rgba(32,38,45,0.08)] transition hover:brightness-95"
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
      className={`relative grid h-[322px] shrink-0 grid-cols-[52%_48%] overflow-hidden rounded-2xl border bg-white transition-all duration-200 cursor-pointer ${
        focused
          ? "border-[#ff8b99] shadow-[0_16px_36px_rgba(255,78,100,0.16)] ring-2 ring-[#ff4e64]/20"
          : "border-[#e5e7ea] shadow-[0_8px_24px_rgba(48,52,58,0.07)] hover:border-[#ccd1d8] hover:shadow-[0_12px_28px_rgba(48,52,58,0.12)]"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col p-8">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase"
              style={{ backgroundColor: `${event.textColor}18`, color: event.textColor }}
            >
              #{event.tag}
            </span>
            {event.secondaryTags?.map((sec) => (
              <span
                key={sec}
                className="inline-flex rounded-md border border-[#e2e5e8] bg-[#f8f9fa] px-2 py-0.5 text-[10px] font-bold text-[#606772] uppercase"
              >
                #{sec}
              </span>
            ))}
          </div>
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
        <button type="button" className="mt-auto w-fit text-[13px] font-bold text-[#ff4e64] hover:underline">
          Voir les détails &rarr;
        </button>
      </div>

      <div className="relative min-w-0 overflow-hidden">
        <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" src={event.imageUrl} alt={event.title} />
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
    </article>
  );
}
