import { useState, useEffect, useRef } from "react";
import type { Tag, Event } from "../../types";
import { PinIcon } from "../common/Icons";

interface EventFormModalProps {
  tags: Tag[];
  onClose: () => void;
  onSubmit: (event: Omit<Event, "id" | "isFavorite">) => Promise<void>;
}

// Emplacements connus et vérifiés à Rennes avec coordonnées réelles
const KNOWN_VENUES = [
  { name: "L'Ubu", address: "1 Rue Saint-Hélier, 35000 Rennes", lat: 48.1077, lng: -1.6738 },
  { name: "L'Étage", address: "1 Esplanade Charles de Gaulle, 35000 Rennes", lat: 48.1054, lng: -1.6775 },
  { name: "L'Antipode", address: "75 Avenue Jules Maniez, 35000 Rennes", lat: 48.0988, lng: -1.7126 },
  { name: "Chez Gilbert", address: "Place Sainte-Anne, 35000 Rennes", lat: 48.1144, lng: -1.6808 },
  { name: "Le Bar'Hic", address: "24 Place des Lices, 35000 Rennes", lat: 48.1128, lng: -1.6839 },
  { name: "Parc du Thabor & Kiosque", address: "Place Saint-Melaine, 35000 Rennes", lat: 48.1145, lng: -1.6702 },
  { name: "Le Liberté", address: "1 Esplanade Charles de Gaulle, 35000 Rennes", lat: 48.1058, lng: -1.6769 },
  { name: "Le Jardin Moderne", address: "11 Rue du Manoir de Servigné, 35000 Rennes", lat: 48.1015, lng: -1.7328 },
];

interface AddressSuggestion {
  label: string;
  name: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
}

