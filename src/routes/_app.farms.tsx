import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { PLAN_LIMITS, getGateStatus } from "@/lib/quest-runner";
import { Card, StatCard, EmptyState as DSEmptyState } from "@/components/ui/ds";
import {
  Tractor,
  Activity,
  Clock,
  Timer,
  CheckCircle2,
  Coins,
  CalendarDays,
  Terminal,
} from "lucide-react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/farms")({
  head: () => ({ meta: [{ title: "Farms — SPECTRE" }] }),
  component: FarmsPage,
});

function parseOrbs(reward: string | null): number {
  if (!reward) return 0;
  const m = reward.match(/(\d+)\s*Orbs?/i);
  return m ? Number(m[1]) : 0;
}

function fmtDuration(ms: number) {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

function FarmsPage() {
  const creds = useQuestStore((s) => s.creds);
  const runs = useQuestStore((s) => s.runs);
  const logs = useQuestStore((s) => s.logs);
  const plan = useQuestStore((s) => s.plan);
  const running = useQuestStore((s) => s.running);
  const activeQuestId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const lastCompletedAt = useQuestStore((s) => s.lastCompletedAt);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const t = startOfDay.getTime();

    let totalOrbs = 0;
    let todayOrbs = 0;
    let todayDone = 0;
    let done = 0;
    let failed = 0;
    let skipped = 0;

    for (const r of runs) {
      const orbs = parseOrbs(r.reward_text);
      const ts = new Date(r.started_at).getTime();
      if (r.status === "completed") {
        done++;
        totalOrbs += orbs;
        if (ts >= t) {
          todayDone++;
          todayOrbs += orbs;
        }
      } else if (r.status === "failed") failed++;
      else if (r.status === "skipped") skipped++;
    }

    return { totalOrbs, todayOrbs, todayDone, done, failed, skipped };
  }, [runs]);

  const gate = getGateStatus();
  const limits = PLAN_LIMITS[plan];
  const remainingCd = Math.max(0, lastCompletedAt + limits.cooldownMs - now);

  const activeStart = useMemo(() => {
    if (!running) return null;
    const active = runs.find((r) => r.quest_id === activeQuestId);
    return active ? new Date(active.started_at).getTime() : now;
  }, [running, activeQuestId, runs, now]);
  
  const activeMs = running && activeStart ? now - activeStart : 0;

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Sistemas Offline</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">As ferramentas de farm automatizada requerem uma autorização ativa do terminal.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="farms --monitor"
        icon={Tractor}
        title="Operação de"
        highlight="Farm"
        description="Monitoramento em tempo real das automações e colheita de orbs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
        <StatItem icon={Activity} label="SYS_STATUS" value={running ? "OPERATING" : "STANDBY"} sub={running ? "EXECUTING_NODE" : "IDLE_STATE"} active={running} />
        <StatItem icon={Clock} label="UPTIME_CLOCK" value={running ? fmtDuration(activeMs) : "00:00"} sub="RUN_DURATION" />
        <StatItem icon={Timer} label="COOLDOWN_VAL" value={remainingCd > 0 ? fmtDuration(remainingCd) : "READY"} sub={limits.label} active={remainingCd > 0} />
        <StatItem icon={CheckCircle2} label="COMPLETED_NODES" value={String(stats.todayDone)} sub={`LIMIT: ${limits.daily === Infinity ? 'INF' : limits.daily}`} />
      </div>

      {running && progress && (
        <div className="bg-[#030303] border border-primary/20 p-10 space-y-6 mt-12">
            <div className="flex justify-between items-end">
                <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-primary">MISSION_PHASE_PROGRESS</div>
                <div className="font-display text-2xl text-white tracking-tighter">{progress.current} / {progress.total}</div>
            </div>
            <div className="h-0.5 bg-white/5 relative overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_#4DA09E]" 
                  style={{ width: `${Math.min(100, (progress.current / Math.max(1, progress.total)) * 100)}%` }} 
                />
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-8">
        <div className="space-y-8">
            <div className="bg-[#030303] border border-white/5 p-10 space-y-10">
                <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">HARVEST_PERFORMANCE_METRICS</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    <div className="space-y-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/10">TOTAL_ORBS</div>
                        <div className="font-display text-3xl text-white tracking-tighter">{stats.totalOrbs.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/10">DAILY_YIELD</div>
                        <div className="font-display text-3xl text-primary tracking-tighter">{stats.todayOrbs.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/10">SUCCESS_RATE</div>
                        <div className="font-display text-3xl text-white tracking-tighter">{runs.length ? `${Math.round((stats.done / runs.length) * 100)}%` : '0%'}</div>
                    </div>
                </div>
            </div>

            <div className="bg-[#030303] border border-white/5 p-10 space-y-8">
                <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">EVENT_TERMINAL_STDOUT</div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-6 custom-scrollbar">
                    {logs.length === 0 ? (
                        <p className="font-mono text-[9px] text-white/10 uppercase tracking-[0.3em]">WAITING_FOR_SIGNAL...</p>
                    ) : (
                        logs.slice().reverse().map(l => (
                            <div key={l.id} className="font-mono text-[9px] py-2 border-b border-white/5 flex gap-4 uppercase tracking-[0.1em]">
                                <span className="text-white/10 shrink-0">[{new Date(l.ts).toLocaleTimeString()}]</span>
                                <span className={l.level === 'error' ? 'text-rose-500' : l.level === 'success' ? 'text-primary' : 'text-white/40'}>
                                    {l.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <aside className="space-y-6">
            <div className="bg-[#030303] border border-white/5 p-8 space-y-8">
                <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">INFRASTRUCTURE_DATA</div>
                <div className="space-y-6">
                    <InfraItem label="ACTIVE_PLAN" val={limits.label} />
                    <InfraItem label="INTERVAL_VAL" val={`${limits.cooldownMs / 60000}M`} />
                    <InfraItem label="DAILY_CEILING" val={limits.daily === Infinity ? 'UNCAPPED' : String(limits.daily)} />
                    <InfraItem label="API_ENDPOINT" val="ONLINE" color="text-emerald-500" />
                </div>
            </div>

            <div className="bg-[#030303] border border-white/5 p-8 space-y-8">
                <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">GLOBAL_TELEMETRY</div>
                <div className="space-y-4">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em]">
                        <span className="text-white/20">SUCCESS_NODES</span>
                        <span className="text-white">{stats.done}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em]">
                        <span className="text-white/20">FAILED_CRITICAL</span>
                        <span className="text-rose-500">{stats.failed}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em]">
                        <span className="text-white/20">SKIPPED_IDLE</span>
                        <span className="text-amber-500">{stats.skipped}</span>
                    </div>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, sub, active }: any) {
  return (
    <div className={`p-8 bg-[#030303] border border-white/5 space-y-4 transition-all duration-500 hover:border-primary/40 group ${active ? 'border-primary/20' : ''}`}>
        <div className="flex items-center gap-3">
            <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-white/10'}`} />
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">{label}</span>
        </div>
        <div className="font-display text-2xl text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{value}</div>
        <div className="font-mono text-[7px] text-white/10 uppercase tracking-[0.3em]">{sub}</div>
    </div>
  )
}

function InfraItem({ label, val, color = "text-white" }: any) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="font-display text-[9px] uppercase tracking-widest text-white/20">{label}</span>
            <span className={`font-mono text-[10px] uppercase tracking-wider ${color}`}>{val}</span>
        </div>
    )
}
