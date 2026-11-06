import { useState, useEffect, useRef, useMemo } from "react";
import type { Tag, Event } from "../../types";
import { PinIcon } from "../common/Icons";
import { filterAndRankFuzzy, normalizeText } from "../../utils/fuzzy";

interface EventFormModalProps {
  tags: Tag[];
  onAddTag: (tag: { id: string; name: string; color: string }) => Promise<Tag>;
  onClose: () => void;
  onSubmit: (event: Omit<Event, "id" | "isFavorite">) => Promise<void>;
}

const GENRE_PALETTE = [
  "#ef5a5a", // Rouge / Rock
  "#4e8ff7", // Bleu / Electro
  "#f3c84b", // Jaune doré / Jazz
  "#a86ae3", // Violet / Pop
  "#55ae78", // Vert / Reggae
  "#ec4899", // Rose fuchsia / Disco / Indie
  "#f97316", // Orange / Funk / Soul
  "#06b6d4", // Cyan / Synthwave
  "#8b5cf6", // Indigo / Metal
  "#14b8a6", // Teal / Folk
  "#6366f1", // Iris / Hip-hop
  "#d97706", // Ambre / Blues
  "#84cc16", // Lime / Punk
];

function generateGenreColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GENRE_PALETTE.length;
  return GENRE_PALETTE[index];
}

interface AddressSuggestion {
  label: string;
  name: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
}

