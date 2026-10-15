import { useState } from "react";

type IconProps = {
  className?: string;
};

function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.18 6-11a6 6 0 1 0-12 0c0 5.82 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "m12 5-5 5 5 5" : "m8 5 5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.8 5.9c-1.7-2.2-5.1-2.1-6.9-.2L12 7.6l-1.9-1.9c-1.8-1.9-5.2-2-6.9.2-1.6 2.1-1.3 5.1.6 7l8.2 8 8.2-8c1.9-1.9 2.2-4.9.6-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const subscriptions = [
  { name: "Rock", color: "#ef5a5a", checked: true },
  { name: "Electro", color: "#4e8ff7", checked: true },
  { name: "Jazz", color: "#f3c84b", checked: true },
  { name: "Pop", color: "#a86ae3", checked: true },
  { name: "Reggae", color: "#55ae78", checked: false },
];

const days = [
  { name: "Lundi", date: "12" },
  { name: "Mardi", date: "13" },
  { name: "Mercredi", date: "14" },
  { name: "Jeudi", date: "15" },
  { name: "Vendredi", date: "16" },
  { name: "Samedi", date: "17" },
  { name: "Dimanche", date: "18" },
];

const hours = ["10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00", "17h00", "18h00", "19h00", "20h00", "21h00", "22h00", "23h00", "00h00", "01h00", "02h00"];

type Event = {
  day: number;
  hour: string;
  title?: string;
  color?: string;
  textColor?: string;
  multiple?: boolean;
};

const events: Event[] = [
  { day: 0, hour: "19h00", title: "The Velvet Club", color: "#f9dedf", textColor: "#a82f39" },
  { day: 1, hour: "12h00", title: "Jazz à midi", color: "#fff1bd", textColor: "#8b6710" },
  { day: 1, hour: "21h00", title: "Neon Pulse", color: "#dce9ff", textColor: "#2866c3" },
  { day: 2, hour: "18h00", title: "Open Air", color: "#dff3e7", textColor: "#277249" },
  { day: 3, hour: "20h00", title: "Pop Session", color: "#eee1f8", textColor: "#7140a0" },
  { day: 4, hour: "20h00", multiple: true },
  { day: 5, hour: "16h00", title: "Rock Garden", color: "#f9dedf", textColor: "#a82f39" },
  { day: 5, hour: "22h00", title: "Electric Night", color: "#dce9ff", textColor: "#2866c3" },
  { day: 6, hour: "11h00", title: "Sunday Groove", color: "#dff3e7", textColor: "#277249" },
];

