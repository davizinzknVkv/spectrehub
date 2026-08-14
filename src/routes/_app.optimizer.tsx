import { useState, useEffect } from "react";
import { useOptimizerStore } from "@/lib/optimizer/optimizer-store";
import { Button, Card, Badge, Modal } from "@/components/ui/ds";
import { 
  Activity, 
  Cpu, 
  Database, 
  Gauge, 
  Thermometer, 
  Zap,
  History as HistoryIcon,
  ShieldCheck,
  Search,
  Settings,
  LineChart,
  Network,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/optimizer")({
  component: OptimizerDashboard,
});

function OptimizerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-stack">
      <PageHeader
        title="SPECTRE OPTIMIZER"
        description="Maximum Performance. Zero Compromise."
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

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "optimizations" && <OptimizationsSection />}
        {activeTab === "history" && <HistorySection />}
        {["monitor", "game", "settings"].includes(activeTab) && (
          <div className="cyber-card p-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-[var(--neon-cyan)] animate-spin-slow" />
            </div>
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tighter">Módulo em Integração</h3>
            <p className="text-sm text-[#52525b] mt-2 max-w-xs uppercase tracking-widest leading-relaxed">
              Esta funcionalidade requer o Spectre Bridge local ativo para comunicação de baixo nível.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewSection() {
  const { metrics, performanceScore, isScanning, startScan, scanProgress, scanStep } = useOptimizerStore();

  return (
    <div className="space-y-8">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
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
                  strokeDasharray="364.4" 
                  strokeDashoffset={364.4 - (364.4 * performanceScore) / 100} 
                  strokeLinecap="square"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_var(--neon-purple-glow)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-black text-white">{performanceScore}</span>
                <span className="text-[9px] font-bold text-[#52525b] uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-center text-[11px] text-[#a1a1aa] leading-relaxed uppercase tracking-wider">
              {performanceScore > 90 ? "Sistema em performance máxima." : "Otimizações recomendadas encontradas."}<br/>
              <span className="text-[var(--neon-cyan)]">Clique em Scan para analisar.</span>
            </p>
          </div>
        </div>

        {/* Scan Actions */}
        <div className="lg:col-span-2 cyber-card p-6 flex flex-col justify-between">
          <div className="relative">
            {isScanning && (
              <div className="absolute inset-0 bg-[#0d0d0d]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white mb-2">
                    <span>{scanStep}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan-glow)] transition-all duration-300" 
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-[var(--neon-cyan)]" />
              <h3 className="text-lg font-display font-bold uppercase tracking-tighter text-white">System Scan</h3>
            </div>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed max-w-md">
              Análise heurística de processos, latência de rede e integridade de arquivos temporários.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Windows', 'Gaming', 'Network', 'Storage'].map(cat => (
                <div key={cat} className="p-3 bg-white/[0.02] border border-white/5 rounded-none text-center">
                  <span className="block text-[9px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-1">{cat}</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-[var(--neon-cyan)]" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              disabled={isScanning}
              onClick={startScan}
              className="flex-1 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/90 text-black font-black py-4 text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isScanning ? "Scanning..." : "Scan Now"}
            </button>
            <button className="flex-1 border border-white/10 hover:bg-white/5 text-white font-black py-4 text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
              One-Click Optimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptimizationsSection() {
  const { optimizations, applyOptimization } = useOptimizerStore();
  const [selected, setSelected] = useState<string | null>(null);

  const categories = {
    windows: { label: "Windows", icon: ShieldCheck, color: "var(--neon-blue)" },
    gaming: { label: "Gaming", icon: Gauge, color: "var(--neon-purple)" },
    network: { label: "Network", icon: Network, color: "var(--neon-cyan)" },
    storage: { label: "Storage", icon: HardDrive, color: "var(--neon-blue)" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(categories).map(([key, cat]) => (
        <div key={key} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest">{cat.label}</h3>
          </div>
          
          <div className="space-y-3">
            {optimizations.filter(o => o.category === key).map(opt => (
              <div 
                key={opt.id} 
                className={cn(
                  "cyber-card p-4 flex items-center justify-between group",
                  opt.status === 'optimized' && "opacity-60"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[12px] font-bold text-white uppercase tracking-tighter">{opt.name}</h4>
                    {opt.status === 'recommended' && (
                      <span className="text-[8px] bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] px-1.5 py-0.5 font-bold uppercase tracking-widest">Recomendado</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#52525b] uppercase tracking-wider">{opt.benefit}</p>
                </div>
                
                <button
                  disabled={opt.status === 'optimized'}
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "h-8 px-4 text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                    opt.status === 'optimized' 
                      ? "bg-white/5 text-[#52525b] border border-white/5 cursor-default"
                      : "bg-white/5 text-white border border-white/10 hover:bg-[var(--neon-cyan)] hover:text-black hover:border-[var(--neon-cyan)]"
                  )}
                >
                  {opt.status === 'optimized' ? "Aplicado" : "Optimize"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <Modal
          title="Confirmar Otimização"
          onClose={() => setSelected(null)}
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>Cancelar</Button>
              <Button 
                variant="primary" 
                className="!bg-[var(--neon-cyan)] !text-black"
                onClick={() => {
                  applyOptimization(selected);
                  setSelected(null);
                }}
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Você está prestes a aplicar uma otimização de sistema. Recomendamos criar um ponto de restauração se esta for sua primeira vez.
            </p>
            <div className="p-3 bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[var(--neon-purple)]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ação Reversível via Spectre History</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function HistorySection() {
  const { history } = useOptimizerStore();

  if (history.length === 0) {
    return (
      <div className="cyber-card p-12 text-center">
        <HistoryIcon className="h-8 w-8 text-[#52525b] mx-auto mb-4" />
        <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.3em]">Nenhum registro encontrado</p>
      </div>
    );
  }

  return (
    <div className="cyber-card overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#52525b]">Data</th>
            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#52525b]">Otimização</th>
            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#52525b]">Categoria</th>
            <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#52525b]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-4 text-[11px] font-mono text-[#a1a1aa]">
                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 text-[12px] font-bold text-white uppercase tracking-tighter">{item.name}</td>
              <td className="px-6 py-4">
                <span className="text-[9px] border border-white/10 px-2 py-0.5 font-bold uppercase tracking-widest text-[#52525b]">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                  <span className="text-[10px] font-bold text-[var(--neon-cyan)] uppercase tracking-widest">Completo</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({ metric }: { metric: any }) {
  const Icon = metric.icon;
  const isOptimal = metric.status === 'optimal';

  return (
    <div className="cyber-card p-5 group hover:border-[var(--neon-cyan)]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#52525b]">{metric.label}</span>
        <Icon className={cn("h-4 w-4", isOptimal ? "text-[var(--neon-cyan)]" : "text-[var(--neon-purple)]")} />
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-black text-white tracking-tighter">{metric.value}</span>
          <span className="text-[10px] font-bold text-[#52525b] uppercase">{metric.unit}</span>
        </div>
        <div className="flex gap-0.5 pb-1 h-6 items-end">
          {metric.trend.map((h: number, i: number) => (
            <div 
              key={i} 
              className={cn(
                "w-1 transition-all duration-500", 
                isOptimal ? "bg-[var(--neon-cyan)]" : "bg-[var(--neon-purple)]"
              )} 
              style={{ 
                height: `${Math.max(15, (h / (typeof metric.value === 'number' ? metric.value * 2 : 100)) * 100)}%`,
                opacity: 0.1 + (i * 0.2)
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