export function EventFormModal({ tags, onAddTag, onClose, onSubmit }: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("rock");
  const [secondaryTags, setSecondaryTags] = useState<string[]>([]);
  const [dateStr, setDateStr] = useState<string>("2026-10-16");
  const [startTime, setStartTime] = useState("20h30");
  const [endTime, setEndTime] = useState("23h30");

  // Combobox genre musical prioritaire
  const [genreSearch, setGenreSearch] = useState("");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  // Combobox genres secondaires (multi-genres)
  const [secondarySearch, setSecondarySearch] = useState("");
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const secondaryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target as Node)) {
        setIsGenreOpen(false);
      }
      if (secondaryDropdownRef.current && !secondaryDropdownRef.current.contains(e.target as Node)) {
        setIsSecondaryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTagObj = tags.find((t) => t.id === selectedTag) || tags[0];

  const filteredGenres = useMemo(() => {
    if (!genreSearch.trim()) return tags;
    return filterAndRankFuzzy(tags, genreSearch, (t) => `${t.name} #${t.id}`);
  }, [tags, genreSearch]);

  const exactGenreExists = useMemo(() => {
    const q = normalizeText(genreSearch);
    if (!q) return true;
    return tags.some((t) => normalizeText(t.name) === q || normalizeText(t.id) === q);
  }, [tags, genreSearch]);

  const handleSelectGenre = (tagId: string) => {
    setSelectedTag(tagId);
    // Si ce genre était dans les secondaires, on le retire
    setSecondaryTags((prev) => prev.filter((id) => id !== tagId));
    setGenreSearch("");
    setIsGenreOpen(false);
  };

  const handleCreateNewGenre = async () => {
    const trimmed = genreSearch.trim();
    if (!trimmed) return;
    const cleanId =
      normalizeText(trimmed)
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || `genre-${Date.now()}`;
    const color = generateGenreColor(trimmed);
    const newTag = await onAddTag({
      id: cleanId,
      name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      color,
    });
    setSelectedTag(newTag.id);
    setGenreSearch("");
    setIsGenreOpen(false);
  };

  // Gestion des tags secondaires
  const filteredSecondaryTags = useMemo(() => {
    if (!secondarySearch.trim()) return tags;
    return filterAndRankFuzzy(tags, secondarySearch, (t) => `${t.name} #${t.id}`);
  }, [tags, secondarySearch]);

  const handleToggleSecondaryTag = (tagId: string) => {
    if (tagId === selectedTag) return; // Ne pas doubler avec le prioritaire
    setSecondaryTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setSecondarySearch("");
  };

  const handleRemoveSecondaryTag = (tagId: string) => {
    setSecondaryTags((prev) => prev.filter((id) => id !== tagId));
  };

  const handlePromoteToPrimary = (tagId: string) => {
    const oldPrimary = selectedTag;
    setSelectedTag(tagId);
    setSecondaryTags((prev) => [
      ...prev.filter((id) => id !== tagId),
      oldPrimary,
    ]);
  };

  const handleAddCustomSecondaryTag = async () => {
    const trimmed = secondarySearch.trim();
    if (!trimmed) return;
    const cleanId =
      normalizeText(trimmed)
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || `genre-${Date.now()}`;
    const color = generateGenreColor(trimmed);
    const newTag = await onAddTag({
      id: cleanId,
      name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      color,
    });
    if (!secondaryTags.includes(newTag.id) && newTag.id !== selectedTag) {
      setSecondaryTags((prev) => [...prev, newTag.id]);
    }
    setSecondarySearch("");
    setIsSecondaryOpen(false);
  };

  // Géolocalisation libre et autocomplétion GPS à Rennes
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
    if (addressQuery.trim().length < 3) {
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
  }, [addressQuery]);

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

      const venueName = customVenueName.trim() || selectedAddress?.name || "Lieu rennais";
      const venueAddress = selectedAddress?.label || addressQuery || "Rennes, France";
      const lat = selectedAddress?.lat ?? 48.1113;
      const lng = selectedAddress?.lng ?? -1.6800;

      await onSubmit({
        dateStr,
        hour: startTime.split("h")[0] ? `${startTime.split("h")[0]}h00` : "20h00",
        title: title.trim(),
        tag: selectedTag,
        secondaryTags,
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

              {/* Genres musicaux : Prioritaire et Secondaires côte-à-côte */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Genre prioritaire (Principal - couleur affichée sur le calendrier) */}
                <div className="relative" ref={genreDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-bold text-[#4c535c]">
                      Genre prioritaire <span className="text-[#ff4e64]">*</span>
                    </label>
                    <span className="text-[10px] font-semibold text-[#7f8691]">
                      (Couleur calendrier)
                    </span>
                  </div>

                  <div
                    className={`mt-1.5 flex h-10 w-full items-center gap-2 rounded-xl border bg-white px-3 transition cursor-pointer ${
                      isGenreOpen
                        ? "border-[#ff8a98] ring-4 ring-[#ff4e64]/5"
                        : "border-[#dfe2e6] hover:border-[#ccd1d8]"
                    }`}
                    onClick={() => setIsGenreOpen(true)}
                  >
                    <span
                      className="flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold text-white shadow-xs shrink-0"
                      style={{ backgroundColor: currentTagObj?.color || "#ff4e64" }}
                    >
                      <i className="h-2 w-2 rounded-full bg-white/90" />
                      #{currentTagObj?.id || selectedTag}
                    </span>

                    <input
                      type="text"
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-[#343940] outline-none placeholder:text-[#9ea4ad]"
                      placeholder="Filtrer ou ajouter..."
                      value={genreSearch}
                      onChange={(e) => {
                        setGenreSearch(e.target.value);
                        setIsGenreOpen(true);
                      }}
                      onFocus={() => setIsGenreOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (filteredGenres.length > 0) {
                            handleSelectGenre(filteredGenres[0].id);
                          } else if (!exactGenreExists && genreSearch.trim()) {
                            handleCreateNewGenre();
                          }
                        } else if (e.key === "Escape") {
                          setIsGenreOpen(false);
                        }
                      }}
                    />

                    <svg
                      className={`h-4 w-4 shrink-0 text-[#8c939d] transition-transform ${isGenreOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Dropdown Genre prioritaire */}
                  {isGenreOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#e2e5e9] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
                      {!exactGenreExists && genreSearch.trim() && (
                        <button
                          type="button"
                          onClick={handleCreateNewGenre}
                          className="mb-1 flex w-full items-center justify-between rounded-lg bg-[#fff4f5] px-3 py-2 text-left text-[12px] font-bold text-[#dd4052] transition hover:bg-[#ffebee]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4e64] text-white text-[13px] font-bold">
                              +
                            </span>
                            <span>Créer le genre « {genreSearch.trim()} »</span>
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-[#ff4e64] bg-white px-2 py-0.5 rounded-full border border-[#ffd2d8]">
                            Nouveau
                          </span>
                        </button>
                      )}

                      <div className="space-y-0.5">
                        {filteredGenres.map((g) => {
                          const isSelected = selectedTag === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => handleSelectGenre(g.id)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] transition ${
                                isSelected
                                  ? "bg-[#f4f7fb] font-bold text-[#1f2937]"
                                  : "text-[#4b5563] hover:bg-[#f8f9fa]"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                                <span className="font-semibold">{g.name}</span>
                                <span className="text-[11px] text-[#9ca3af]">#{g.id}</span>
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold uppercase text-[#ff4e64] bg-[#fff0f2] px-2 py-0.5 rounded-md">
                                  Prioritaire
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Genres & Tags secondaires (Multi-genres pour filtres) */}
                <div className="relative" ref={secondaryDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-bold text-[#4c535c]">
                      Tags secondaires
                    </label>
                    <span className="text-[10px] font-semibold text-[#7f8691]">
                      (Recherche & Filtres)
                    </span>
                  </div>

                  <div
                    className={`mt-1.5 flex min-h-[40px] w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white p-1.5 transition cursor-pointer ${
                      isSecondaryOpen
                        ? "border-[#ff8a98] ring-4 ring-[#ff4e64]/5"
                        : "border-[#dfe2e6] hover:border-[#ccd1d8]"
                    }`}
                    onClick={() => setIsSecondaryOpen(true)}
                  >
                    {secondaryTags.map((secId) => {
                      const tagItem = tags.find((t) => t.id === secId);
                      return (
                        <span
                          key={secId}
                          className="inline-flex items-center gap-1 rounded-full border border-[#e1e4e8] bg-[#f8f9fa] px-2 py-0.5 text-[11px] font-semibold text-[#374151]"
                        >
                          <i
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: tagItem?.color || "#888" }}
                          />
                          #{secId}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecondaryTag(secId);
                            }}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-[#e5e7eb] text-[#6b7280]"
                            title="Retirer ce tag secondaire"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromoteToPrimary(secId);
                            }}
                            className="ml-0.5 text-[9px] font-bold text-[#ff4e64] hover:underline"
                            title="Élire en genre prioritaire"
                          >
                            ↑ Élu
                          </button>
                        </span>
                      );
                    })}

                    <input
                      type="text"
                      className="min-w-[90px] flex-1 bg-transparent px-1.5 text-[12px] text-[#343940] outline-none placeholder:text-[#9ea4ad]"
                      placeholder={secondaryTags.length === 0 ? "Ajouter d'autres genres..." : "+ Autre"}
                      value={secondarySearch}
                      onChange={(e) => {
                        setSecondarySearch(e.target.value);
                        setIsSecondaryOpen(true);
                      }}
                      onFocus={() => setIsSecondaryOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (filteredSecondaryTags.length > 0) {
                            handleToggleSecondaryTag(filteredSecondaryTags[0].id);
                          } else if (secondarySearch.trim()) {
                            handleAddCustomSecondaryTag();
                          }
                        } else if (e.key === "Escape") {
                          setIsSecondaryOpen(false);
                        }
                      }}
                    />
                  </div>

                  {/* Dropdown Genres secondaires */}
                  {isSecondaryOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-[#e2e5e9] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
                      {secondarySearch.trim() &&
                        !tags.some(
                          (t) =>
                            normalizeText(t.id) === normalizeText(secondarySearch) ||
                            normalizeText(t.name) === normalizeText(secondarySearch)
                        ) && (
                          <button
                            type="button"
                            onClick={handleAddCustomSecondaryTag}
                            className="mb-1 flex w-full items-center justify-between rounded-lg bg-[#f0f9ff] px-3 py-1.5 text-left text-[11px] font-bold text-[#0369a1] transition hover:bg-[#e0f2fe]"
                          >
                            <span>+ Créer et lier « {secondarySearch.trim()} »</span>
                            <span className="text-[9px] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#bae6fd]">
                              Nouveau tag
                            </span>
                          </button>
                        )}

                      <div className="space-y-0.5">
                        {filteredSecondaryTags.map((g) => {
                          const isSec = secondaryTags.includes(g.id);
                          const isPrim = selectedTag === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => handleToggleSecondaryTag(g.id)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] transition ${
                                isSec
                                  ? "bg-[#fff0f2] font-bold text-[#dd4052]"
                                  : "text-[#4b5563] hover:bg-[#f8f9fa]"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                                <span>{g.name}</span>
                                <span className="text-[10px] text-[#9ca3af]">#{g.id}</span>
                              </span>
                              {isPrim ? (
                                <span className="text-[9px] font-bold text-[#9ca3af]">
                                  (Genre prioritaire)
                                </span>
                              ) : isSec ? (
                                <span className="text-[10px] font-bold text-[#ff4e64]">
                                  ✓ Inclus
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#9ca3af] hover:text-[#ff4e64]">
                                  + Ajouter
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

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
                  {selectedAddress && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#208343] bg-[#eef8f1] px-2.5 py-0.5 rounded-full">
                      ✓ Validé avec GPS
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#666e79]">
                      Nom de la salle, scène ou établissement
                    </label>
                    <input
                      value={customVenueName}
                      onChange={(e) => setCustomVenueName(e.target.value)}
                      className={inputClass}
                      placeholder="Ex : L'Ubu, Antipode, 1988 Live Club, Place Sainte-Anne..."
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[11px] font-semibold text-[#666e79]">
                      Adresse postale (recherche interactive) <span className="text-[#ff4e64]">*</span>
                    </label>
                    <input
                      required
                      value={addressQuery}
                      onChange={(e) => {
                        setAddressQuery(e.target.value);
                        setSelectedAddress(null);
                      }}
                      className={inputClass}
                      placeholder="Tapez une rue, place ou adresse à Rennes (ex: 1 Rue Saint-Hélier)..."
                    />
                    {isSearchingAddress && (
                      <span className="absolute right-3 top-8 text-[11px] text-[#8a929e]">
                        Recherche GPS...
                      </span>
                    )}

                    {addressSuggestions.length > 0 && !selectedAddress && (
                      <ul className="absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border border-[#dfe3e8] bg-white shadow-xl">
                        {addressSuggestions.map((sug) => (
                          <li
                            key={`${sug.lat}-${sug.lng}-${sug.label}`}
                            onClick={() => {
                              setSelectedAddress(sug);
                              setAddressQuery(sug.label);
                              if (!customVenueName) {
                                setCustomVenueName(sug.name);
                              }
                              setAddressSuggestions([]);
                            }}
                            className="cursor-pointer px-3.5 py-2 text-[12px] hover:bg-[#fff2f4] hover:text-[#dd4052] transition border-b border-[#f2f4f6] last:border-b-0"
                          >
                            <p className="font-semibold text-[#20252c]">{sug.name}</p>
                            <p className="text-[11px] text-[#7d8490]">{sug.postcode} {sug.city}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

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
