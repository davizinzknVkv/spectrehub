import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchGuilds, type Guild } from "@/lib/quest-runner";
import { useQuestStore } from "@/lib/quest-store";
import { Copy, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/clone")({
  head: () => ({ meta: [{ title: "Clonar Discord — Neighborshub" }] }),
  component: ClonePage,
});

function ClonePage() {
  const creds = useQuestStore((s) => s.creds);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!creds) return;
    setLoading(true);
    fetchGuilds()
      .then(setGuilds)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [creds]);

  const filtered = useMemo(
    () =>
      guilds.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())),
    [guilds, query],
  );

  if (!creds) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber/30 bg-surface/60 p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
          $ status --token
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-ink">Token não configurado</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Configure seu token na página de Login para carregar seus servidores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="discord --clone"
        icon={Copy}
        title="Clonar"
        highlight="Discord"
        description="Selecione um servidor para clonar canais, cargos e categorias."
      />


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar servidor…"
            className="w-full rounded-md border border-line bg-surface/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-mute focus:border-cyan/50 focus:outline-none"
          />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          {loading ? "carregando…" : `${filtered.length}/${guilds.length} servidores`}
        </span>
      </div>

      {!loading && guilds.length === 0 && (
        <div className="rounded-xl border border-line bg-surface/40 p-10 text-center font-mono text-xs text-ink-mute">
          nenhum servidor encontrado
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((g) => {
          const iconUrl = g.icon
            ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`
            : null;
          const initials = g.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-lg border border-line/70 bg-background/40 p-2.5 transition hover:border-purple/40"
              title={g.name}
            >
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-md border border-line object-cover"
                />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-[11px] font-semibold text-cyan">
                  {initials || "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-ink">{g.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  {g.owner ? "owner" : "membro"}
                </div>
              </div>
              <button
                onClick={() => toast.info("Clonagem em breve 🚀")}
                className="grid h-8 w-8 place-items-center rounded-md border border-purple/40 bg-purple/10 text-purple hover:bg-purple/20"
                title="Clonar"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