function CalendarEvent({ event }: { event: Event }) {
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

type EventCardProps = {
  title: string;
  tag: string;
  time: string;
  description: string;
  image: string;
  imageAlt: string;
  accent: string;
  focused?: boolean;
  onClick?: () => void;
};

function EventCard({ title, tag, time, description, image, imageAlt, accent, focused = false, onClick }: EventCardProps) {
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
            className="inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-[0.08em]"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            {tag}
          </span>
          <h3 className="mt-4 text-[25px] font-bold leading-tight tracking-[-0.025em] text-[#22262c]">{title}</h3>
          <div className="mt-4 flex items-center gap-2 text-[14px] font-semibold text-[#4a5059]">
            <svg className="h-[18px] w-[18px] text-[#8a9099]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {time}
          </div>
        </div>
        <p className="mt-6 max-w-[350px] text-[14px] leading-[1.65] text-[#6b717b]">{description}</p>
        <button className="mt-auto w-fit text-[13px] font-bold text-[#ff4e64]">Voir les détails</button>
      </div>

      <div className="relative min-w-0 overflow-hidden">
        <img className="h-full w-full object-cover" src={image} alt={imageAlt} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10" />
        <button
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#444a52] shadow-[0_5px_16px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:text-[#ff4e64]"
          aria-label={`Ajouter ${title} aux favoris`}
        >
          <HeartIcon />
        </button>
      </div>

      {focused && (
        <svg
          className="pointer-events-none absolute bottom-[70px] left-[39%] z-20 h-9 w-9 drop-shadow-[0_2px_1px_rgba(255,255,255,0.9)]"
          viewBox="0 0 36 40"
          aria-hidden="true"
        >
          <path d="M6 3.5v27l6.8-6.1 4.8 11.2 4.9-2.2-4.8-10.7 9.1-.6L6 3.5Z" fill="#1d2127" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M28 4.5 31 1.5M31 10h4M25.5 1l1-4" stroke="#1d2127" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </article>
  );
}

function MapPin({ color, className, multiple = false }: { color?: string; className: string; multiple?: boolean }) {
  return (
    <button className={`absolute z-10 -translate-x-1/2 -translate-y-full ${className}`} aria-label="Voir les événements à ce lieu">
      <span className="relative flex h-11 w-9 items-start justify-center drop-shadow-[0_5px_5px_rgba(30,40,45,0.25)]">
        <svg className="absolute inset-0 h-11 w-9" viewBox="0 0 36 44" aria-hidden="true">
          <path d="M18 43S2.5 27.2 2.5 17.5a15.5 15.5 0 1 1 31 0C33.5 27.2 18 43 18 43Z" fill={multiple ? "#ffffff" : color} stroke="white" strokeWidth="2" />
        </svg>
        {multiple ? (
          <span className="relative mt-[8px] flex h-5 w-5 overflow-hidden rounded-full ring-2 ring-white">
            <i className="h-full flex-1 bg-[#ef5a5a]" />
            <i className="h-full flex-1 bg-[#4e8ff7]" />
            <i className="h-full flex-1 bg-[#55ae78]" />
          </span>
        ) : (
          <span className="relative mt-[11px] h-3 w-3 rounded-full border-2 border-white bg-white/25" />
        )}
      </span>
    </button>
  );
}

function MapView({ onCalendar, onDetails }: { onCalendar: () => void; onDetails: () => void }) {
  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-[#e9eee9]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1218 826" preserveAspectRatio="none" aria-label="Carte stylisée du centre-ville de Rennes">
        <rect width="1218" height="826" fill="#e9eee9" />
        <g fill="#dde7dc" opacity=".9">
          <path d="M0 70 155 35l82 87-48 96L30 196Z" />
          <path d="m891 10 220 16 107 118-80 118-167-39-66-101Z" />
          <path d="m51 583 153-62 114 93-25 173L91 826 0 738Z" />
          <path d="m889 585 187-51 142 82v210H950l-80-126Z" />
        </g>
        <g fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-30 133 173 173l118 86 178 5 129-114 171-23 164 65 294-11" />
          <path d="M87 -20 161 117l-6 127 94 111 9 181-116 161-14 149" />
          <path d="m382-10 9 119-61 119 54 126-29 186 40 286" />
          <path d="M652-30 624 96l38 133-72 105 32 130-61 152 22 225" />
          <path d="m900-20-31 132 67 114-32 168 58 116-23 148 73 188" />
          <path d="M1091 10 1018 137l30 144-83 108-136 58-129 92-165 43-159 101-202 32" />
          <path d="M35 395 194 376l118 32 135-23 140 42 154-30 126 38 159-28 192 24" />
        </g>
        <g fill="none" stroke="#c9d0ca" strokeWidth="2" strokeLinecap="round" opacity=".9">
          <path d="M0 252 127 277l121-20 106 63 158-24 131 55 175-42 120 55 161-30 139 40" />
          <path d="M30 517 190 481l142 35 124-47 173 41 158-35 166 57 235-35" />
          <path d="m248 0 10 142-48 113 64 130-22 156 54 166-35 119" />
          <path d="m788 0-17 161 42 102-54 138 48 159-35 135 38 131" />
          <path d="m1089 0-8 126 49 117-54 164 31 180-45 239" />
        </g>
        <path d="M-30 588c146-63 265-64 387-33 132 33 213 62 358 12 179-62 313-36 533 21" fill="none" stroke="#96cfe0" strokeWidth="48" />
        <path d="M-30 588c146-63 265-64 387-33 132 33 213 62 358 12 179-62 313-36 533 21" fill="none" stroke="#b9e3ed" strokeWidth="35" />
        <g fill="#cfd7cf">
          <rect x="440" y="176" width="98" height="75" rx="10" />
          <rect x="715" y="182" width="120" height="87" rx="10" />
          <rect x="522" y="372" width="97" height="68" rx="10" />
          <rect x="822" y="460" width="118" height="62" rx="10" />
          <rect x="231" y="401" width="93" height="74" rx="10" />
        </g>
        <g fontFamily="Inter, sans-serif" fill="#667069">
          <text x="465" y="146" fontSize="14" fontWeight="700">PLACE SAINTE-ANNE</text>
          <text x="553" y="525" fontSize="14" fontWeight="700">RÉPUBLIQUE</text>
          <text x="846" y="391" fontSize="13" fontWeight="600">THABOR</text>
          <text x="258" y="349" fontSize="12" fontWeight="600">LES LICES</text>
          <text x="674" y="621" fontSize="12" fontStyle="italic" fill="#5b9fb4">La Vilaine</text>
          <text x="967" y="704" fontSize="12" fontWeight="600">GARE</text>
        </g>
      </svg>

      <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center rounded-xl border border-[#e0e3e1] bg-white p-1.5 shadow-[0_8px_28px_rgba(38,48,42,0.15)]">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#656d67] hover:bg-[#f2f4f2]" aria-label="Jour précédent">
          <ChevronIcon direction="left" />
        </button>
        <span className="min-w-[190px] px-4 text-center text-[14px] font-bold text-[#2f3531]">Vendredi 16 octobre</span>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#656d67] hover:bg-[#f2f4f2]" aria-label="Jour suivant">
          <ChevronIcon direction="right" />
        </button>
      </div>

      <button onClick={onCalendar} className="absolute right-5 top-6 z-20 hidden rounded-xl bg-white px-4 py-3 text-[12px] font-semibold shadow-md">
        Revenir au calendrier
      </button>

      <MapPin color="#a86ae3" className="left-[28%] top-[36%]" />
      <MapPin color="#f3c84b" className="left-[68%] top-[32%]" />
      <MapPin multiple className="left-[76%] top-[61%]" />
      <MapPin color="#4e8ff7" className="left-[37%] top-[73%]" />
      <MapPin color="#a86ae3" className="left-[87%] top-[76%]" />

      <div className="absolute left-[45%] top-[52%] z-30 w-[310px] -translate-x-1/2 -translate-y-full rounded-2xl bg-white p-3 shadow-[0_18px_45px_rgba(28,38,32,0.24)]">
        <div className="overflow-hidden rounded-xl">
          <img
            className="h-[112px] w-full object-cover"
            src="https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY29uY2VydCUyMGNyb3dkJTIwc3RhZ2UlMjByZWQlMjBsaWdodHN8ZW58MXx8fHwxNzkyMDU2MTI1fDA&ixlib=rb-4.1.0&q=85&w=700"
            alt="Concert du Festival Bars 'n Breizh"
          />
        </div>
        <div className="px-1 pb-1 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.08em] text-[#e14456]">#ROCK</span>
            <span className="text-[11px] font-semibold text-[#777e87]">20h30 - 23h30</span>
          </div>
          <h2 className="mt-1.5 text-[17px] font-bold tracking-[-0.02em] text-[#24292f]">Festival Bars 'n Breizh</h2>
          <p className="mt-1 text-[11px] text-[#818790]">L'Étage, Rennes</p>
          <button onClick={onDetails} className="mt-3 h-9 w-full rounded-lg bg-[#ff4e64] text-[12px] font-bold text-white transition hover:bg-[#ed3f55]">
            Voir les détails
          </button>
        </div>
        <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
      </div>
      <MapPin color="#ef5a5a" className="left-[45%] top-[57.5%]" />

      <div className="absolute bottom-6 right-6 z-20 flex flex-col overflow-hidden rounded-xl border border-[#dfe3df] bg-white shadow-lg">
        <button className="flex h-10 w-10 items-center justify-center border-b border-[#e6e8e6] text-xl font-medium text-[#58605a]">+</button>
        <button className="flex h-10 w-10 items-center justify-center text-xl font-medium text-[#58605a]">−</button>
      </div>
    </main>
  );
}

function EventFormModal({ onClose }: { onClose: () => void }) {
  const inputClass = "mt-2 h-11 w-full rounded-xl border border-[#dfe2e6] bg-white px-3.5 text-[13px] text-[#343940] outline-none transition placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5";
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" />
      <section className="fixed left-1/2 top-1/2 z-50 flex h-[750px] w-[1060px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.34)]" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6e7ea] px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#ff4e64]">Agenda participatif</p>
            <h2 id="form-title" className="mt-1 text-[22px] font-bold tracking-[-0.02em]">Proposer un nouvel événement</h2>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] hover:bg-[#f3f4f5]" aria-label="Fermer">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </header>

        <form className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-9 overflow-y-auto px-8 py-6">
            <div className="space-y-4">
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Titre de l'événement
                <input className={inputClass} placeholder="Ex : Concert Rock indé" />
              </label>
              <fieldset>
                <legend className="text-[12px] font-bold text-[#4c535c]">Genre principal</legend>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {subscriptions.map((genre) => (
                    <label key={genre.name} className="cursor-pointer">
                      <input className="peer sr-only" type="radio" name="genre" defaultChecked={genre.name === "Rock"} />
                      <span className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#e1e3e6] text-[10px] font-bold text-[#5e646d] transition peer-checked:border-[#ff9ba7] peer-checked:bg-[#fff4f5] peer-checked:text-[#d93e50]">
                        <i className="h-2 w-2 rounded-full" style={{ backgroundColor: genre.color }} />
                        {genre.name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Tags secondaires (#)
                <input className={inputClass} placeholder="#gratuit #festival #étudiant" />
              </label>
              <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-3">
                <label className="block text-[12px] font-bold text-[#4c535c]">Date<input className={inputClass} placeholder="16/10/2026" /></label>
                <label className="block text-[12px] font-bold text-[#4c535c]">Début<input className={inputClass} placeholder="20h30" /></label>
                <label className="block text-[12px] font-bold text-[#4c535c]">Fin<input className={inputClass} placeholder="23h30" /></label>
              </div>
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Lieu à Rennes <span className="font-normal text-[#949aa2]">(adresse pour la carte)</span>
                <span className="relative block">
                  <PinIcon className="absolute left-3.5 top-[21px] h-[17px] w-[17px] text-[#8b929b]" />
                  <input className={`${inputClass} pl-10`} placeholder="L'Ubu, 1 Rue Saint-Hélier, Rennes" />
                </span>
              </label>
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Lien du site web / Billetterie
                <input className={inputClass} placeholder="https://..." />
              </label>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[12px] font-bold text-[#4c535c]">Affiche ou photo</p>
                <button type="button" className="mt-2 flex h-[215px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6dade] bg-[#fafbfb] text-center transition hover:border-[#ff9ba7] hover:bg-[#fffafb]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f2] text-[#ff4e64]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5h3l1.3-2h7.4l1.3 2h3v11H4v-11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.7" /></svg>
                  </span>
                  <span className="mt-3 text-[13px] font-semibold text-[#4f5660]">Glisser l'affiche ou une photo ici</span>
                  <span className="mt-1 text-[11px] text-[#9298a0]">Format paysage recommandé · JPG ou PNG</span>
                  <span className="mt-3 rounded-lg border border-[#e0e3e6] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#616872]">Parcourir les fichiers</span>
                </button>
              </div>
              <label className="flex min-h-0 flex-1 flex-col text-[12px] font-bold text-[#4c535c]">
                Description de l'événement
                <textarea className="mt-2 min-h-[165px] flex-1 resize-none rounded-xl border border-[#dfe2e6] p-3.5 text-[13px] font-normal leading-relaxed outline-none placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5" placeholder="Programmation, tarifs, informations pratiques..." />
              </label>
            </div>
          </div>

          <footer className="flex h-[74px] shrink-0 items-center justify-end gap-3 border-t border-[#e6e7ea] bg-[#fafafa] px-8">
            <button type="button" onClick={onClose} className="h-11 rounded-xl border border-[#dfe2e6] bg-white px-5 text-[13px] font-semibold text-[#555c65] hover:bg-[#f5f6f7]">Annuler</button>
            <button type="submit" className="h-11 rounded-xl bg-[#ff4e64] px-6 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,78,100,0.24)] hover:bg-[#ed3f55]">Publier dans l'agenda</button>
          </footer>
        </form>
      </section>
    </>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<1 | 2 | 3 | 4 | 5>(4);

  return (
    <div className="h-screen min-h-[720px] overflow-hidden bg-[#f7f8fa] text-[#20242b]">
      <header className="grid h-[74px] grid-cols-[minmax(310px,1fr)_minmax(360px,560px)_minmax(420px,1fr)] items-center border-b border-[#e5e7eb] bg-white px-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#555d68] transition-colors hover:bg-[#f3f4f6]" aria-label="Ouvrir le menu">
            <MenuIcon />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ff4e64] shadow-[0_5px_12px_rgba(255,78,100,0.22)]">
            <span className="flex items-end gap-[2px]" aria-hidden="true">
              <i className="h-3 w-[3px] rounded-full bg-white/90" />
              <i className="h-5 w-[3px] rounded-full bg-white" />
              <i className="h-2.5 w-[3px] rounded-full bg-white/90" />
              <i className="h-4 w-[3px] rounded-full bg-white" />
            </span>
          </div>
          <span className="truncate text-[15px] font-bold tracking-[0.045em]">AGENDA MUSIQUE - RENNES</span>
        </div>

        <label className="mx-5 flex h-11 items-center gap-3 rounded-xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 text-[#8b929c] transition focus-within:border-[#ff8a98] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/5">
          <SearchIcon className="h-[19px] w-[19px] shrink-0" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#30353b] outline-none placeholder:text-[#9ba1aa]"
            placeholder="#rock #concert #electro #gratuit..."
            aria-label="Rechercher par hashtags"
          />
        </label>

        <div className="flex items-center justify-end gap-2.5">
          <button onClick={() => setActiveScreen(5)} className="h-11 whitespace-nowrap rounded-xl bg-[#ff4e64] px-4 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(255,78,100,0.23)] transition hover:bg-[#f23f56]">
            +&nbsp; Ajouter un événement
          </button>
          <button
            onClick={() => setActiveScreen(activeScreen === 4 ? 1 : 4)}
            className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold transition ${
              activeScreen === 4 ? "border-[#ffd2d8] bg-[#fff2f4] text-[#dd4052]" : "border-[#dde0e4] bg-white text-[#40464f] hover:bg-[#f8f9fa]"
            }`}
          >
            {activeScreen === 4 ? (
              <>
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                Calendrier
              </>
            ) : (
              <>
                <PinIcon className="h-[18px] w-[18px]" />
                Carte
              </>
            )}
          </button>
          <button className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e6dd] text-[#6f5141] ring-2 ring-white shadow-sm" aria-label="Ouvrir le profil">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8.5" r="3.2" fill="currentColor" opacity=".75" />
              <path d="M5.8 19c.7-3.4 3-5.2 6.2-5.2s5.5 1.8 6.2 5.2" fill="currentColor" opacity=".75" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-74px)] min-h-[646px]">
        <aside className="w-[222px] shrink-0 border-r border-[#e5e7eb] bg-white px-6 py-7">
          <h2 className="mb-6 text-[12px] font-bold uppercase tracking-[0.11em] text-[#7b828c]">Mes abonnements</h2>
          <ul className="space-y-1.5">
            {subscriptions.map((subscription) => (
              <li key={subscription.name}>
                <label className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2.5">
                  <input className="peer sr-only" type="checkbox" defaultChecked={subscription.checked} />
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: subscription.color }}
                  />
                  <span className="flex-1 text-[14px] font-medium text-[#414750]">{subscription.name}</span>
                  <span
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border border-[#cfd4da] bg-white text-white transition peer-checked:border-transparent"
                    style={subscription.checked ? { backgroundColor: subscription.color } : undefined}
                    aria-hidden="true"
                  >
                    {subscription.checked && (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="m2.2 6.1 2.3 2.2 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {activeScreen === 4 ? (
          <MapView onCalendar={() => setActiveScreen(1)} onDetails={() => setActiveScreen(3)} />
        ) : (
        <main className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#e8eaed] px-7">
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8]" aria-label="Semaine précédente">
                <ChevronIcon direction="left" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3e6ea] text-[#616873] transition hover:bg-[#f6f7f8]" aria-label="Semaine suivante">
                <ChevronIcon direction="right" />
              </button>
            </div>
            <h1 className="text-[17px] font-bold tracking-[-0.01em] text-[#282d34]">Semaine du 12 au 18 octobre</h1>
            <div className="w-[72px]" aria-hidden="true" />
          </div>

          <div className="grid h-[50px] shrink-0 grid-cols-[76px_repeat(7,minmax(0,1fr))] border-b border-[#e6e8eb] bg-[#fbfbfc]">
            <div className="border-r border-[#e6e8eb]" />
            {days.map((day) => (
              <div key={day.name} className="flex items-center justify-center gap-2 border-r border-[#e6e8eb] last:border-r-0">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#777f89]">{day.name}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-[#2d3239]">{day.date}</span>
              </div>
            ))}
          </div>

          <div
            className="grid min-h-0 flex-1 grid-cols-[76px_repeat(7,minmax(0,1fr))]"
            style={{ gridTemplateRows: `repeat(${hours.length}, minmax(0, 1fr))` }}
          >
            {hours.flatMap((hour) => [
              <div key={`${hour}-label`} className="relative border-r border-b border-[#eceef0] bg-[#fbfbfc] pr-3 text-right">
                <span className="relative -top-[7px] bg-[#fbfbfc] pl-1 text-[10px] font-medium text-[#a0a6ae]">{hour}</span>
              </div>,
              ...days.map((day, dayIndex) => {
                const event = events.find((item) => item.day === dayIndex && item.hour === hour);
                return (
                  <div
                    key={`${day.name}-${hour}`}
                    className={`min-h-0 border-r border-b border-[#eceef0] p-[3px] last:border-r-0 ${event ? "cursor-pointer" : ""}`}
                    onClick={() => event && setActiveScreen(event.multiple ? 2 : 3)}
                  >
                    {event && <CalendarEvent event={event} />}
                  </div>
                );
              }),
            ])}
          </div>
        </main>
        )}
      </div>

      {activeScreen === 2 && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" />
          <section
            className="fixed left-1/2 top-1/2 z-50 flex h-[720px] w-[980px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-[#f8f8f9] shadow-[0_30px_90px_rgba(0,0,0,0.32)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-modal-title"
          >
            <header className="flex h-[82px] shrink-0 items-center justify-between border-b border-[#e5e6e9] bg-white px-8">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff4e64]">Événements de la journée</p>
                <h2 id="day-modal-title" className="text-[22px] font-bold tracking-[-0.02em] text-[#24282e]">
                  Vendredi 16 octobre
                </h2>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] bg-white text-[#59606a] transition hover:bg-[#f3f4f5]"
                aria-label="Fermer"
                onClick={() => setActiveScreen(1)}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="event-list min-h-0 flex-1 overflow-y-scroll px-8 py-7">
              <div className="flex flex-col gap-5 pr-3">
                <EventCard
                  focused
                  onClick={() => setActiveScreen(3)}
                  title="Festival Bars 'n Breizh"
                  tag="#ROCK"
                  time="20h30 - 23h30"
                  description="Une soirée électrique au cœur de Rennes avec trois groupes bretons. Guitares, énergie live et découvertes locales au programme."
                  accent="#e64857"
                  image="https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY29uY2VydCUyMGNyb3dkJTIwc3RhZ2UlMjByZWQlMjBsaWdodHN8ZW58MXx8fHwxNzkyMDU2MTI1fDA&ixlib=rb-4.1.0&q=85&w=900"
                  imageAlt="Foule devant une scène de concert éclairée en rouge"
                />
                <EventCard
                  title="Jam Session Jazz"
                  tag="#JAZZ"
                  time="21h00 - 00h00"
                  description="Musiciens confirmés et jeunes talents se retrouvent pour une session libre, chaleureuse et pleine d'improvisations."
                  accent="#c29418"
                  image="https://images.unsplash.com/photo-1577042816206-2e85c23f2392?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxqYXp6JTIwYmFuZCUyMGxpdmUlMjBjb25jZXJ0JTIwYmx1ZSUyMHN0YWdlfGVufDF8fHx8MTc5MjA1NjEyNnww&ixlib=rb-4.1.0&q=85&w=900"
                  imageAlt="Groupe jouant sur une scène aux lumières bleues"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {activeScreen === 3 && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" />
          <section
            className="fixed left-1/2 top-1/2 z-50 flex h-[720px] w-[1040px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.34)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
          >
            <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6e7ea] px-7">
              <button
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-semibold text-[#545b65] transition hover:bg-[#f4f5f6] hover:text-[#252a30]"
                onClick={() => setActiveScreen(2)}
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour à la journée
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] transition hover:bg-[#f3f4f5]"
                aria-label="Fermer"
                onClick={() => setActiveScreen(1)}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-[56%_44%]">
              <div className="min-h-0 overflow-y-auto px-10 py-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  {["#ROCK", "#FESTIVAL", "#SCÈNELOCALE"].map((tag, index) => (
                    <span
                      key={tag}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] ${
                        index === 0 ? "bg-[#ff4e64]/10 text-[#df3f52]" : "bg-[#f0f1f3] text-[#656c75]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 id="event-detail-title" className="max-w-[490px] text-[36px] font-bold leading-[1.08] tracking-[-0.04em] text-[#20242a]">
                  Festival Bars 'n Breizh
                </h2>

                <div className="mt-7 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f6f7] text-[#747b84]">
                      <PinIcon className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-[#343940]">L'Étage, Rennes</p>
                      <p className="mt-0.5 text-[12px] text-[#858b94]">1 Esplanade Charles de Gaulle</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f6f7] text-[#747b84]">
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-[14px] font-bold text-[#343940]">20h30 - 23h30</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pl-12 text-[12px] font-semibold">
                    <a className="text-[#df3f52] underline decoration-[#df3f52]/30 underline-offset-4 hover:decoration-current" href="https://www.rennes.fr" target="_blank" rel="noreferrer">
                      Site officiel
                    </a>
                    <a className="text-[#df3f52] underline decoration-[#df3f52]/30 underline-offset-4 hover:decoration-current" href="https://www.rennes.fr" target="_blank" rel="noreferrer">
                      Billetterie
                    </a>
                  </div>
                </div>

                <section className="mt-7 rounded-xl border border-[#e3e5e8] bg-[#fafafa] p-5">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#717781]">Description</h3>
                  <div className="mt-3 space-y-3 text-[13px] leading-[1.62] text-[#5d646e]">
                    <p>
                      Bars 'n Breizh célèbre la scène rock bretonne le temps d'une soirée intense à L'Étage. Une programmation généreuse, pensée pour faire découvrir les groupes qui font vibrer Rennes et ses alentours.
                    </p>
                    <p>
                      Au programme : <strong className="font-semibold text-[#343940]">The Velvet Club</strong>, le trio garage <strong className="font-semibold text-[#343940]">Møon</strong> et les riffs électriques de <strong className="font-semibold text-[#343940]">Red Harbor</strong>. Ouverture des portes à 20h.
                    </p>
                  </div>
                </section>
              </div>

              <div className="relative m-5 ml-0 overflow-hidden rounded-2xl bg-[#25262a]">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY29uY2VydCUyMGNyb3dkJTIwc3RhZ2UlMjByZWQlMjBsaWdodHN8ZW58MXx8fHwxNzkyMDU2MTI1fDA&ixlib=rb-4.1.0&q=90&w=1000"
                  alt="Foule devant la scène du Festival Bars 'n Breizh"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/60" />
                <button
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#ff4e64] shadow-lg backdrop-blur-sm"
                  aria-label="Ajouter aux favoris"
                >
                  <HeartIcon />
                </button>
                <button className="absolute bottom-5 left-5 right-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-[#2e333a] shadow-[0_8px_25px_rgba(0,0,0,0.22)] transition hover:bg-[#f7f7f8]">
                  <PinIcon className="h-[18px] w-[18px] text-[#ff4e64]" />
                  Voir sur la carte
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {activeScreen === 5 && <EventFormModal onClose={() => setActiveScreen(1)} />}

      <nav
        className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/20 bg-[#20242b]/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur"
        aria-label="Sélection de la maquette"
      >
        {([1, 2, 3, 4, 5] as const).map((screen) => (
          <button
            key={screen}
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
