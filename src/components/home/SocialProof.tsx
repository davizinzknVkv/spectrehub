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
  const [stats, setStats] = useState<StatsSnapshot>({ ...DEFAULT_STATS, products: productsList.length });
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    const snap = readCache();
    if (snap) {
      setStats({ ...snap, products: productsList.length });
    }
  }, [productsList.length]);

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
      } catch {
        /* keep cache */
      } finally {
        if (inFlight.current === ctrl) inFlight.current = null;
      }
    };
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
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [widgetUrl, productsList.length]);

  const membersCount = useCountUp(stats.members, inView);
  const productsCount = useCountUp(stats.products, inView);
  const latencyCount = useCountUp(stats.latency, inView);

  return (
    <section className="border-y border-white/[0.06] bg-black/40 backdrop-blur-sm">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 text-[10px] font-bold text-[#8a8a8a] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{Math.round(membersCount)}+</span>
               <span>MEMBROS NA COMUNIDADE</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{Math.round(productsCount)}</span>
               <span>PRODUTOS DISPONÍVEIS</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{latencyCount.toFixed(2)}<span className="text-[#ff0055]">ms</span></span>
               <span>IMPACTO NO DISCORD</span>
             </div>
          </div>
          <div className="hidden lg:block">
            PROPERTY OF SPECTRE. ALL CREATIVE RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </section>
  );
}
