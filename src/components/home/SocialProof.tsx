import React, { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
import { useInView, useCountUp } from "./hooks";
import { Product } from "./constants";

const STATS_CACHE_KEY = "nghc:home-stats:v3";
const STATS_TTL_MS = 60_000;

type StatsSnapshot = { latency: number; members: number; products: number; ts: number };

interface SocialProofProps {
  widgetUrl: string;
  products: Product[];
}

const DEFAULT_STATS: StatsSnapshot = {
  latency: 0.42,
  members: 100,
  products: 0,
  ts: 0,
};

function clampLatency(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0.1;
  const scaled = ms / 100;
  return Math.min(0.89, Math.max(0.05, Math.round(scaled * 100) / 100));
}

function readCache(): StatsSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StatsSnapshot;
    return typeof parsed?.latency === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(snap: StatsSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(snap));
  } catch {
    /* ignore */
  }
}

async function fetchLiveStats(url: string, signal: AbortSignal): Promise<Partial<StatsSnapshot>> {
  const samples: number[] = [];
  let members: number | undefined;
  for (let i = 0; i < 3; i++) {
    const t0 = performance.now();
    const r = await fetch(url, { signal, cache: "no-store" });
    samples.push(performance.now() - t0);
    if (i === 0 && r.ok) {
      try {
        const j = (await r.clone().json()) as { presence_count?: number };
        if (typeof j.presence_count === "number" && j.presence_count > 0) {
          members = Math.max(100, j.presence_count);
        }
      } catch {
        /* ignore */
      }
    }
  }
  samples.sort((a, b) => a - b);
  return { latency: clampLatency(samples[1]), members, ts: Date.now() };
}

export function SocialProof({ widgetUrl, products: productsList }: SocialProofProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [stats, setStats] = useState<StatsSnapshot>(() => {
    const cached = readCache();
    return cached ? { ...cached, products: productsList.length } : { ...DEFAULT_STATS, products: productsList.length };
  });
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      if (inFlight.current) return;
      const ctrl = new AbortController();
      inFlight.current = ctrl;
      try {
        const next = await fetchLiveStats(widgetUrl, ctrl.signal);
        if (!mounted) return;
        setStats((prev) => {
          const merged: StatsSnapshot = {
            latency: next.latency ?? prev.latency,
            members: next.members ?? prev.members,
            products: productsList.length,
            ts: next.ts ?? Date.now(),
          };
          writeCache(merged);
          return merged;
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error("Failed to fetch live stats:", err);
      } finally {
        if (inFlight.current === ctrl) inFlight.current = null;
      }
    };

    // Só inicia o polling se estiver visível ou após o mount
    refresh();
    const iv = window.setInterval(refresh, STATS_TTL_MS);
    
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    
    return () => {
      mounted = false;
      window.clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      if (inFlight.current) {
        inFlight.current.abort();
        inFlight.current = null;
      }
    };
  }, [widgetUrl, productsList.length]);

  const membersCount = useCountUp(stats.members, inView);
  const productsCount = useCountUp(stats.products, inView);
  const latencyCount = useCountUp(stats.latency, inView);

  return (
    <section className="border-y border-white/[0.08] bg-[#030303] relative z-10">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 text-[11px] font-black text-[#555] uppercase tracking-[0.25em]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-10 sm:gap-16 lg:gap-24 w-full md:w-auto">
             <div className="flex items-center gap-4 group">
               <span className="text-white text-3xl lg:text-4xl font-display font-[900] tracking-tighter shrink-0 transition-transform group-hover:scale-110 duration-500">{Math.round(membersCount)}+</span>
               <span className="leading-tight border-l border-white/10 pl-4 py-1">MEMBROS<br />ATIVOS</span>
             </div>
             <div className="flex items-center gap-4 group">
               <span className="text-white text-3xl lg:text-4xl font-display font-[900] tracking-tighter shrink-0 transition-transform group-hover:scale-110 duration-500">{Math.round(productsCount)}</span>
               <span className="leading-tight border-l border-white/10 pl-4 py-1">SISTEMAS<br />PROPRIETÁRIOS</span>
             </div>
             <div className="flex items-center gap-4 group">
               <span className="text-white text-3xl lg:text-4xl font-display font-[900] tracking-tighter shrink-0 transition-transform group-hover:scale-110 duration-500">{latencyCount.toFixed(2)}<span className="text-[#ff0055]">ms</span></span>
               <span className="leading-tight border-l border-white/10 pl-4 py-1">TEMPO DE<br />EXECUÇÃO</span>
             </div>
          </div>
          <div className="hidden xl:block whitespace-nowrap opacity-30 font-mono text-[9px] tracking-[0.4em]">
            SYSTEM_STATUS: OPTIMIZED // LATENCY: NOMINAL
          </div>
        </div>
      </div>
    </section>
  );
}
