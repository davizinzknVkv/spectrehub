import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { fetchOrbs, purchaseWithOrbs } from "@/lib/quest-runner";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-catalog";
import { getShopImage, getCachedShopImage } from "@/lib/shop-images";
import { Gift, Coins, Search, Loader2, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button, Modal, EmptyState as DSEmptyState } from "@/components/ui/ds";

export const Route = createFileRoute("/_app/resgatar")({
  head: () => ({ meta: [{ title: "Shop — Spectre Hub" }] }),
  component: RedeemPage,
});

const PAGE_SIZE = 24;

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

  const confirmPurchase = async () => {
    const it = confirmItem;
    if (!it || !creds) return;
    setBusySku(it.skuId);
    setConfirmItem(null);
    try {
      const r = await purchaseWithOrbs(it.skuId);
      if (r.ok) {
        await loadOrbs();
      }
    } finally {
      setBusySku(null);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="shop --inventory"
        icon={ShoppingBag}
        title="Mercado de"
        highlight="Orbs"
        description="Troque seus orbs acumulados por cosméticos e itens exclusivos no Discord."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-spectre-pink transition-colors" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="PESQUISAR ITEM NO CATÁLOGO..."
              className="w-full bg-white/[0.02] border border-white/5 py-4 pl-12 pr-4 font-display text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-spectre-pink/30 transition-all italic"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5">
                <Search className="w-8 h-8 mx-auto text-white/10 mb-4" />
                <p className="font-display text-[10px] uppercase tracking-widest text-white/20 italic">Nenhum item encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {pageItems.map((it) => (
                <button
                  key={it.skuId}
                  onClick={() => creds && setConfirmItem(it)}
                  disabled={!creds || busySku === it.skuId}
                  className="ds-card ds-card-interactive !p-0 overflow-hidden flex flex-col group text-left border-white/5 bg-white/[0.02]"
                >
                  <div className="aspect-square relative bg-obsidian flex items-center justify-center p-4">
                     <OrbImage sku={it.skuId} name={it.name} />
                     {busySku === it.skuId && (
                       <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-spectre-pink" />
                       </div>
                     )}
                  </div>
                  <div className="p-4 border-t border-white/5 space-y-1">
                     <div className="font-display text-[9px] text-white uppercase italic truncate tracking-widest">{it.name}</div>
                     <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">#{it.skuId.slice(-6)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {totalPages > 1 && (
             <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={curPage === 1}
                  className="ds-btn ds-btn-secondary !py-2 !px-4 !text-[8px]"
                >Anterior</button>
                <span className="font-display text-[10px] text-white/20 uppercase tracking-[0.3em] italic">{curPage} / {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={curPage === totalPages}
                  className="ds-btn ds-btn-secondary !py-2 !px-4 !text-[8px]"
                >Próxima</button>
             </div>
          )}
        </div>

        <aside className="space-y-6">
           <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
              <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Saldo Terminal</div>
              <div className="flex items-baseline gap-2">
                 <span className="font-display text-4xl text-white italic">{orbs !== null ? orbs.toLocaleString() : '---'}</span>
                 <span className="font-display text-[9px] text-spectre-pink uppercase tracking-widest italic font-bold">Orbs</span>
              </div>
              <button 
                onClick={loadOrbs} 
                disabled={loadingOrbs || !creds}
                className="w-full ds-btn ds-btn-secondary !py-2 !text-[9px]"
              >
                {loadingOrbs ? 'Sincronizando...' : 'Sincronizar'}
              </button>
           </div>

           <div className="ds-card p-6 border-spectre-pink/20 bg-spectre-pink/5 space-y-3">
              <div className="flex items-center gap-2 text-spectre-pink">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="font-display text-[9px] uppercase tracking-widest italic font-bold">Segurança Shop</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed font-sans">Todas as transações são processadas via API oficial do Discord. O Spectre Hub apenas facilita a interface de resgate.</p>
           </div>
        </aside>
      </div>

      {confirmItem && (
        <Modal
          title="Confirmar Resgate"
          onClose={() => setConfirmItem(null)}
          actions={
            <div className="flex gap-4 w-full">
               <button className="ds-btn ds-btn-secondary flex-1" onClick={() => setConfirmItem(null)}>Cancelar</button>
               <button className="ds-btn ds-btn-primary flex-1" onClick={confirmPurchase}>Resgatar</button>
            </div>
          }
        >
          <div className="space-y-6">
             <div className="aspect-[21/9] bg-white/[0.02] border border-white/5 flex items-center justify-center p-4">
                <OrbImage sku={confirmItem.skuId} name={confirmItem.name} />
             </div>
             <div className="space-y-2">
                <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Item</div>
                <div className="font-display text-lg text-white uppercase italic tracking-tighter">{confirmItem.name}</div>
             </div>
             <p className="text-[11px] text-white/40 font-sans leading-relaxed">O item será adicionado instantaneamente ao seu inventário do Discord após a confirmação. Esta ação não pode ser desfeita.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrbImage({ sku, name }: { sku: string; name: string }) {
  const [url, setUrl] = useState<string | null | undefined>(() => getCachedShopImage(sku));
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  useEffect(() => {
    if (!visible || url !== undefined) return;
    getShopImage(sku).then(setUrl);
  }, [visible, sku, url]);

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      {url ? (
        <img src={url} alt={name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
      ) : (
        <span className="font-display text-4xl text-white/10 uppercase italic">{initialsOf(name)}</span>
      )}
    </div>
  );
}
