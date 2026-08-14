import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/ui/ds";
import { 
  Activity, 
  Cpu, 
  Database, 
  Gauge, 
  Thermometer, 
  Zap,
  LayoutGrid,
  History as HistoryIcon,
  ShieldCheck,
  Search,
  Settings,
  LineChart
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/optimizer")({
  component: OptimizerDashboard,
});

function OptimizerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-stack">
      <PageHeader
        title="SPECTRE OPTIMIZER"
        subtitle="Maximum Performance. Zero Compromise."
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: "overview", label: "Dashboard", icon: Activity },
          { id: "optimizations", label: "Otimizações", icon: Zap },
          { id: "monitor", label: "Live Monitor", icon: LineChart },
          { id: "game", label: "Game Boost", icon: Gauge },
          { id: "history", label: "Histórico", icon: HistoryIcon },
          { id: "settings", label: "Configurações", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id
                ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] neon-border"
                : "text-[#52525b] hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewSection />}
      {activeTab === "optimizations" && <div className="text-[#52525b] font-mono text-xs uppercase tracking-widest py-20 text-center">Optimizations module loading...</div>}
      {activeTab === "monitor" && <div className="text-[#52525b] font-mono text-xs uppercase tracking-widest py-20 text-center">Live monitor initializing...</div>}
      {activeTab === "game" && <div className="text-[#52525b] font-mono text-xs uppercase tracking-widest py-20 text-center">Game boost engine ready...</div>}
      {activeTab === "history" && <div className="text-[#52525b] font-mono text-xs uppercase tracking-widest py-20 text-center">History logs encrypted...</div>}
      {activeTab === "settings" && <div className="text-[#52525b] font-mono text-xs uppercase tracking-widest py-20 text-center">Settings configuration open...</div>}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard id="cpu" label="CPU Usage" value="42%" status="optimal" icon={Cpu} />
        <MetricCard id="ram" label="RAM Usage" value="6.4 GB" status="warning" icon={Database} />
        <MetricCard id="temp" label="CPU Temp" value="54°C" status="optimal" icon={Thermometer} />
        <MetricCard id="fps" label="Current FPS" value="144" status="optimal" icon={Gauge} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="lg:col-span-1 cyber-card p-6 border-[var(--neon-purple)]/20 shadow-[0_0_20px_-10px_var(--neon-purple-glow)]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#52525b]">Spectre Score</span>
            <ShieldCheck className="h-4 w-4 text-[var(--neon-purple)]" />
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="h-full w-full rotate-[-90deg]">
                <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="58" fill="none" 
                  stroke="var(--neon-purple)" strokeWidth="8" 
                  strokeDasharray="364.4" strokeDashoffset="47.3" 
                  strokeLinecap="square"
                  className="drop-shadow-[0_0_8px_var(--neon-purple-glow)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-black text-white">87</span>
                <span className="text-[9px] font-bold text-[#52525b] uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-center text-[11px] text-[#a1a1aa] leading-relaxed uppercase tracking-wider">
              Sistema operando em alto nível.<br/>
              <span className="text-[var(--neon-cyan)]">3 otimizações recomendadas.</span>
            </p>
          </div>
        </div>

        {/* Scan Actions */}
        <div className="lg:col-span-2 cyber-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-[var(--neon-cyan)]" />
              <h3 className="text-lg font-display font-bold uppercase tracking-tighter text-white">System Scan</h3>
            </div>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed max-w-md">
              Analise profundamente seu sistema em busca de gargalos, arquivos inúteis e configurações de rede abaixo do ideal.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Windows', 'Gaming', 'Network', 'Storage'].map(cat => (
              <div key={cat} className="p-3 bg-white/[0.02] border border-white/5 rounded-none text-center">
                <span className="block text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-1">{cat}</span>
                <span className="text-[11px] text-[#a1a1aa]">Verificado</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/90 text-black font-black py-4 text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
              Scan Now
            </button>
            <button className="flex-1 border border-white/10 hover:bg-white/5 text-white font-black py-4 text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
              Optimize My PC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, status, icon: Icon }: { label: string; value: string; status: string; icon: any }) {
  return (
    <div className="cyber-card p-5 group hover:border-[var(--neon-cyan)]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#52525b]">{label}</span>
        <Icon className={cn("h-4 w-4", status === 'optimal' ? "text-[var(--neon-cyan)]" : "text-[var(--neon-purple)]")} />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-display font-black text-white tracking-tighter">{value}</span>
        <div className="flex gap-0.5 pb-1">
          {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 bg-current opacity-20", 
                status === 'optimal' ? "text-[var(--neon-cyan)]" : "text-[var(--neon-purple)]"
              )} 
              style={{ height: `${h * 0.15}px` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
