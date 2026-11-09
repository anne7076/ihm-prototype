import { useState, useEffect, useMemo } from "react"
import type { Event, Creator, Tag } from "./types"
import {
  getAllTags,
  getAllCreators,
  getAllEvents,
  toggleFollowCreator,
  toggleFavoriteEvent,
  addEvent,
  addTag,
} from "./db"
import { matchesFuzzy } from "./utils/fuzzy"
import {
  getWeekDays,
  getWeekOffsetForDate,
  getDayIndexForDate,
} from "./utils/formatters"
import { Header } from "./components/common/Header"
import { Sidebar } from "./components/common/Sidebar"
import { CalendarView } from "./components/calendar/CalendarView"
import { MapView } from "./components/map/MapView"
import { HomePage } from "./components/home/HomePage"
import { CreatorsPage } from "./components/creators/CreatorsPage"
import { DayEventsModal } from "./components/modals/DayEventsModal"
import { EventDetailModal } from "./components/modals/EventDetailModal"
import { EventFormModal } from "./components/modals/EventFormModal"
import { CreatorDetailModal } from "./components/modals/CreatorDetailModal"

type ActivePage = "home" | "creators" | "app"
type ActiveView = "calendar" | "map"

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("page")
      if (p === "creators" || p === "app") return p
      const v = new URLSearchParams(window.location.search).get("view")
      if (v === "calendar" || v === "map") return "app"
    }
    return "home" // Page d'accueil par défaut
  })

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get("view")
      if (v === "map" || v === "calendar") return v
    }
    return "calendar"
  })

  const [activeTags, setActiveTags] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-velvet")
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null,
  )
  const [creatorsSearchPrefill, setCreatorsSearchPrefill] = useState("")

  // État temporel partagé entre Calendrier et Carte
  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4) // Vendredi par défaut
  const [mapDayIndex, setMapDayIndex] = useState<number | null>(null) // null = Toute la semaine par défaut sur la carte

  // Modales
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("modal") === "create"
      )
    }
    return false
  })

  const [tags, setTags] = useState<Tag[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Synchronisation avec l'historique du navigateur
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const p = params.get("page") as ActivePage | null
      const v = params.get("view") as ActiveView | null
      if (p === "home" || p === "creators" || p === "app") {
        setActivePage(p)
      } else if (v === "map" || v === "calendar") {
        setActivePage("app")
      } else {
        setActivePage("home")
      }
      if (v === "map" || v === "calendar") {
        setActiveView(v)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleNavigatePage = (page: ActivePage, view?: ActiveView) => {
    setActivePage(page)
    if (view) {
      setActiveView(view)
      if (view === "map") {
        setMapDayIndex(null)
      }
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      params.set("page", page)
      if (page === "app") {
        params.set("view", view || activeView)
      } else {
        params.delete("view")
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.pushState({}, "", newUrl)
    }
  }

  // Chargement initial depuis la base SQLite
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTags, loadedCreators, loadedEvents] = await Promise.all([
          getAllTags(),
          getAllCreators(),
          getAllEvents(),
        ])
        setTags(loadedTags)
        setCreators(loadedCreators)
        setEvents(loadedEvents)
      } catch (err) {
        console.error("Échec du chargement des données SQLite:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const creatorById = useMemo(
    () => Object.fromEntries(creators.map((c) => [c.id, c])),
    [creators],
  )

  const toggleTag = (id: string) =>
    setActiveTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )

  const matchesQuery = (e: Event) => {
    if (!query.trim() || e.multiple) return true
    const creatorName = e.creatorId
      ? (creatorById[e.creatorId]?.name ?? "")
      : ""
    const allTags = [e.tag, ...(e.secondaryTags || [])]
    const tagsSearchString = allTags.map((t) => `#${t} ${t}`).join(" ")
    return matchesFuzzy(
      query,
      e.title,
      tagsSearchString,
      e.venueName,
      e.venueAddress,
      creatorName,
      e.description,
    )
  }

  const tagFilterActive = (event: Event): boolean => {
    if (event.multiple) return true
    if (activeTags.length === 0) return true
    const allTags = [event.tag, ...(event.secondaryTags || [])]
    return allTags.some((t) => activeTags.includes(t))
  }

  // Filtrage combiné des événements avec recherche floue en direct
  const filteredEvents = useMemo(
    () => events.filter((e) => tagFilterActive(e) && matchesQuery(e)),
    [events, activeTags, query, creatorById],
  )

  // Jours de la semaine courante
  const currentWeekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset])
  const currentDay = currentWeekDays[selectedDayIndex] || currentWeekDays[4]

  // Actions de navigation temporelle synchronisée
  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1)
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1)

  const handleToggleFollow = async (id: string) => {
    await toggleFollowCreator(id)
    const updatedCreators = await getAllCreators()
    setCreators(updatedCreators)
  }

  const handleToggleFavorite = async (id: string) => {
    await toggleFavoriteEvent(id)
    const updatedEvents = await getAllEvents()
    setEvents(updatedEvents)
  }

  const handleAddTag = async (tagData: {
    id: string
    name: string
    color: string
  }): Promise<Tag> => {
    const newTag = await addTag(tagData)
    const updatedTags = await getAllTags()
    setTags(updatedTags)
    return newTag
  }

  const handleCreateEvent = async (
    eventData: Omit<Event, "id" | "isFavorite">,
  ) => {
    const newEvt = await addEvent(eventData)
    const updatedEvents = await getAllEvents()
    setEvents(updatedEvents)
    const offset = getWeekOffsetForDate(newEvt.dateStr)
    const dayIdx = getDayIndexForDate(newEvt.dateStr)
    setWeekOffset(offset)
    setSelectedDayIndex(dayIdx)
    setSelectedEventId(newEvt.id)
  }

  const handleSelectEvent = (evt: Event) => {
    setSelectedEventId(evt.id)
    const offset = getWeekOffsetForDate(evt.dateStr)
    const dayIdx = getDayIndexForDate(evt.dateStr)
    setWeekOffset(offset)
    setSelectedDayIndex(dayIdx)
    if (evt.multiple) {
      setIsDayModalOpen(true)
    } else {
      setIsDetailModalOpen(true)
    }
  }

  const handleSelectCreator = (creator: Creator) => {
    setSelectedCreatorId(creator.id)
    setIsCreatorModalOpen(true)
  }

  const currentEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || events[0],
    [events, selectedEventId],
  )

  const currentCreator = currentEvent?.creatorId
    ? creatorById[currentEvent.creatorId]
    : undefined

  const currentSelectedCreator = useMemo(
    () => creators.find((c) => c.id === selectedCreatorId) || creators[0],
    [creators, selectedCreatorId],
  )

  const creatorUpcomingEvents = useMemo(() => {
    if (!currentSelectedCreator) return []
    return events.filter(
      (e) => e.creatorId === currentSelectedCreator.id && !e.multiple,
    )
  }, [events, currentSelectedCreator])

  const creatorPastEvents = useMemo(() => {
    if (!currentSelectedCreator) return []
    return events.filter((e) => e.creatorId === currentSelectedCreator.id)
  }, [events, currentSelectedCreator])

  // Événements pour la modale multi-événements d'un jour précis
  const selectedDayEvents = useMemo(
    () => filteredEvents.filter((e) => e.dateStr === currentDay?.dateStr),
    [filteredEvents, currentDay],
  )

  const favoritesCount = useMemo(
    () => events.filter((e) => e.isFavorite).length,
    [events],
  )
  const followedCount = useMemo(
    () => creators.filter((c) => c.isFollowed).length,
    [creators],
  )

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
    )
  }

  return (
    <div className="h-screen min-h-[720px] overflow-hidden bg-[#f7f8fa] text-[#20242b] flex flex-col">
      {/* En-tête principal unifié */}
      <Header
        currentPage={activePage}
        activeView={activeView}
        onNavigatePage={handleNavigatePage}
        query={query}
        onQueryChange={setQuery}
        tags={tags}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        favoritesCount={favoritesCount}
        followedCount={followedCount}
      />

      {/* Corps dynamique selon la page active */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {activePage === "home" && (
          <HomePage
            events={events}
            creators={creators}
            tags={tags}
            onNavigateToCreators={(search) => {
              if (search) setCreatorsSearchPrefill(search)
              handleNavigatePage("creators")
            }}
            onNavigateToAgenda={() => handleNavigatePage("app", "calendar")}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onSelectEvent={handleSelectEvent}
            onSelectCreator={handleSelectCreator}
            onToggleFollow={handleToggleFollow}
          />
        )}

        {activePage === "creators" && (
          <CreatorsPage
            creators={creators}
            events={events}
            initialSearch={creatorsSearchPrefill}
            onSelectCreator={handleSelectCreator}
            onToggleFollow={handleToggleFollow}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activePage === "app" && (
          <div className="flex h-full min-h-[596px]">
            {/* Barre latérale des créateurs */}
            <Sidebar
              creators={creators}
              onToggleFollow={handleToggleFollow}
              onNavigateToCreators={() => handleNavigatePage("creators")}
              onSelectCreator={handleSelectCreator}
            />

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
                  setSelectedDayIndex(dayIdx)
                  setMapDayIndex(dayIdx)
                  setActiveView("map")
                }}
                matchesQuery={matchesQuery}
                tagFilterActive={tagFilterActive}
                onSelectEvent={handleSelectEvent}
              />
            )}
          </div>
        )}
      </main>

      {/* Modale des événements multiples du jour sélectionné */}
      {isDayModalOpen && (
        <DayEventsModal
          dayTitle={currentDay?.fullDateString}
          events={
            selectedDayEvents.length
              ? selectedDayEvents
              : events.filter((e) => e.dateStr === currentDay?.dateStr)
          }
          creators={creators}
          onClose={() => setIsDayModalOpen(false)}
          onSelectEvent={(evt) => {
            setSelectedEventId(evt.id)
            setIsDayModalOpen(false)
            setIsDetailModalOpen(true)
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
            setIsDetailModalOpen(false)
            setIsDayModalOpen(true)
          }}
          onLocateOnMap={() => {
            setIsDetailModalOpen(false)
            const offset = getWeekOffsetForDate(currentEvent.dateStr)
            const dayIdx = getDayIndexForDate(currentEvent.dateStr)
            setWeekOffset(offset)
            setSelectedDayIndex(dayIdx)
            setMapDayIndex(dayIdx)
            handleNavigatePage("app", "map")
          }}
          onToggleFavorite={() => handleToggleFavorite(currentEvent.id)}
        />
      )}

      {/* Modale de proposition d'événement */}
      {isCreateModalOpen && (
        <EventFormModal
          tags={tags}
          onAddTag={handleAddTag}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* Modale de profil détaillé du créateur */}
      {isCreatorModalOpen && currentSelectedCreator && (
        <CreatorDetailModal
          creator={currentSelectedCreator}
          upcomingEvents={creatorUpcomingEvents}
          pastEvents={creatorPastEvents}
          onClose={() => setIsCreatorModalOpen(false)}
          onToggleFollow={handleToggleFollow}
          onSelectEvent={(evt) => {
            setIsCreatorModalOpen(false)
            handleSelectEvent(evt)
          }}
        />
      )}
    </div>
  )
}
