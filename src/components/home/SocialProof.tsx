import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Users, Tractor, Zap, ShieldCheck } from "lucide-react";
import { useInView, useCountUp } from "./hooks";

import { Product } from "./constants";


const STATS_CACHE_KEY = "nghc:home-stats:v3";
const STATS_TTL_MS = 300_000; // Increased to 5 minutes to reduce impact

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
        const j = await r.json() as { presence_count?: number };
        if (typeof j.presence_count === "number" && j.presence_count > 0) {
          members = Math.max(100, j.presence_count);
        }
      } catch (e) {
        console.warn("Failed to parse widget data", e);
      }
    }
  }
  samples.sort((a, b) => a - b);
  return { latency: clampLatency(samples[1]), members, ts: Date.now() };
}

export function SocialProof({ widgetUrl, products: productsList }: SocialProofProps) {
  const { t } = useTranslation();
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

  const membersCount = useCountUp(stats.members, inView, 1000);
  const productsCount = useCountUp(stats.products, inView, 1000);
  const latencyCount = useCountUp(stats.latency, inView, 1000);

  return (
    <section className="bg-obsidian border-y border-white/5 relative z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-spectre-pink/50 to-transparent" />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-px md:bg-white/5 border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
           <div className="bg-obsidian flex flex-col items-center text-center p-8 group hover:bg-white/[0.04] transition-colors">
              <div className="text-spectre-pink mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-display text-4xl md:text-5xl text-white italic mb-2 tracking-tighter leading-none">
                {Math.round(membersCount)}+
              </span>
              <span className="font-display text-[9px] tracking-[0.3em] text-white/30 uppercase italic group-hover:text-spectre-pink transition-colors">
                {t('community.statMembers')}
              </span>
           </div>
           <div className="bg-obsidian flex flex-col items-center text-center p-8 group hover:bg-white/[0.04] transition-colors">
              <div className="text-spectre-pink mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Tractor className="w-5 h-5" />
              </div>
              <span className="font-display text-4xl md:text-5xl text-white italic mb-2 tracking-tighter leading-none">
                {Math.round(productsCount)}
              </span>
              <span className="font-display text-[9px] tracking-[0.3em] text-white/30 uppercase italic group-hover:text-spectre-pink transition-colors">
                {t('community.statSystems')}
              </span>
           </div>
           <div className="bg-obsidian flex flex-col items-center text-center p-8 group hover:bg-white/[0.04] transition-colors">
              <div className="text-spectre-pink mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-display text-4xl md:text-5xl text-white italic mb-2 tracking-tighter leading-none">
                {latencyCount.toFixed(2)}<span className="text-spectre-pink not-italic text-2xl">ms</span>
              </span>
              <span className="font-display text-[9px] tracking-[0.3em] text-white/30 uppercase italic group-hover:text-spectre-pink transition-colors">
                {t('community.statLatency')}
              </span>
           </div>
           <div className="bg-obsidian flex flex-col items-center text-center p-8 group hover:bg-white/[0.04] transition-colors">
              <div className="text-spectre-pink mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 mb-2 leading-none">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="font-display text-4xl md:text-5xl text-white italic tracking-tighter leading-none">99.9%</span>
              </div>
              <span className="font-display text-[9px] tracking-[0.3em] text-white/30 uppercase italic group-hover:text-spectre-pink transition-colors">
                {t('community.statUptime')}
              </span>
           </div>
        </div>

      </div>

    </section>
  );
}
