import type { Event } from "../../types";
import { getWeekDays, getWeekLabel, hours } from "../../utils/formatters";
import { ChevronIcon } from "../common/Icons";
import { CalendarEvent } from "../events/EventCard";

interface CalendarViewProps {
  events: Event[];
  weekOffset: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectEvent: (event: Event) => void;
  onSelectDay: (dayIndex: number) => void;
  selectedDayIndex: number;
  matchesQuery: (event: Event) => boolean;
  tagFilterActive: (event: Event) => boolean;
}

export function CalendarView({
  events,
  weekOffset,
  onPrevWeek,
  onNextWeek,
  onSelectEvent,
  onSelectDay,
  selectedDayIndex,
  matchesQuery,
  tagFilterActive,
}: CalendarViewProps) {
  const weekDays = getWeekDays(weekOffset);
  const weekTitle = getWeekLabel(weekOffset);

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
      {/* Barre supérieure avec dates et navigation de semaine */}
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#e8eaed] px-7 bg-white z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8] hover:text-[#20242b]"
            aria-label="Semaine précédente"
            title="Semaine précédente"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={onNextWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8] hover:text-[#20242b]"
            aria-label="Semaine suivante"
            title="Semaine suivante"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
        <h1 className="text-[17px] font-bold tracking-[-0.01em] text-[#282d34]">
          {weekTitle}
        </h1>
        <div className="w-[72px]" aria-hidden="true" />
      </div>

      {/* En-tête des colonnes des jours (fixe) */}
      <div className="grid h-[50px] shrink-0 grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-[#e6e8eb] bg-[#fbfbfc] z-10 shadow-xs">
        <div className="border-r border-[#e6e8eb]" />
        {weekDays.map((day) => {
          const isSelected = selectedDayIndex === day.dayIndex;
          return (
            <button
              key={day.name}
              type="button"
              onClick={() => onSelectDay(day.dayIndex)}
              className={`flex items-center justify-center gap-2 border-r border-[#e6e8eb] last:border-r-0 transition ${
                isSelected ? "bg-[#fff2f4] text-[#dd4052]" : "hover:bg-[#f2f4f6]"
              }`}
              title={`Sélectionner ${day.name} pour la carte`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${
                isSelected ? "text-[#dd4052]" : "text-[#777f89]"
              }`}>
                {day.name}
              </span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${
                isSelected ? "bg-[#ff4e64] text-white" : "text-[#2d3239]"
              }`}>
                {day.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Zone du calendrier à défilement vertical complet */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div
          className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]"
          style={{ gridAutoRows: "62px" }}
        >
          {hours.flatMap((hour) => [
            <div
              key={`${hour}-label`}
              className="relative flex items-start justify-end border-r border-b border-[#eceef0] bg-[#fbfbfc] pr-3 pt-2"
            >
              <span className="text-[11px] font-medium text-[#8c939d]">
                {hour}
              </span>
            </div>,
            ...weekDays.map((day) => {
              // Filtrer selon le jour de la semaine et la semaine affichée
              const found = events.find((item) => item.day === day.dayIndex && item.hour === hour);
              const event = found && tagFilterActive(found) ? found : undefined;
              return (
                <div
                  key={`${day.name}-${hour}`}
                  className={`min-h-0 border-r border-b border-[#eceef0] p-[3px] last:border-r-0 transition-colors hover:bg-[#fafbfc] ${
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
      </div>
    </main>
  );
}
