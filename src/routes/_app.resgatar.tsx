import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { fetchOrbs, purchaseWithOrbs } from "@/lib/quest-runner";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-catalog";
import { Gift, Coins, Search, Loader2, X, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/resgatar")({
  head: () => ({ meta: [{ title: "Resgatar Orbs — Neighborshub" }] }),
  component: RedeemPage,
});

const PAGE_SIZE = 48;

// paleta determinística p/ tile de imagem improvisada
const PALETTES: [string, string][] = [
  ["#7dd3fc", "#0369a1"], ["#f0abfc", "#7e22ce"], ["#fda4af", "#9f1239"],
  ["#fcd34d", "#b45309"], ["#86efac", "#166534"], ["#a5b4fc", "#3730a3"],
  ["#fbcfe8", "#be185d"], ["#5eead4", "#115e59"], ["#fca5a5", "#991b1b"],
  ["#c4b5fd", "#5b21b6"], ["#fdba74", "#9a3412"], ["#bef264", "#3f6212"],
];
function hashSku(sku: string) {
  let h = 0;
  for (let i = 0; i < sku.length; i++) h = (h * 31 + sku.charCodeAt(i)) >>> 0;
  return h;
}
function tileFor(sku: string) {
  const h = hashSku(sku);
  const [a, b] = PALETTES[h % PALETTES.length];
  const angle = h % 360;
  return `linear-gradient(${angle}deg, ${a}, ${b})`;
}
function initialsOf(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function RedeemPage() {
  const creds = useQuestStore((s) => s.creds);
  const [orbs, setOrbs] = useState<number | null>(null);
  const [loadingOrbs, setLoadingOrbs] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
  const [busySku, setBusySku] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const loadOrbs = async () => {
    if (!creds) return;
    setLoadingOrbs(true);
    try {
      const b = await fetchOrbs();
      setOrbs(b);
    } finally {
      setLoadingOrbs(false);
    }
  };

  useEffect(() => {
    loadOrbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creds]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SHOP_ITEMS;
    return SHOP_ITEMS.filter(
      (i) => i.name.toLowerCase().includes(term) || i.skuId.includes(term),
    );
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const confirmPurchase = async () => {
    const it = confirmItem;
    if (!it || !creds) return;
    setBusySku(it.skuId);
    setMsg(null);
    setConfirmItem(null);
    try {
      const r = await purchaseWithOrbs(it.skuId);
      if (r.ok) {
        setMsg({ tone: "ok", text: `✅ Compra concluída: ${it.name}` });
        await loadOrbs();
      } else {
        setMsg({ tone: "err", text: `❌ ${it.name}: ${r.message}` });
      }
    } finally {
      setBusySku(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="shop --redeem"
        icon={Gift}
        title="Resgatar"
        highlight="Orbs"
        description={`Catálogo com ${SHOP_ITEMS.length} itens da loja oficial. Compra direto via API do Discord.`}
      />


      {/* Saldo */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber/30 bg-gradient-to-br from-amber/15 to-transparent p-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber">
            <Coins className="h-4 w-4" />
            saldo atual
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-semibold tabular-nums text-ink">
              {creds ? (orbs ?? "—").toLocaleString("pt-BR") : "—"}
            </span>
            <span className="text-xs text-ink-dim">Orbs</span>
          </div>
        </div>
        <button
          onClick={loadOrbs}
          disabled={!creds || loadingOrbs}
          className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-cyan/50 hover:text-cyan disabled:opacity-40"
        >
          {loadingOrbs ? "atualizando..." : "atualizar"}
        </button>
      </section>

      {!creds && (
        <div className="rounded-xl border border-amber/40 bg-amber/5 p-4 text-sm text-amber">
          Faça login em <span className="font-mono">/settings</span> para comprar.
        </div>
      )}

      {msg && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            msg.tone === "ok"
              ? "border-mint/40 bg-mint/5 text-mint"
              : "border-red-500/40 bg-red-500/5 text-red-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou SKU..."
          className="w-full rounded-lg border border-line bg-surface/60 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-mute focus:border-cyan/50 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          <span>{filtered.length.toLocaleString("pt-BR")} itens</span>
          <span>página {curPage}/{totalPages}</span>
        </div>
      </div>

      {/* Grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {pageItems.map((it) => {
          const busy = busySku === it.skuId;
          return (
            <button
              key={it.skuId}
              onClick={() => creds && setConfirmItem(it)}
              disabled={!creds || busy}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface/60 text-left transition-all hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-lg hover:shadow-cyan/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div
                className="relative aspect-square w-full"
                style={{ background: tileFor(it.skuId) }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-mono text-2xl font-bold text-white/90 drop-shadow-md">
                    {initialsOf(it.name)}
                  </span>
                </div>
                <Sparkles className="absolute right-1.5 top-1.5 h-3 w-3 text-white/60" />
                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-background/70">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-2.5">
                <div className="line-clamp-2 text-xs font-medium text-ink" title={it.name}>
                  {it.name}
                </div>
                <div className="mt-1 font-mono text-[9px] text-ink-mute truncate">
                  #{it.skuId.slice(-6)}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={curPage === 1}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-cyan/50 hover:text-cyan disabled:opacity-30"
          >
            ← anterior
          </button>
          <span className="font-mono text-xs text-ink-mute">
            {curPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={curPage === totalPages}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-cyan/50 hover:text-cyan disabled:opacity-30"
          >
            próxima →
          </button>
        </div>
      )}

      {/* Modal confirmação */}
      {confirmItem && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setConfirmItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setConfirmItem(null)}
              className="absolute right-3 top-3 z-10 rounded-md bg-background/50 p-1.5 text-ink-mute transition hover:bg-background/80 hover:text-ink"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="relative aspect-[2/1] w-full"
              style={{ background: tileFor(confirmItem.skuId) }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-5xl font-bold text-white/90 drop-shadow-lg">
                  {initialsOf(confirmItem.name)}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-line px-6 py-5">
              <h3 className="text-center text-lg font-semibold text-ink">{confirmItem.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-dim">SKU</span>
                <span className="font-mono text-xs text-ink">{confirmItem.skuId}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-dim">Saldo atual</span>
                <span className="font-mono tabular-nums text-ink">
                  {(orbs ?? 0).toLocaleString("pt-BR")} Orbs
                </span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-line bg-background/40 p-3 text-[11px] text-ink-dim">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                <span>
                  O preço em Orbs é validado pela API do Discord no momento da compra. Se o saldo
                  for insuficiente, a compra falha sem debitar.
                </span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-line bg-background/30 px-6 py-4">
              <button
                onClick={() => setConfirmItem(null)}
                className="flex-1 rounded-md border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-dim transition hover:border-ink-dim hover:text-ink"
              >
                cancelar
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 rounded-md border border-mint/50 bg-mint/15 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-mint transition hover:bg-mint/25"
              >
                confirmar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
