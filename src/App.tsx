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
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { CalendarView } from "./components/calendar/CalendarView";
import { MapView } from "./components/map/MapView";
import { EventCard } from "./components/events/EventCard";
import { DayEventsModal } from "./components/modals/DayEventsModal";
import { EventDetailModal } from "./components/modals/EventDetailModal";
import { EventFormModal } from "./components/modals/EventFormModal";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-velvet");

  const [tags, setTags] = useState<Tag[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load from SQLite database
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
        console.error("Failed to load SQLite data:", err);
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
    const haystack = `${e.title ?? ""} #${e.tag ?? ""} ${creatorName}`.toLowerCase();
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
    await addEvent(eventData);
    const updatedEvents = await getAllEvents();
    setEvents(updatedEvents);
  };

  const currentEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || events[0],
    [events, selectedEventId]
  );

  const currentCreator = currentEvent?.creatorId ? creatorById[currentEvent.creatorId] : undefined;

  const fridayEvents = useMemo(
    () => events.filter((e) => e.day === 4 || e.tag === "rock" || e.tag === "jazz"),
    [events]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff4e64] border-t-transparent" />
          <p className="text-[13px] font-semibold text-[#555d68]">
            Chargement de la base SQLite...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen min-h-[720px] overflow-hidden bg-[#f7f8fa] text-[#20242b]">
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
        activeScreen={activeScreen}
        onToggleView={() => setActiveScreen(activeScreen === 4 ? 1 : 4)}
        onOpenCreateModal={() => setActiveScreen(5)}
      />

      <div className="flex h-[calc(100vh-124px)] min-h-[596px]">
        <Sidebar creators={creators} onToggleFollow={handleToggleFollow} />

        {activeScreen === 4 ? (
          <MapView
            onCalendar={() => setActiveScreen(1)}
            onDetails={() => {
              setSelectedEventId("evt-velvet");
              setActiveScreen(3);
            }}
          />
        ) : (
          <CalendarView
            events={events}
            matchesQuery={matchesQuery}
            tagFilterActive={tagFilterActive}
            onSelectEvent={(evt) => {
              setSelectedEventId(evt.id);
              setActiveScreen(evt.multiple ? 2 : 3);
            }}
          />
        )}
      </div>

      {/* Screen 2: Modal for multiple events in a day */}
      {activeScreen === 2 && (
        <DayEventsModal
          events={fridayEvents}
          creators={creators}
          onClose={() => setActiveScreen(1)}
          onSelectEvent={(evt) => {
            setSelectedEventId(evt.id);
            setActiveScreen(3);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Screen 3: Modal for detailed event view */}
      {activeScreen === 3 && currentEvent && (
        <EventDetailModal
          event={currentEvent}
          creator={currentCreator}
          onClose={() => setActiveScreen(1)}
          onBackToDay={() => setActiveScreen(2)}
          onLocateOnMap={() => setActiveScreen(4)}
          onToggleFavorite={() => handleToggleFavorite(currentEvent.id)}
        />
      )}

      {/* Screen 5: Modal for participatory event submission */}
      {activeScreen === 5 && (
        <EventFormModal
          tags={tags}
          onClose={() => setActiveScreen(1)}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* Bottom Mockup / Screen Switcher */}
      <nav
        className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/20 bg-[#20242b]/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur"
        aria-label="Sélection de la maquette"
      >
        {([1, 2, 3, 4, 5] as const).map((screen) => (
          <button
            key={screen}
            type="button"
            className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
              activeScreen === screen ? "bg-white text-[#24282e]" : "text-white/70 hover:text-white"
            }`}
            onClick={() => setActiveScreen(screen)}
          >
            Écran {screen}
          </button>
        ))}
      </nav>
    </div>
  );
}
