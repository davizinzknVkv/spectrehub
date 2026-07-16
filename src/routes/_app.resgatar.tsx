import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { fetchOrbs, purchaseWithOrbs } from "@/lib/quest-runner";
import { Gift, Coins, ExternalLink, Sparkles, Palette, Crown, Ticket, Loader2, X, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/resgatar")({
  head: () => ({ meta: [{ title: "Resgatar Orbs — Neighborshub" }] }),
  component: RedeemPage,
});

type Item = {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "cyan" | "purple" | "amber" | "mint";
  url: string;
  skuId?: string;
};

const ITEMS: Item[] = [
  {
    id: "nitro-3d",
    name: "Crédito Nitro (3 dias)",
    desc: "Compra oficial via loja de Orbs do Discord.",
    price: 1400,
    icon: Crown,
    tone: "purple",
    url: "https://discord.com/shop?tab=orbs",
    skuId: "1298745361602449479",
  },
  {
    id: "deco-avatar",
    name: "Decoração de Avatar",
    desc: "Frames animados para o seu avatar do Discord.",
    price: 1500,
    icon: Sparkles,
    tone: "cyan",
    url: "https://discord.com/shop?tab=orbs",
  },
  {
    id: "profile-effect",
    name: "Efeito de Perfil",
    desc: "Animação de fundo no seu perfil.",
    price: 1200,
    icon: Palette,
    tone: "mint",
    url: "https://discord.com/shop?tab=orbs",
  },
  {
    id: "boost-ticket",
    name: "Ticket de Boost",
    desc: "Cupom para boost de servidor (quando ofertado).",
    price: 800,
    icon: Ticket,
    tone: "amber",
    url: "https://discord.com/shop?tab=orbs",
  },
];

function RedeemPage() {
  const creds = useQuestStore((s) => s.creds);
  const [orbs, setOrbs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [confirmItem, setConfirmItem] = useState<Item | null>(null);

  const loadOrbs = async () => {
    if (!creds) return;
    setLoading(true);
    try {
      const b = await fetchOrbs();
      setOrbs(b);
    } finally {
      setLoading(false);
    }
  };

  const confirmPurchase = async () => {
    const it = confirmItem;
    if (!it || !it.skuId || !creds) return;
    setBusyId(it.id);
    setMsg(null);
    setConfirmItem(null);
    try {
      const r = await purchaseWithOrbs(it.skuId);
      if (r.ok) {
        setMsg({ tone: "ok", text: `✅ Compra concluída: ${it.name}` });
        await loadOrbs();
      } else {
        setMsg({ tone: "err", text: `❌ ${r.message}` });
      }
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    loadOrbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creds]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
          $ shop --redeem
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          <Gift className="h-6 w-6 text-cyan" />
          Resgatar Orbs
        </h1>
        <p className="mt-1 text-sm text-ink-dim">
          Troque as Orbs acumuladas por itens da loja oficial do Discord.
        </p>
      </header>

      {/* Balance */}
      <section
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber/30 bg-gradient-to-br from-amber/15 to-transparent p-5"
      >
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
          disabled={!creds || loading}
          className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-cyan/50 hover:text-cyan disabled:opacity-40"
        >
          {loading ? "atualizando..." : "atualizar"}
        </button>
      </section>

      {!creds && (
        <div className="rounded-xl border border-amber/40 bg-amber/5 p-4 text-sm text-amber">
          Faça login em <span className="font-mono">/settings</span> para ver seu saldo e resgatar.
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

      {/* Items */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const canAfford = orbs !== null && orbs >= it.price;
          const toneBorder =
            it.tone === "cyan"
              ? "border-cyan/30 hover:border-cyan/60"
              : it.tone === "purple"
                ? "border-purple/30 hover:border-purple/60"
                : it.tone === "amber"
                  ? "border-amber/30 hover:border-amber/60"
                  : "border-mint/30 hover:border-mint/60";
          const toneText =
            it.tone === "cyan"
              ? "text-cyan"
              : it.tone === "purple"
                ? "text-purple"
                : it.tone === "amber"
                  ? "text-amber"
                  : "text-mint";
          return (
            <div
              key={it.id}
              className={`group rounded-xl border ${toneBorder} bg-surface/60 p-5 transition-all`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${toneBorder} bg-background/40 ${toneText}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink">{it.name}</h3>
                    <span className={`shrink-0 font-mono text-xs ${toneText}`}>
                      {it.price.toLocaleString("pt-BR")} Orbs
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-dim">{it.desc}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  {orbs === null
                    ? "conecte para ver"
                    : canAfford
                      ? "disponível"
                      : `faltam ${(it.price - (orbs ?? 0)).toLocaleString("pt-BR")}`}
                </span>
                {it.skuId ? (
                  <button
                    onClick={() => setConfirmItem(it)}
                    disabled={!creds || !canAfford || busyId === it.id}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      canAfford
                        ? "border-mint/50 bg-mint/10 text-mint hover:bg-mint/20"
                        : "border-line text-ink-dim"
                    }`}
                  >
                    {busyId === it.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> comprando...
                      </>
                    ) : (
                      <>comprar c/ orbs</>
                    )}
                  </button>
                ) : (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-purple/40 hover:text-purple"
                  >
                    ver na loja <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        › o resgate acontece na loja oficial do discord
      </p>
    </div>
  );
}
