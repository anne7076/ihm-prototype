import type { Event } from "../../types";
import { days, hours } from "../../utils/formatters";
import { ChevronIcon } from "../common/Icons";
import { CalendarEvent } from "../events/EventCard";

interface CalendarViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  matchesQuery: (event: Event) => boolean;
  tagFilterActive: (event: Event) => boolean;
}

export function CalendarView({
  events,
  onSelectEvent,
  matchesQuery,
  tagFilterActive,
}: CalendarViewProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-white">
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#e8eaed] px-7">
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8]"
            aria-label="Semaine précédente"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8]"
            aria-label="Semaine suivante"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
        <h1 className="text-[17px] font-bold tracking-[-0.01em] text-[#282d34]">
          Semaine du 12 au 18 octobre
        </h1>
        <div className="w-[72px]" aria-hidden="true" />
      </div>

      <div className="grid h-[50px] shrink-0 grid-cols-[76px_repeat(7,minmax(0,1fr))] border-b border-[#e6e8eb] bg-[#fbfbfc]">
        <div className="border-r border-[#e6e8eb]" />
        {days.map((day) => (
          <div
            key={day.name}
            className="flex items-center justify-center gap-2 border-r border-[#e6e8eb] last:border-r-0"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#777f89]">
              {day.name}
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-[#2d3239]">
              {day.date}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1 grid-cols-[76px_repeat(7,minmax(0,1fr))]"
        style={{ gridTemplateRows: `repeat(${hours.length}, minmax(0, 1fr))` }}
      >
        {hours.flatMap((hour) => [
          <div
            key={`${hour}-label`}
            className="relative border-r border-b border-[#eceef0] bg-[#fbfbfc] pr-3 text-right"
          >
            <span className="relative -top-[7px] bg-[#fbfbfc] pl-1 text-[10px] font-medium text-[#a0a6ae]">
              {hour}
            </span>
          </div>,
          ...days.map((day, dayIndex) => {
            const found = events.find((item) => item.day === dayIndex && item.hour === hour);
            const event = found && tagFilterActive(found) ? found : undefined;
            return (
              <div
                key={`${day.name}-${hour}`}
                className={`min-h-0 border-r border-b border-[#eceef0] p-[3px] last:border-r-0 ${
                  event ? "cursor-pointer" : ""
                }`}
                onClick={() => event && onSelectEvent(event)}
              >
                {event && (
                  <div
                    className={`h-full transition-opacity ${
                      matchesQuery(event) ? "" : "opacity-20"
                    }`}
                  >
                    <CalendarEvent event={event} />
                  </div>
                )}
              </div>
            );
          }),
        ])}
      </div>
    </main>
  );
}
