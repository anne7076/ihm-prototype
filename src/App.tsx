import { useState, useEffect, useMemo } from "react";
import type { Event, Creator, Tag } from "./types";
import {
  getAllTags,
  getAllCreators,
  getAllEvents,
  toggleFollowCreator,
  toggleFavoriteEvent,
  addEvent,
} from "./db";
import {
  getWeekDays,
  getWeekOffsetForDate,
  getDayIndexForDate,
} from "./utils/formatters";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { CalendarView } from "./components/calendar/CalendarView";
import { MapView } from "./components/map/MapView";
import { DayEventsModal } from "./components/modals/DayEventsModal";
import { EventDetailModal } from "./components/modals/EventDetailModal";
import { EventFormModal } from "./components/modals/EventFormModal";

type ActiveView = "calendar" | "map";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get("view");
      if (v === "map" || v === "calendar") return v;
    }
    return "calendar";
  });
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-velvet");

  // État temporel partagé entre Calendrier et Carte
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Vendredi par défaut
  const [mapDayIndex, setMapDayIndex] = useState<number | null>(null); // null = Toute la semaine par défaut sur la carte

  // Modales
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("modal") === "create";
    }
    return false;
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial depuis la base SQLite
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTags, loadedCreators, loadedEvents] = await Promise.all([
          getAllTags(),
          getAllCreators(),
          getAllEvents(),
        ]);
        setTags(loadedTags);
        setCreators(loadedCreators);
        setEvents(loadedEvents);
      } catch (err) {
        console.error("Échec du chargement des données SQLite:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const creatorById = useMemo(
    () => Object.fromEntries(creators.map((c) => [c.id, c])),
    [creators]
  );

  const toggleTag = (id: string) =>
    setActiveTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const terms = useMemo(
    () => query.toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );

  const matchesQuery = (e: Event) => {
    if (!terms.length || e.multiple) return true;
    const creatorName = e.creatorId ? creatorById[e.creatorId]?.name ?? "" : "";
    const haystack = `${e.title ?? ""} #${e.tag ?? ""} ${e.venueName ?? ""} ${creatorName}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  };

  const searchedTags = useMemo(
    () => tags.filter((t) => terms.includes(`#${t.id}`)),
    [tags, terms]
  );

  const tagFilterActive = (event: Event): boolean => {
    if (event.multiple) return true;
    const active = [...activeTags, ...searchedTags.map((t) => t.id)];
    if (active.length === 0) return true;
    return active.includes(event.tag ?? "");
  };

  // Filtrage combiné des événements
  const filteredEvents = useMemo(
    () => events.filter((e) => tagFilterActive(e) && matchesQuery(e)),
    [events, activeTags, searchedTags, terms]
  );

  // Jours de la semaine courante
  const currentWeekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const currentDay = currentWeekDays[selectedDayIndex] || currentWeekDays[4];

  // Actions de navigation temporelle synchronisée
  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 0) {
        setWeekOffset((w) => w - 1);
        return 6; // Dimanche de la semaine précédente
      }
      return prev - 1;
    });
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 6) {
        setWeekOffset((w) => w + 1);
        return 0; // Lundi de la semaine suivante
      }
      return prev + 1;
    });
  };

  const handleToggleFollow = async (id: string) => {
    await toggleFollowCreator(id);
    const updatedCreators = await getAllCreators();
    setCreators(updatedCreators);
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavoriteEvent(id);
    const updatedEvents = await getAllEvents();
    setEvents(updatedEvents);
  };

  const handleCreateEvent = async (eventData: Omit<Event, "id" | "isFavorite">) => {
    const newEvt = await addEvent(eventData);
    const updatedEvents = await getAllEvents();
    setEvents(updatedEvents);
    const offset = getWeekOffsetForDate(newEvt.dateStr);
    const dayIdx = getDayIndexForDate(newEvt.dateStr);
    setWeekOffset(offset);
    setSelectedDayIndex(dayIdx);
    setSelectedEventId(newEvt.id);
  };

  const handleSelectEvent = (evt: Event) => {
    setSelectedEventId(evt.id);
    const offset = getWeekOffsetForDate(evt.dateStr);
    const dayIdx = getDayIndexForDate(evt.dateStr);
    setWeekOffset(offset);
    setSelectedDayIndex(dayIdx);
    if (evt.multiple) {
      setIsDayModalOpen(true);
    } else {
      setIsDetailModalOpen(true);
    }
  };

  const currentEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || events[0],
    [events, selectedEventId]
  );

  const currentCreator = currentEvent?.creatorId ? creatorById[currentEvent.creatorId] : undefined;

  // Événements pour la modale multi-événements d'un jour précis
  const selectedDayEvents = useMemo(
    () => filteredEvents.filter((e) => e.dateStr === currentDay?.dateStr),
    [filteredEvents, currentDay]
  );

  const favoritesCount = useMemo(() => events.filter((e) => e.isFavorite).length, [events]);
  const followedCount = useMemo(() => creators.filter((c) => c.isFollowed).length, [creators]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#ff4e64] border-t-transparent" />
          <p className="text-[13px] font-semibold text-[#555d68]">
            Chargement de la base de données SQLite...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen min-h-[720px] overflow-hidden bg-[#f7f8fa] text-[#20242b]">
      {/* En-tête principal applicatif */}
      <Header
        query={query}
        onQueryChange={setQuery}
        tags={tags}
        activeTags={activeTags}
        searchedTags={searchedTags}
        onToggleTag={toggleTag}
        onClearFilters={() => {
          setActiveTags([]);
          setQuery("");
        }}
        activeScreen={activeView === "map" ? 4 : 1}
        onToggleView={() => {
          if (activeView === "calendar") {
            setMapDayIndex(null); // Afficher toute la semaine par défaut
            setActiveView("map");
          } else {
            setActiveView("calendar");
          }
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        favoritesCount={favoritesCount}
        followedCount={followedCount}
      />

      {/* Corps de l'application */}
      <div className="flex h-[calc(100vh-124px)] min-h-[596px]">
        {/* Barre latérale des créateurs */}
        <Sidebar creators={creators} onToggleFollow={handleToggleFollow} />

        {/* Vue principale : Carte synchronisée ou Calendrier hebdomadaire scrollable */}
        {activeView === "map" ? (
          <MapView
            events={filteredEvents}
            weekOffset={weekOffset}
            selectedDayIndex={mapDayIndex}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onSelectDay={setMapDayIndex}
            selectedEvent={currentEvent}
            onCalendar={() => setActiveView("calendar")}
            onSelectEvent={handleSelectEvent}
          />
        ) : (
          <CalendarView
            events={events}
            weekOffset={weekOffset}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={(dayIdx) => {
              setSelectedDayIndex(dayIdx);
              setMapDayIndex(dayIdx);
              setActiveView("map");
            }}
            matchesQuery={matchesQuery}
            tagFilterActive={tagFilterActive}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </div>

      {/* Modale des événements multiples du jour sélectionné */}
      {isDayModalOpen && (
        <DayEventsModal
          dayTitle={currentDay?.fullDateString}
          events={selectedDayEvents.length ? selectedDayEvents : events.filter((e) => e.dateStr === currentDay?.dateStr)}
          creators={creators}
          onClose={() => setIsDayModalOpen(false)}
          onSelectEvent={(evt) => {
            setSelectedEventId(evt.id);
            setIsDayModalOpen(false);
            setIsDetailModalOpen(true);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Modale de fiche détaillée d'un événement */}
      {isDetailModalOpen && currentEvent && (
        <EventDetailModal
          event={currentEvent}
          creator={currentCreator}
          onClose={() => setIsDetailModalOpen(false)}
          onBackToDay={() => {
            setIsDetailModalOpen(false);
            setIsDayModalOpen(true);
          }}
          onLocateOnMap={() => {
            setIsDetailModalOpen(false);
            const offset = getWeekOffsetForDate(currentEvent.dateStr);
            const dayIdx = getDayIndexForDate(currentEvent.dateStr);
            setWeekOffset(offset);
            setSelectedDayIndex(dayIdx);
            setMapDayIndex(dayIdx);
            setActiveView("map");
          }}
          onToggleFavorite={() => handleToggleFavorite(currentEvent.id)}
        />
      )}

      {/* Modale de proposition d'événement */}
      {isCreateModalOpen && (
        <EventFormModal
          tags={tags}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
}
