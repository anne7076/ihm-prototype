import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Event } from "../../types";
import { ChevronIcon } from "../common/Icons";
import { getWeekDays } from "../../utils/formatters";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createCustomPinIcon(color: string, isMultiple: boolean = false) {
  const svg = isMultiple
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
        <path d="M18 43S2.5 27.2 2.5 17.5a15.5 15.5 0 1 1 31 0C33.5 27.2 18 43 18 43Z" fill="#ffffff" stroke="#2b313a" stroke-width="2"/>
        <circle cx="18" cy="18" r="9" fill="#ef5a5a" />
        <path d="M18 9 A9 9 0 0 1 27 18 L18 18 Z" fill="#4e8ff7" />
        <path d="M18 18 L27 18 A9 9 0 0 1 18 27 Z" fill="#55ae78" />
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
        <path d="M18 43S2.5 27.2 2.5 17.5a15.5 15.5 0 1 1 31 0C33.5 27.2 18 43 18 43Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="18" cy="18" r="5" fill="#ffffff"/>
      </svg>`;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); transform: translate(-50%, -100%); cursor: pointer;">${svg}</div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
  });
}

function MapViewController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

interface MapViewProps {
  events: Event[];
  weekOffset: number;
  selectedDayIndex: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSelectEvent: (event: Event) => void;
  onCalendar: () => void;
  selectedEvent?: Event;
}

export function MapView({
  events,
  weekOffset,
  selectedDayIndex,
  onPrevDay,
  onNextDay,
  onSelectEvent,
  onCalendar,
  selectedEvent,
}: MapViewProps) {
  const weekDays = getWeekDays(weekOffset);
  const currentDay = weekDays[selectedDayIndex] || weekDays[4]; // Vendredi par défaut

  // Filtrer les événements pour n'afficher sur la carte que ceux du jour sélectionné
  const dayEvents = events.filter((e) => e.dateStr === currentDay.dateStr);

  // Centre par défaut sur Rennes ou sur l'événement sélectionné
  const defaultCenter: [number, number] =
    selectedEvent && selectedEvent.dateStr === currentDay.dateStr
      ? [selectedEvent.lat, selectedEvent.lng]
      : dayEvents[0]
      ? [dayEvents[0].lat, dayEvents[0].lng]
      : [48.1113, -1.6800];

  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-[#e6ebe7]">
      {/* Sélecteur de jour dynamique et interactif */}
      <div className="absolute left-1/2 top-5 z-[500] flex -translate-x-1/2 items-center rounded-xl border border-[#e0e3e1] bg-white p-1.5 shadow-[0_8px_28px_rgba(38,48,42,0.15)]">
        <button
          type="button"
          onClick={onPrevDay}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#656d67] transition hover:bg-[#f2f4f2] hover:text-[#20242b]"
          aria-label="Jour précédent"
          title="Jour précédent"
        >
          <ChevronIcon direction="left" />
        </button>
        <div className="min-w-[210px] px-4 text-center">
          <p className="text-[14px] font-bold text-[#2f3531]">
            {currentDay.fullDateString}
          </p>
          <span className="text-[11px] font-medium text-[#777e87]">
            {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""} prévu{dayEvents.length > 1 ? "s" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={onNextDay}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#656d67] transition hover:bg-[#f2f4f2] hover:text-[#20242b]"
          aria-label="Jour suivant"
          title="Jour suivant"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* Bouton retour calendrier rapide */}
      <button
        type="button"
        onClick={onCalendar}
        className="absolute right-5 top-5 z-[500] rounded-xl border border-[#e3e6ea] bg-white px-4 py-2.5 text-[12px] font-bold text-[#343b44] shadow-md transition hover:bg-[#f8f9fa]"
      >
        Voir en calendrier
      </button>

      {/* Carte Leaflet OpenStreetMap France */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          maxZoom={20}
        />

        <MapViewController center={defaultCenter} />

        {/* Marqueurs synchronisés avec le jour sélectionné */}
        {dayEvents.map((evt) => {
          const icon = createCustomPinIcon(evt.textColor, evt.multiple);
          return (
            <Marker key={evt.id} position={[evt.lat, evt.lng]} icon={icon}>
              <Popup className="custom-popup" closeButton={false}>
                <div className="w-[260px] overflow-hidden rounded-xl bg-white p-1">
                  <div className="relative h-[110px] w-full overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full object-cover"
                      src={evt.imageUrl}
                      alt={evt.title}
                    />
                    <span
                      className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm"
                      style={{ backgroundColor: evt.textColor }}
                    >
                      #{evt.tag}
                    </span>
                  </div>

                  <div className="p-3">
                    <span className="text-[11px] font-semibold text-[#777e87]">
                      {evt.timeRange}
                    </span>
                    <h3 className="mt-0.5 text-[15px] font-bold leading-tight text-[#24292f]">
                      {evt.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#6d747f]">
                      {evt.venueName}
                    </p>

                    <button
                      type="button"
                      onClick={() => onSelectEvent(evt)}
                      className="mt-3.5 h-8.5 w-full rounded-lg bg-[#ff4e64] text-[12px] font-bold text-white transition hover:bg-[#ed3f55]"
                    >
                      Voir les détails
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </main>
  );
}
