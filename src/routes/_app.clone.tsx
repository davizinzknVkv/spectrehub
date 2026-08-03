import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchGuilds, type Guild } from "@/lib/quest-runner";
import { useQuestStore } from "@/lib/quest-store";
import { Copy, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { Card, EmptyState, Input } from "@/components/ui/ds";

export const Route = createFileRoute("/_app/clone")({
  head: () => ({ meta: [{ title: "Clonar Discord — Em breve — Neighborshub" }] }),
  component: () => (
    <ComingSoon
      name="Clonar Discord"
      icon={Copy}
      eyebrow="clone --soon"
      description="Clonar Discord está em desenvolvimento e estará disponível em breve."
    />
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars


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
      <div className="mx-auto max-w-2xl">
        <EmptyState title="Token não configurado" description="Configure seu token na página de Login para carregar seus servidores." />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="discord --clone"
        icon={Copy}
        title="Clonar"
        highlight="Discord"
        description="Selecione um servidor para clonar canais, cargos e categorias."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar servidor…"
            className="pl-9"
          />
        </div>
        <span className="ds-small">
          {loading ? "carregando…" : `${filtered.length}/${guilds.length} servidores`}
        </span>
      </div>

      {!loading && guilds.length === 0 && (
        <EmptyState title="Nenhum servidor encontrado" />
      )}

      <div className="card-grid-sm">
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
              className="flex items-center gap-3 rounded-lg border border-[var(--border-1)] bg-[var(--surface-1)] p-2.5 transition hover:border-[var(--border-2)]"
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
                  className="h-10 w-10 shrink-0 rounded-md border border-[var(--border-1)] object-cover"
                />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border-1)] bg-[var(--elevated)] text-[11px] font-semibold text-[var(--accent-soft)]">
                  {initials || "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-[var(--text-1)]">{g.name}</div>
                <div className="ds-small">
                  {g.owner ? "owner" : "membro"}
                </div>
              </div>
              <button
                onClick={() => toast.info("Clonagem em breve 🚀")}
                className="grid h-8 w-8 place-items-center rounded-md border border-[color-mix(in_oklab,var(--accent-1)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-1)_10%,transparent)] text-[var(--accent-soft)] hover:bg-[color-mix(in_oklab,var(--accent-1)_18%,transparent)]"
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
