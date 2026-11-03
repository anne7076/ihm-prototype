import { useState, useRef, useEffect } from "react";
import { SearchIcon, MenuIcon, PinIcon, CloseIcon } from "./Icons";
import type { Tag } from "../../types";

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  tags: Tag[];
  activeTags: string[];
  searchedTags: Tag[];
  onToggleTag: (id: string) => void;
  onClearFilters: () => void;
  activeScreen: 1 | 2 | 3 | 4 | 5;
  onToggleView: () => void;
  onOpenCreateModal: () => void;
  favoritesCount?: number;
  followedCount?: number;
}

export function Header({
  query,
  onQueryChange,
  tags,
  activeTags,
  searchedTags,
  onToggleTag,
  onClearFilters,
  activeScreen,
  onToggleView,
  onOpenCreateModal,
  favoritesCount = 0,
  followedCount = 0,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="grid h-[124px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#e5e7eb] bg-white px-6">
      <div className="flex min-w-0 items-center gap-3.5">
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#555d68] transition-colors hover:bg-[#f3f4f6]"
          aria-label="Ouvrir le menu"
          title="Menu de navigation"
        >
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
        <span className="truncate text-[15px] font-bold tracking-[0.045em] text-[#222730]">
          AGENDA MUSIQUE - RENNES
        </span>
      </div>

      <div className="mx-5 flex flex-col gap-2">
        <label className="flex h-11 items-center gap-3 rounded-xl border border-[#e2e5e9] bg-[#f8f9fa] px-4 text-[#8b929c] transition focus-within:border-[#ff8a98] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff4e64]/5">
          <SearchIcon className="h-[19px] w-[19px] shrink-0" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#30353b] outline-none placeholder:text-[#9ba1aa]"
            placeholder="#rock #electro ou nom d'un créateur..."
            aria-label="Rechercher par tag ou par créateur"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9ba1aa]">
            Tags
          </span>
          {tags.map((tag) => {
            const checked = activeTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag(tag.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  checked
                    ? "border-transparent text-white shadow-sm"
                    : "border-[#e2e5e9] bg-white text-[#555c65] hover:bg-[#f6f7f8]"
                }`}
                style={checked ? { backgroundColor: tag.color } : undefined}
              >
                <i
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: checked ? "rgba(255,255,255,0.9)" : tag.color }}
                />
                #{tag.id}
                {checked && <CloseIcon className="ml-0.5 h-2.5 w-2.5" />}
              </button>
            );
          })}
          {searchedTags.length > 0 && (
            <>
              <span className="mx-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9ba1aa]">
                Cherché
              </span>
              {searchedTags.map((tag) => (
                <span
                  key={`search-${tag.id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff2f4] px-2.5 py-1 text-[11px] font-bold text-[#dd4052] ring-1 ring-[#ffd2d8]"
                >
                  <i className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                  #{tag.id}
                </span>
              ))}
            </>
          )}
          {(activeTags.length > 0 || searchedTags.length > 0 || query) && (
            <button
              type="button"
              onClick={onClearFilters}
              className="ml-1 text-[11px] font-semibold text-[#8a9099] underline-offset-2 hover:text-[#dd4052] hover:underline"
            >
              Tout effacer
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5">
        <button
          onClick={onOpenCreateModal}
          className="h-11 whitespace-nowrap rounded-xl bg-[#ff4e64] px-4 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(255,78,100,0.23)] transition hover:bg-[#f23f56]"
        >
          +&nbsp; Ajouter un événement
        </button>

        <button
          onClick={onToggleView}
          className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold transition ${
            activeScreen === 4
              ? "border-[#ffd2d8] bg-[#fff2f4] text-[#dd4052]"
              : "border-[#dde0e4] bg-white text-[#40464f] hover:bg-[#f8f9fa]"
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

        {/* Profil utilisateur interactif */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e6dd] text-[#6f5141] ring-2 ring-white shadow-sm transition hover:ring-[#ff4e64]/40"
            aria-label="Ouvrir le menu de profil"
            title="Mon profil"
          >
            <span className="text-[12px] font-extrabold uppercase tracking-wide">MR</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_18px_40px_rgba(26,30,36,0.18)]">
              <div className="flex items-center gap-3 border-b border-[#f0f2f4] pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff4e64] text-[13px] font-extrabold text-white shadow-sm">
                  MR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#22262d]">Mahamadou</p>
                  <p className="truncate text-[11px] text-[#787f8a]">Membre · INSA Rennes</p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[12px]">
                <div className="flex items-center justify-between rounded-lg px-2.5 py-2 transition hover:bg-[#f8f9fa]">
                  <span className="text-[#555c66]">Concerts en favoris</span>
                  <span className="rounded-full bg-[#fff0f2] px-2 py-0.5 font-bold text-[#ff4e64]">
                    {favoritesCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-2.5 py-2 transition hover:bg-[#f8f9fa]">
                  <span className="text-[#555c66]">Abonnements suivis</span>
                  <span className="rounded-full bg-[#f1f3f5] px-2 py-0.5 font-bold text-[#30353c]">
                    {followedCount}
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-[#f0f2f4] pt-2 text-[11px] text-[#8e95a0]">
                <p>Agenda Musical de Rennes v2.1</p>
                <p className="text-[10px]">Base SQLite locale active</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