export function EventFormModal({ tags, onClose, onSubmit }: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("rock");
  const [secondaryTags, setSecondaryTags] = useState("");
  const [dateStr, setDateStr] = useState<string>("2026-10-16");
  const [startTime, setStartTime] = useState("20h30");
  const [endTime, setEndTime] = useState("23h30");

  // Mode de saisie de lieu : "known" (sélection rapide) ou "custom" (recherche géocodée)
  const [venueMode, setVenueMode] = useState<"known" | "custom">("known");
  const [venueIndex, setVenueIndex] = useState<number>(0);
  const [customVenueName, setCustomVenueName] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);

  // Upload d'image / Affiche
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("/images/events/rock-concert.jpg");
  const [siteUrl, setSiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autocomplétion d'adresses officielles via l'API Adresse nationale (gratuite, instantanée, sans clé API)
  useEffect(() => {
    if (venueMode !== "custom" || addressQuery.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            addressQuery
          )}&citycode=35238&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const suggestions: AddressSuggestion[] = data.features.map((f: any) => ({
            label: f.properties.label,
            name: f.properties.name,
            postcode: f.properties.postcode,
            city: f.properties.city,
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }));
          setAddressSuggestions(suggestions);
        }
      } catch (err) {
        console.warn("Échec du géocodage:", err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [addressQuery, venueMode]);

  // Gestion du téléversement d'image réel
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const tagObj = tags.find((t) => t.id === selectedTag) || tags[0];

      let venueName = "";
      let venueAddress = "";
      let lat = 48.1113;
      let lng = -1.6800;

      if (venueMode === "known") {
        const venue = KNOWN_VENUES[venueIndex];
        venueName = venue.name;
        venueAddress = venue.address;
        lat = venue.lat;
        lng = venue.lng;
      } else {
        venueName = customVenueName.trim() || selectedAddress?.name || "Lieu rennais";
        venueAddress = selectedAddress?.label || addressQuery || "Rennes, France";
        lat = selectedAddress?.lat ?? 48.1113;
        lng = selectedAddress?.lng ?? -1.6800;
      }

      await onSubmit({
        dateStr,
        hour: startTime.split("h")[0] ? `${startTime.split("h")[0]}h00` : "20h00",
        title: title.trim(),
        tag: selectedTag,
        description: description.trim() || "Concert live et soirée musicale à Rennes.",
        color: `${tagObj.color}25`,
        textColor: tagObj.color,
        timeRange: `${startTime} - ${endTime}`,
        venueName,
        venueAddress,
        lat,
        lng,
        officialSiteUrl: siteUrl.trim() || undefined,
        imageUrl: imagePreviewUrl,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1.5 h-10 w-full rounded-xl border border-[#dfe2e6] bg-white px-3.5 text-[13px] text-[#343940] outline-none transition placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs" aria-hidden="true" onClick={onClose} />
      <section
        className="fixed left-1/2 top-1/2 z-50 flex h-[760px] w-[1080px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_32px_100px_rgba(0,0,0,0.36)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#e6e7ea] px-8 bg-white">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#ff4e64]">
              Programmation Participative
            </p>
            <h2 id="form-title" className="text-[21px] font-bold tracking-[-0.02em] text-[#22262d]">
              Ajouter un événement à Rennes
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e6e9] text-[#59606a] hover:bg-[#f3f4f5] transition"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-8 overflow-y-auto px-8 py-5">
            {/* Colonne gauche : Métadonnées et Géolocalisation */}
            <div className="space-y-3.5">
              <label className="block text-[12px] font-bold text-[#4c535c]">
                Titre de l'événement <span className="text-[#ff4e64]">*</span>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="Ex : Concert Rock & Guitares live"
                />
              </label>

              <fieldset>
                <legend className="text-[12px] font-bold text-[#4c535c]">Genre musical</legend>
                <div className="mt-1.5 grid grid-cols-5 gap-2">
                  {tags.map((genre) => (
                    <label key={genre.id} className="cursor-pointer">
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="genre"
                        checked={selectedTag === genre.id}
                        onChange={() => setSelectedTag(genre.id)}
                      />
                      <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#e1e3e6] text-[10px] font-bold text-[#5e646d] transition peer-checked:border-[#ff9ba7] peer-checked:bg-[#fff4f5] peer-checked:text-[#d93e50]">
                        <i className="h-2 w-2 rounded-full" style={{ backgroundColor: genre.color }} />
                        {genre.name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2.5">
                <label className="block text-[12px] font-bold text-[#4c535c]">
                  Date <span className="text-[#ff4e64]">*</span>
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

              {/* Module Géolocalisation Intelligente à Rennes */}
              <div className="rounded-xl border border-[#dfe3e8] bg-[#fbfbfc] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#353b44]">
                    <PinIcon className="h-4 w-4 text-[#ff4e64]" />
                    Lieu & Adresse à Rennes
                  </span>
                  <div className="flex rounded-lg border border-[#e2e5e9] bg-white p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setVenueMode("known")}
                      className={`rounded px-2 py-1 transition ${
                        venueMode === "known" ? "bg-[#ff4e64] text-white" : "text-[#626974]"
                      }`}
                    >
                      Lieux connus
                    </button>
                    <button
                      type="button"
                      onClick={() => setVenueMode("custom")}
                      className={`rounded px-2 py-1 transition ${
                        venueMode === "custom" ? "bg-[#ff4e64] text-white" : "text-[#626974]"
                      }`}
                    >
                      Adresse libre (GPS)
                    </button>
                  </div>
                </div>

                {venueMode === "known" ? (
                  <div>
                    <select
                      value={venueIndex}
                      onChange={(e) => setVenueIndex(Number(e.target.value))}
                      className={inputClass}
                    >
                      {KNOWN_VENUES.map((v, i) => (
                        <option key={v.name} value={i}>
                          {v.name} — {v.address}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[11px] font-medium text-[#2d7e48] flex items-center gap-1">
                      ✓ Coordonnées vérifiées : [{KNOWN_VENUES[venueIndex].lat}, {KNOWN_VENUES[venueIndex].lng}]
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <input
                        value={customVenueName}
                        onChange={(e) => setCustomVenueName(e.target.value)}
                        className={inputClass}
                        placeholder="Nom de la salle, bar ou scène (ex: 1988 Live Club)"
                      />
                    </div>
                    <div className="relative">
                      <input
                        value={addressQuery}
                        onChange={(e) => {
                          setAddressQuery(e.target.value);
                          setSelectedAddress(null);
                        }}
                        className={inputClass}
                        placeholder="Tapez une rue ou adresse à Rennes (ex: Rue Saint-Malo)..."
                      />
                      {isSearchingAddress && (
                        <span className="absolute right-3 top-3 text-[11px] text-[#8a929e]">
                          Recherche...
                        </span>
                      )}

                      {addressSuggestions.length > 0 && !selectedAddress && (
                        <ul className="absolute left-0 right-0 top-12 z-30 max-h-48 overflow-y-auto rounded-xl border border-[#dfe3e8] bg-white shadow-xl">
                          {addressSuggestions.map((sug) => (
                            <li
                              key={sug.label}
                              onClick={() => {
                                setSelectedAddress(sug);
                                setAddressQuery(sug.label);
                                setAddressSuggestions([]);
                              }}
                              className="cursor-pointer px-3.5 py-2 text-[12px] hover:bg-[#fff2f4] hover:text-[#dd4052] transition border-b border-[#f2f4f6] last:border-b-0"
                            >
                              <p className="font-semibold">{sug.name}</p>
                              <p className="text-[11px] text-[#7d8490]">{sug.postcode} {sug.city}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {selectedAddress && (
                      <p className="text-[11px] font-medium text-[#2d7e48] flex items-center gap-1">
                        ✓ Adresse géocodée : [{selectedAddress.lat.toFixed(4)}, {selectedAddress.lng.toFixed(4)}]
                      </p>
                    )}
                  </div>
                )}
              </div>

              <label className="block text-[12px] font-bold text-[#4c535c]">
                Tags secondaires (#)
                <input
                  value={secondaryTags}
                  onChange={(e) => setSecondaryTags(e.target.value)}
                  className={inputClass}
                  placeholder="#gratuit #étudiant #découverte"
                />
              </label>

              <label className="block text-[12px] font-bold text-[#4c535c]">
                Billetterie ou lien officiel
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </label>
            </div>

            {/* Colonne droite : Visuel / Affiche & Description */}
            <div className="flex flex-col gap-3.5">
              <div>
                <p className="text-[12px] font-bold text-[#4c535c]">Affiche ou photo de couverture</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 relative flex h-[190px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#d6dade] bg-[#fafbfb] text-center transition hover:border-[#ff9ba7] hover:bg-[#fffafb]"
                >
                  {imagePreviewUrl ? (
                    <div className="relative h-full w-full">
                      <img
                        src={imagePreviewUrl}
                        alt="Aperçu affiche"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-[#20252b] shadow">
                          Changer l'image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f2] text-[#ff4e64]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 7.5h3l1.3-2h7.4l1.3 2h3v11H4v-11Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                      </span>
                      <p className="mt-2 text-[12px] font-semibold text-[#4f5660]">
                        Cliquez ou glissez une image ici
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex min-h-0 flex-1 flex-col text-[12px] font-bold text-[#4c535c]">
                Description de l'événement
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 min-h-[140px] flex-1 resize-none rounded-xl border border-[#dfe2e6] p-3 text-[13px] font-normal leading-relaxed outline-none placeholder:text-[#a3a8af] focus:border-[#ff8a98] focus:ring-4 focus:ring-[#ff4e64]/5"
                  placeholder="Programmation, artistes, billetterie, accessibilité..."
                />
              </label>
            </div>
          </div>

          <footer className="flex h-[70px] shrink-0 items-center justify-end gap-3 border-t border-[#e6e7ea] bg-[#fafafa] px-8">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-[#dfe2e6] bg-white px-5 text-[13px] font-semibold text-[#555c65] hover:bg-[#f5f6f7] transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl bg-[#ff4e64] px-6 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,78,100,0.24)] hover:bg-[#ed3f55] disabled:opacity-50 transition"
            >
              {isSubmitting ? "Enregistrement dans SQLite..." : "Publier l'événement"}
            </button>
          </footer>
        </form>
      </section>
    </>
  );
}
