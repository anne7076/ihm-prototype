import { useState } from "react";
import type { Tag, Event } from "../../types";
import { PinIcon } from "../common/Icons";

interface EventFormModalProps {
  tags: Tag[];
  onClose: () => void;
  onSubmit: (event: Omit<Event, "id" | "isFavorite">) => Promise<void>;
}

// Emplacements connus à Rennes avec coordonnées réelles
const KNOWN_VENUES = [
  { name: "L'Ubu", address: "1 Rue Saint-Hélier, 35000 Rennes", lat: 48.1077, lng: -1.6738 },
  { name: "L'Étage", address: "1 Esplanade Charles de Gaulle, 35000 Rennes", lat: 48.1054, lng: -1.6775 },
  { name: "L'Antipode", address: "75 Avenue Jules Maniez, 35000 Rennes", lat: 48.0988, lng: -1.7126 },
  { name: "Chez Gilbert", address: "Place Sainte-Anne, 35000 Rennes", lat: 48.1144, lng: -1.6808 },
  { name: "Le Bar'Hic", address: "24 Place des Lices, 35000 Rennes", lat: 48.1128, lng: -1.6839 },
  { name: "Parc du Thabor", address: "Place Saint-Melaine, 35000 Rennes", lat: 48.1145, lng: -1.6702 },
];

export function EventFormModal({ tags, onClose, onSubmit }: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("rock");
  const [secondaryTags, setSecondaryTags] = useState("");
  const [dateStr, setDateStr] = useState<string>("2026-10-16");
  const [startTime, setStartTime] = useState("20h30");
  const [endTime, setEndTime] = useState("23h30");
  const [venueIndex, setVenueIndex] = useState<number>(0);
  const [siteUrl, setSiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const tagObj = tags.find((t) => t.id === selectedTag) || tags[0];
      const venue = KNOWN_VENUES[venueIndex];

      await onSubmit({
        dateStr,
        hour: startTime.split("h")[0] ? `${startTime.split("h")[0]}h00` : "20h00",
        title: title.trim(),
        tag: selectedTag,
        description: description.trim() || "Concert live et soirée musicale à Rennes.",
        color: `${tagObj.color}25`,
        textColor: tagObj.color,
        timeRange: `${startTime} - ${endTime}`,
        venueName: venue.name,
        venueAddress: venue.address,
        lat: venue.lat,
        lng: venue.lng,
        officialSiteUrl: siteUrl.trim() || undefined,
        imageUrl:
          selectedTag === "jazz"
            ? "/images/events/jazz-band.jpg"
            : selectedTag === "electro"
            ? "/images/events/electro-lights.jpg"
            : selectedTag === "reggae"
            ? "/images/events/reggae-outdoor.jpg"
            : selectedTag === "pop"
            ? "/images/events/pop-singer.jpg"
            : "/images/events/rock-concert.jpg",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-[#dfe2e6] bg-white px-3.5 text-[13px] text-[#343940] outline-none transition placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" aria-hidden="true" onClick={onClose} />
      <section
        className="fixed left-1/2 top-1/2 z-50 flex h-[750px] w-[1060px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.34)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6e7ea] px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#ff4e64]">
              Agenda participatif
            </p>
            <h2 id="form-title" className="mt-1 text-[22px] font-bold tracking-[-0.02em]">
              Proposer un nouvel événement
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] hover:bg-[#f3f4f5]"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-9 overflow-y-auto px-8 py-6">
            <div className="space-y-4">
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Titre de l'événement
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="Ex : Concert Rock indé"
                />
              </label>

              <fieldset>
                <legend className="text-[12px] font-bold text-[#4c535c]">Genre principal</legend>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {tags.map((genre) => (
                    <label key={genre.id} className="cursor-pointer">
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="genre"
                        checked={selectedTag === genre.id}
                        onChange={() => setSelectedTag(genre.id)}
                      />
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
                <input
                  value={secondaryTags}
                  onChange={(e) => setSecondaryTags(e.target.value)}
                  className={inputClass}
                  placeholder="#gratuit #festival #étudiant"
                />
              </label>

              <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-3">
                <label className="block text-[12px] font-bold text-[#4c535c]">
                  Date
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block text-[12px] font-bold text-[#4c535c]">
                  Début
                  <input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={inputClass}
                    placeholder="20h30"
                  />
                </label>
                <label className="block text-[12px] font-bold text-[#4c535c]">
                  Fin
                  <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={inputClass}
                    placeholder="23h30"
                  />
                </label>
              </div>

              <label className="block text-[12px] font-bold text-[#4c535c]">
                Lieu à Rennes <span className="font-normal text-[#949aa2]">(géolocalisé sur la carte)</span>
                <span className="relative block">
                  <PinIcon className="absolute left-3.5 top-[21px] h-[17px] w-[17px] text-[#8b929b]" />
                  <select
                    value={venueIndex}
                    onChange={(e) => setVenueIndex(Number(e.target.value))}
                    className={`${inputClass} pl-10`}
                  >
                    {KNOWN_VENUES.map((v, i) => (
                      <option key={v.name} value={i}>
                        {v.name} — {v.address}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="block text-[12px] font-bold text-[#4c535c]">
                Lien du site web / Billetterie
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </label>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[12px] font-bold text-[#4c535c]">Affiche ou photo</p>
                <button
                  type="button"
                  className="mt-2 flex h-[215px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6dade] bg-[#fafbfb] text-center transition hover:border-[#ff9ba7] hover:bg-[#fffafb]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f2] text-[#ff4e64]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 7.5h3l1.3-2h7.4l1.3 2h3v11H4v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  </span>
                  <span className="mt-3 text-[13px] font-semibold text-[#4f5660]">
                    Glisser l'affiche ou une photo ici
                  </span>
                  <span className="mt-1 text-[11px] text-[#9298a0]">
                    Format paysage recommandé · JPG ou PNG
                  </span>
                  <span className="mt-3 rounded-lg border border-[#e0e3e6] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#616872]">
                    Parcourir les fichiers
                  </span>
                </button>
              </div>

              <label className="flex min-h-0 flex-1 flex-col text-[12px] font-bold text-[#4c535c]">
                Description de l'événement
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 min-h-[165px] flex-1 resize-none rounded-xl border border-[#dfe2e6] p-3.5 text-[13px] font-normal leading-relaxed outline-none placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5"
                  placeholder="Programmation, artistes, tarifs, informations pratiques..."
                />
              </label>
            </div>
          </div>

          <footer className="flex h-[74px] shrink-0 items-center justify-end gap-3 border-t border-[#e6e7ea] bg-[#fafafa] px-8">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-[#dfe2e6] bg-white px-5 text-[13px] font-semibold text-[#555c65] hover:bg-[#f5f6f7]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[#ff4e64] px-6 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,78,100,0.24)] hover:bg-[#ed3f55] disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement dans SQLite..." : "Ajouter à l'agenda"}
            </button>
          </footer>
        </form>
      </section>
    </>
  );
}
