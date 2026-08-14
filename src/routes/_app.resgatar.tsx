import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { fetchOrbs, purchaseWithOrbs } from "@/lib/quest-runner";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-catalog";
import { getShopImage, getCachedShopImage } from "@/lib/shop-images";
import { Gift, Coins, Search, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button, Card, Modal, EmptyState as DSEmptyState } from "@/components/ui/ds";

export const Route = createFileRoute("/_app/resgatar")({
  head: () => ({ meta: [{ title: "Resgatar Orbs — Spectre Hub" }] }),
  component: RedeemPage,
});

const PAGE_SIZE = 48;

// paleta determinística p/ tile de imagem improvisada
const PALETTES: [string, string][] = [
  ["#7dd3fc", "#0369a1"], ["#f0abfc", "#7e22ce"], ["#fda4af", "#9f1239"],
  ["#fcd34d", "#b45309"], ["#86efac", "#166534"], ["#c4b5fd", "#3730a3"],
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
    <div className="page-stack">
      <PageHeader
        eyebrow="shop --redeem"
        icon={Gift}
        title="Resgatar"
        highlight="Orbs"
        description={`Catálogo com ${SHOP_ITEMS.length} itens da loja oficial. Compra direto via API do Discord.`}
      />

      {/* Saldo */}
      <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="ds-label">
            <Coins className="h-3.5 w-3.5" />
            saldo atual
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tabular-nums text-[var(--primary)]">
              {creds ? (orbs ?? "—").toLocaleString("pt-BR") : "—"}
            </span>
            <span className="ds-small">Orbs</span>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={loadOrbs} disabled={!creds || loadingOrbs}>
          {loadingOrbs ? "atualizando..." : "atualizar"}
        </Button>
      </Card>

      {!creds && (
        <div className="ds-card border-[color-mix(in_oklab,var(--warn)_34%,transparent)] ds-body">
          Faça login em <span className="font-mono">/settings</span> para comprar.
        </div>
      )}

      {msg && (
        <div
          className={`ds-card ds-body ${
            msg.tone === "ok"
              ? "border-[color-mix(in_oklab,var(--ok)_34%,transparent)] text-[var(--ok)]"
              : "border-[color-mix(in_oklab,var(--danger)_34%,transparent)] text-[var(--danger)]"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou SKU..."
          className="ds-input pl-9"
        />
        <div className="mt-2 flex items-center justify-between ds-small">
          <span>{filtered.length.toLocaleString("pt-BR")} itens</span>
          <span>página {curPage}/{totalPages}</span>
        </div>
      </div>

      {/* Grid */}
      {creds && loadingOrbs && pageItems.length === 0 ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="ds-card aspect-[4/5] animate-pulse !p-0" />
          ))}
        </section>
      ) : filtered.length === 0 ? (
        <DSEmptyState
          icon={Search}
          title="Nenhum item encontrado"
          description={q ? `Não encontramos nada para "${q}". Tente outro termo.` : "O catálogo está vazio no momento."}
          action={q ? <Button variant="secondary" onClick={() => setQ("")}>Limpar busca</Button> : null}
        />
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {pageItems.map((it) => {
          const busy = busySku === it.skuId;
          return (
            <button
              key={it.skuId}
              onClick={() => creds && setConfirmItem(it)}
              disabled={!creds || busy}
              className="ds-card ds-card-interactive group flex flex-col overflow-hidden !p-0 text-left disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div
                className="relative aspect-square w-full"
                style={{ background: tileFor(it.skuId) }}
              >
                <OrbImage sku={it.skuId} name={it.name} />
                <Sparkles className="absolute right-1.5 top-1.5 h-3 w-3 text-white/60" />
                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-[var(--bg)]/70">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
                  </div>
                )}
              </div>

              <div className="flex-1 p-2.5">
                <div className="line-clamp-2 text-xs font-medium text-[var(--text-1)]" title={it.name}>
                  {it.name}
                </div>
                <div className="mt-1 font-mono text-[9px] text-[var(--text-3)] truncate">
                  #{it.skuId.slice(-6)}
                </div>
              </div>
            </button>
          );
        })}
        </section>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={curPage === 1}
          >
            ← anterior
          </Button>
          <span className="ds-small">
            {curPage} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={curPage === totalPages}
          >
            próxima →
          </Button>
        </div>
      )}

      {/* Modal confirmação */}
      {confirmItem && (
        <Modal
          title={confirmItem.name}
          onClose={() => setConfirmItem(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirmItem(null)}>
                cancelar
              </Button>
              <Button variant="primary" onClick={confirmPurchase}>
                confirmar compra
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <div
              className="relative -mx-5 -mt-4 mb-1 aspect-[3/1] w-[calc(100%+2.5rem)] sm:-mx-6"
              style={{ background: tileFor(confirmItem.skuId) }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-5xl font-bold text-white/90 drop-shadow-lg">
                  {initialsOf(confirmItem.name)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="ds-small">SKU</span>
              <span className="font-mono text-xs text-[var(--text-1)]">{confirmItem.skuId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="ds-small">Saldo atual</span>
              <span className="font-mono tabular-nums text-[var(--text-1)]">
                {(orbs ?? 0).toLocaleString("pt-BR")} Orbs
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-[var(--border-1)] bg-white/[0.03] p-3 ds-small">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ok)]" />
              <span>
                A transação é validada em tempo real pela infraestrutura do Discord. Caso o saldo seja insuficiente ou o item esteja indisponível, a operação será abortada sem custos.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Lazy-loads the shop item image when the tile scrolls into view.
// Falls back to initials on top of the gradient tile.
function OrbImage({ sku, name }: { sku: string; name: string }) {
  const [url, setUrl] = useState<string | null | undefined>(() => getCachedShopImage(sku));
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url !== undefined) return; // already known (hit or miss)
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setVisible(true); io.disconnect(); }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  useEffect(() => {
    if (!visible || url !== undefined) return;
    let cancel = false;
    getShopImage(sku).then((u) => { if (!cancel) setUrl(u); });
    return () => { cancel = true; };
  }, [visible, sku, url]);

  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      {url ? (
        <img
          src={url}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain p-2 drop-shadow-md"
          onError={() => setUrl(null)}
        />
      ) : (
        <span className="font-mono text-2xl font-bold text-white/90 drop-shadow-md">
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}
