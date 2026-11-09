import { useRef, useEffect } from "react";
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
  showOnlyFavorites?: boolean;
  onResetFavoritesFilter?: () => void;
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
  showOnlyFavorites = false,
  onResetFavoritesFilter,
}: CalendarViewProps) {
  const weekDays = getWeekDays(weekOffset);
  const weekTitle = getWeekLabel(weekOffset);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Positionner le focus par défaut à 17h00 (début des concerts et soirées)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const index17 = hours.indexOf("17h00");
      if (index17 !== -1) {
        // Chaque case horaire mesure 62px
        scrollContainerRef.current.scrollTop = index17 * 62;
      }
    }
  }, []);

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
      {/* Barre supérieure avec dates et navigation de semaine */}
      <div className="flex h-[54px] shrink-0 items-center justify-between px-6 bg-white z-10">
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
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-bold tracking-[-0.01em] text-[#24282e]">
            {weekTitle}
          </h1>
          {showOnlyFavorites && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#fff0f2] px-3 py-1 text-[11px] font-bold text-[#ff4e64]">
              <span>♥ Favoris uniquement</span>
              {onResetFavoritesFilter && (
                <button
                  type="button"
                  onClick={onResetFavoritesFilter}
                  className="ml-1 text-[12px] font-black hover:text-[#b82234]"
                  title="Afficher tous les événements"
                >
                  ✕
                </button>
              )}
            </span>
          )}
        </div>
        <div className="w-[72px]" aria-hidden="true" />
      </div>

      {/* En-tête des colonnes des jours (fixe) */}
      <div className="grid h-[48px] shrink-0 grid-cols-[80px_repeat(7,minmax(0,1fr))] border-t border-b border-[#e6e8eb] bg-[#fbfbfc] z-10">
        <div className="flex items-center justify-center border-r border-[#e6e8eb] text-[10px] font-bold uppercase tracking-wider text-[#9aa0a9]">
          Heure
        </div>
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
      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
        <div
          className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]"
          style={{ gridAutoRows: "62px" }}
        >
          {hours.flatMap((hour) => {
            const isEveningStart = hour === "17h00";
            return [
            <div
              key={`${hour}-label`}
              className={`relative flex items-start justify-end border-r border-b border-[#eceef0] pr-3 pt-2 ${
                isEveningStart ? "bg-[#fff5f6]" : "bg-[#fbfbfc]"
              }`}
            >
              <span className={`text-[11px] ${isEveningStart ? "font-bold text-[#dd4052]" : "font-medium text-[#8c939d]"}`}>
                {hour}
              </span>
            </div>,
            ...weekDays.map((day) => {
              // Filtrer selon la date exacte de la case
              const found = events.find((item) => item.dateStr === day.dateStr && item.hour === hour);
              const event = found && tagFilterActive(found) ? found : undefined;
              return (
                <div
                  key={`${day.name}-${hour}`}
                  className={`min-h-0 border-r border-b border-[#eceef0] p-[3px] last:border-r-0 transition-colors hover:bg-[#fafbfc] ${
                    isEveningStart ? "bg-[#fffefe]/50" : ""
                  } ${event ? "cursor-pointer" : ""}`}
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
          ];
          })}
        </div>
      </div>
    </main>
  );
}
