import { ChevronIcon } from "../common/Icons";

interface MapPinProps {
  color?: string;
  className: string;
  multiple?: boolean;
  onClick?: () => void;
}

export function MapPin({ color, className, multiple = false, onClick }: MapPinProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute z-10 -translate-x-1/2 -translate-y-full ${className}`}
      aria-label="Voir les événements à ce lieu"
    >
      <span className="relative flex h-11 w-9 items-start justify-center drop-shadow-[0_5px_5px_rgba(30,40,45,0.25)]">
        <svg className="absolute inset-0 h-11 w-9" viewBox="0 0 36 44" aria-hidden="true">
          <path
            d="M18 43S2.5 27.2 2.5 17.5a15.5 15.5 0 1 1 31 0C33.5 27.2 18 43 18 43Z"
            fill={multiple ? "#ffffff" : color}
            stroke="white"
            strokeWidth="2"
          />
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

interface MapViewProps {
  onCalendar: () => void;
  onDetails: () => void;
}

export function MapView({ onCalendar, onDetails }: MapViewProps) {
  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-[#e9eee9]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1218 826"
        preserveAspectRatio="none"
        aria-label="Carte stylisée du centre-ville de Rennes"
      >
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
        <button type="button" className="flex h-10 w-10 items-center justify-center border-b border-[#e6e8e6] text-xl font-medium text-[#58605a]">+</button>
        <button type="button" className="flex h-10 w-10 items-center justify-center text-xl font-medium text-[#58605a]">−</button>
      </div>
    </main>
  );
}
