import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Event } from "../../types";
import { getWeekDays, getWeekLabel } from "../../utils/formatters";
import { ChevronIcon } from "../common/Icons";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface VenueCluster {
  key: string;
  venueName: string;
  venueAddress: string;
  lat: number;
  lng: number;
  events: Event[];
}

function createSinglePinIcon(color: string, isSelected: boolean = false) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
    <path d="M18 43S2.5 27.2 2.5 17.5a15.5 15.5 0 1 1 31 0C33.5 27.2 18 43 18 43Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="18" cy="18" r="5.5" fill="#ffffff"/>
  </svg>`;

  const ringStyle = isSelected
    ? "outline: 3px solid #ff4e64; outline-offset: 3px; border-radius: 50%;"
    : "";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="filter: drop-shadow(0 5px 8px rgba(0,0,0,0.35)); transform: translate(-50%, -100%); cursor: pointer; ${ringStyle}">${svg}</div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
  });
}

function createClusterPinIcon(events: Event[], isSelected: boolean = false) {
  const count = events.length;
  const uniqueColors = Array.from(
    new Set(events.map((e) => e.textColor)),
  ).slice(0, 4);

  const dotsHtml = uniqueColors
    .map(
      (c) =>
        `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background-color:${c}; border:1px solid white;"></span>`,
    )
    .join("");

  const ringStyle = isSelected
    ? "outline: 3px solid #ff4e64; outline-offset: 2px; border-radius: 9999px;"
    : "";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="transform: translate(-50%, -100%); cursor: pointer; filter: drop-shadow(0 6px 14px rgba(28,33,40,0.38)); ${ringStyle}">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; align-items: center; gap: 5px; background: #20252e; border: 2.5px solid white; border-radius: 9999px; padding: 4px 10px 4px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
            <div style="display:flex; align-items:center; gap:2.5px;">${dotsHtml}</div>
            <span style="color: white; font-weight: 800; font-size: 13px; line-height: 1; letter-spacing: -0.02em;">${count}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #20252e; margin-top: -1px;"></div>
        </div>
      </div>
    `,
    iconSize: [54, 42],
    iconAnchor: [27, 42],
    popupAnchor: [0, -40],
  });
}

function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface MapViewProps {
  events: Event[];
  weekOffset: number;
  selectedDayIndex: number | null; // null = Toute la semaine, 0..6 = Jour spécifique
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectDay: (dayIndex: number | null) => void;
  onSelectEvent: (event: Event) => void;
  onCalendar: () => void;
  selectedEvent?: Event;
}

export function MapView({
  events,
  weekOffset,
  selectedDayIndex,
  onPrevWeek,
  onNextWeek,
  onSelectDay,
  onSelectEvent,
  onCalendar,
  selectedEvent,
}: MapViewProps) {
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const weekLabel = useMemo(() => getWeekLabel(weekOffset), [weekOffset]);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  // Événements de la semaine entière
  const weekDates = useMemo(
    () => new Set(weekDays.map((d) => d.dateStr)),
    [weekDays],
  );
  const weekEvents = useMemo(
    () => events.filter((e) => weekDates.has(e.dateStr)),
    [events, weekDates],
  );

  // Événements filtrés selon le scope sélectionné (Toute la semaine vs un jour précis)
  const visibleEvents = useMemo(() => {
    if (selectedDayIndex === null) {
      return weekEvents;
    }
    const targetDay = weekDays[selectedDayIndex];
    if (!targetDay) return weekEvents;
    return weekEvents.filter((e) => e.dateStr === targetDay.dateStr);
  }, [weekEvents, selectedDayIndex, weekDays]);

  // Regroupement dynamique par lieu (venue clustering) pour éliminer les chevauchements
  const clusters = useMemo(() => {
    const map = new Map<string, VenueCluster>();
    for (const evt of visibleEvents) {
      const key = `${evt.lat.toFixed(4)},${evt.lng.toFixed(4)}`;
      const existing = map.get(key);
      if (existing) {
        existing.events.push(evt);
      } else {
        map.set(key, {
          key,
          venueName: evt.venueName,
          venueAddress: evt.venueAddress,
          lat: evt.lat,
          lng: evt.lng,
          events: [evt],
        });
      }
    }
    return Array.from(map.values());
  }, [visibleEvents]);

  // Centre et zoom de la carte
  const activeCluster = useMemo(() => {
    if (!selectedEvent) return null;
    return (
      clusters.find((c) => c.events.some((e) => e.id === selectedEvent.id)) ||
      null
    );
  }, [clusters, selectedEvent]);

  const center: [number, number] = useMemo(() => {
    if (activeCluster) {
      return [activeCluster.lat, activeCluster.lng];
    }
    if (clusters.length > 0) {
      return [clusters[0].lat, clusters[0].lng];
    }
    return [48.1113, -1.68]; // Centre de Rennes
  }, [activeCluster, clusters]);

  const zoom = activeCluster ? 15 : 13.5;

  // Ouvrir automatiquement le popup si un événement précis est sélectionné
  useEffect(() => {
    if (activeCluster) {
      const marker = markerRefs.current.get(activeCluster.key);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [activeCluster]);

  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-[#f4f5f3]">
      {/* Barre de contrôle supérieure : Navigation de semaine & Sélecteur "Toute la semaine" / Jour */}
      <div className="absolute left-1/2 top-4 z-[500] flex -translate-x-1/2 flex-col items-center gap-2">
        {/* Titre et flèches de la semaine */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#dfe2e6] bg-white/95 px-4 py-2 shadow-[0_10px_28px_rgba(25,30,36,0.12)] backdrop-blur-md">
          <button
            type="button"
            onClick={onPrevWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e6ea] text-[#555d67] transition hover:bg-[#f3f4f6] hover:text-[#20242b]"
            aria-label="Semaine précédente"
            title="Semaine précédente"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="min-w-[260px] text-center">
            <p className="text-[14px] font-bold tracking-[-0.01em] text-[#242930]">
              {weekLabel}
            </p>
            <span className="text-[11px] font-semibold text-[#7c838f]">
              {visibleEvents.length} concert
              {visibleEvents.length > 1 ? "s" : ""} affiché
              {visibleEvents.length > 1 ? "s" : ""} à Rennes
            </span>
          </div>

          <button
            type="button"
            onClick={onNextWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e6ea] text-[#555d67] transition hover:bg-[#f3f4f6] hover:text-[#20242b]"
            aria-label="Semaine suivante"
            title="Semaine suivante"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        {/* Pilules de filtrage temporel : Toute la semaine vs jours individuels */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#e2e5e9] bg-white/95 p-1.5 shadow-[0_6px_20px_rgba(25,30,36,0.10)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => onSelectDay(null)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
              selectedDayIndex === null
                ? "bg-[#ff4e64] text-white shadow-xs"
                : "text-[#58606c] hover:bg-[#f1f3f5] hover:text-[#20242b]"
            }`}
          >
            Toute la semaine ({weekEvents.length})
          </button>

          <div className="h-4 w-px bg-[#e3e6ea]" />

          {weekDays.map((d) => {
            const count = weekEvents.filter(
              (e) => e.dateStr === d.dateStr,
            ).length;
            const isSelected = selectedDayIndex === d.dayIndex;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => onSelectDay(d.dayIndex)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  isSelected
                    ? "bg-[#282d35] text-white shadow-xs"
                    : "text-[#58606c] hover:bg-[#f1f3f5] hover:text-[#20242b]"
                }`}
                title={`${d.fullDateString} (${count} événement${count > 1 ? "s" : ""})`}
              >
                <span>
                  {d.name.slice(0, 3)} {d.date}
                </span>
                {count > 0 && (
                  <span
                    className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      isSelected
                        ? "bg-white text-[#282d35]"
                        : "bg-[#ff4e64]/12 text-[#e23f54]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carte Leaflet avec tuiles ESRI World Street Map (palette douce et lisible style Google Maps) */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        <MapViewController center={center} zoom={zoom} />

        {/* Marqueurs regroupés par lieu sans chevauchement */}
        {clusters.map((cluster) => {
          const isSelected = activeCluster?.key === cluster.key;
          const icon =
            cluster.events.length === 1
              ? createSinglePinIcon(cluster.events[0].textColor, isSelected)
              : createClusterPinIcon(cluster.events, isSelected);

          return (
            <Marker
              key={cluster.key}
              position={[cluster.lat, cluster.lng]}
              icon={icon}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(cluster.key, ref);
                } else {
                  markerRefs.current.delete(cluster.key);
                }
              }}
            >
              <Popup className="custom-popup" closeButton={true}>
                {cluster.events.length === 1 ? (
                  // Vue popup pour 1 seul événement
                  <div className="w-[270px] overflow-hidden rounded-xl bg-white p-1">
                    <div className="relative h-[115px] w-full overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover"
                        src={cluster.events[0].imageUrl}
                        alt={cluster.events[0].title}
                      />
                      <span
                        className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm"
                        style={{ backgroundColor: cluster.events[0].textColor }}
                      >
                        #{cluster.events[0].tag}
                      </span>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#777e87]">
                        <span>{cluster.events[0].timeRange}</span>
                        <span>{cluster.events[0].dateStr.slice(5)}</span>
                      </div>
                      <h3 className="mt-1 text-[15px] font-bold leading-tight text-[#24292f]">
                        {cluster.events[0].title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#6d747f]">
                        {cluster.venueName}
                      </p>

                      <button
                        type="button"
                        onClick={() => onSelectEvent(cluster.events[0])}
                        className="mt-3.5 h-9 w-full rounded-lg bg-[#ff4e64] text-[12px] font-bold text-white transition hover:bg-[#ed3f55]"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vue popup pour un lieu avec plusieurs événements (sans chevauchement)
                  <div className="w-[300px] overflow-hidden rounded-xl bg-white p-3">
                    <div className="border-b border-[#eceef1] pb-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-bold text-[#20252c]">
                          {cluster.venueName}
                        </h3>
                        <span className="rounded-full bg-[#20252e] px-2 py-0.5 text-[10px] font-extrabold text-white">
                          {cluster.events.length} concerts
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#717882]">
                        {cluster.venueAddress}
                      </p>
                    </div>

                    <div className="mt-2.5 max-h-[220px] space-y-2 overflow-y-auto pr-1">
                      {cluster.events.map((evt) => (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between rounded-lg border border-[#f0f1f3] bg-[#fbfbfc] p-2 transition hover:bg-[#f6f7f9]"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: evt.textColor }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#818894]">
                                #{evt.tag}
                              </span>
                              <span className="text-[10px] text-[#9ba1aa]">
                                · {evt.dateStr.slice(5)}
                              </span>
                            </div>
                            <h4 className="mt-0.5 truncate text-[12px] font-bold text-[#30353c]">
                              {evt.title}
                            </h4>
                            <p className="text-[11px] text-[#737a85]">
                              {evt.timeRange}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSelectEvent(evt)}
                            className="shrink-0 rounded-md bg-[#ff4e64] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#e63f54]"
                          >
                            Détails
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </main>
  );
}
