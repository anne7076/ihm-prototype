import type { Creator } from "../../types";
import { initials } from "../../utils/formatters";

interface SidebarProps {
  creators: Creator[];
  onToggleFollow: (id: string) => void;
}

export function Sidebar({ creators, onToggleFollow }: SidebarProps) {
  const followed = creators.filter((c) => c.isFollowed);
  const suggested = creators.filter((c) => !c.isFollowed);

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <section>
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.11em] text-[#7b828c]">
            Mes abonnements ({followed.length})
          </h2>
          <ul className="space-y-1">
            {followed.map((creator) => (
              <li
                key={creator.id}
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-[#f8f9fa]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef0f2] text-[11px] font-bold text-[#5b626c]">
                    {initials(creator.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[#414750]">
                      {creator.name}
                    </span>
                    <span className="block text-[11px] text-[#8a9099]">{creator.kind}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleFollow(creator.id)}
                  className="hidden text-[11px] font-semibold text-[#9aa0a6] hover:text-[#e14456] group-hover:block"
                  title="Ne plus suivre"
                >
                  ✕
                </button>
              </li>
            ))}
            {followed.length === 0 && (
              <p className="py-2 text-[12px] text-[#9ba1aa]">Aucun abonnement pour le moment.</p>
            )}
          </ul>
        </section>

        {suggested.length > 0 && (
          <section className="mt-6 rounded-xl border border-[#eef0f3] bg-[#fbfbfc] p-4">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.11em] text-[#7b828c]">
              Découvrir
            </h2>
            <p className="mt-1 text-[11px] text-[#9298a0]">Populaires parmi tes abonnements</p>
            <ul className="mt-3 space-y-3">
              {suggested.map((creator) => (
                <li key={creator.id} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef0f2] text-[11px] font-bold text-[#5b626c]">
                    {initials(creator.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[#414750]">
                      {creator.name}
                    </span>
                    <span className="block truncate text-[11px] text-[#8a9099]">
                      {creator.kind}
                      {creator.mutuals ? ` · suivi par ${creator.mutuals} de vos abonnements` : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleFollow(creator.id)}
                    className="shrink-0 rounded-lg border border-[#ffd2d8] bg-[#fff2f4] px-2.5 py-1.5 text-[11px] font-bold text-[#dd4052] transition hover:bg-[#ffe6ea]"
                  >
                    Suivre
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}
