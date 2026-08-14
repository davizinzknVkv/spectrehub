import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  MetricType, 
  SystemMetric, 
  OptimizationItem, 
  OptimizationHistory,
  OptimizationCategory
} from "./types";
import { Cpu, Database, Thermometer, Gauge, Activity, Network, HardDrive, Wind } from "lucide-react";

interface OptimizerState {
  isScanning: boolean;
  scanProgress: number;
  scanStep: string;
  lastScanDate: string | null;
  performanceScore: number;
  metrics: SystemMetric[];
  optimizations: OptimizationItem[];
  history: OptimizationHistory[];
  
  startScan: () => void;
  applyOptimization: (id: string) => void;
  updateMetrics: (newMetrics: Partial<SystemMetric>[]) => void;
}

const INITIAL_OPTIMIZATIONS: OptimizationItem[] = [
  // Windows
  { id: "win-temp", category: "windows", name: "Arquivos Temporários", description: "Remove arquivos residuais do sistema e caches antigos.", benefit: "Libera espaço e reduz I/O", status: "available", impact: "low" },
  { id: "win-serv", category: "windows", name: "Otimização de Serviços", description: "Desativa serviços desnecessários do Windows.", benefit: "Reduz uso de CPU e RAM", status: "recommended", impact: "medium" },
  // Gaming
  { id: "game-mode", category: "gaming", name: "Game Mode Ultra", description: "Prioriza recursos do sistema para processos de jogos.", benefit: "Aumento de FPS e estabilidade", status: "recommended", impact: "high" },
  { id: "game-proc", category: "gaming", name: "Prioridade de Processos", description: "Sintoniza a prioridade do agendador de tarefas.", benefit: "Reduz stuttering", status: "available", impact: "medium" },
  // Network
  { id: "net-dns", category: "network", name: "DNS Gaming", description: "Configura DNS de baixa latência (Spectre Direct).", benefit: "Reduz ping em jogos online", status: "recommended", impact: "high" },
  { id: "net-tcp", category: "network", name: "TCP Stack Optimization", description: "Ajusta parâmetros da pilha TCP/IP.", benefit: "Melhora throughput de rede", status: "available", impact: "low" },
  // Storage
  { id: "stor-cache", category: "storage", name: "Deep Cache Clean", description: "Limpeza profunda de caches de aplicativos e shaders.", benefit: "Performance de disco otimizada", status: "available", impact: "medium" },
];

export const useOptimizerStore = create<OptimizerState>()(
  persist(
    (set, get) => ({
      isScanning: false,
      scanProgress: 0,
      scanStep: "",
      lastScanDate: null,
      performanceScore: 82,
      metrics: [
        { id: "cpu", label: "CPU Usage", value: 34, unit: "%", trend: [20, 30, 45, 34], status: "optimal", icon: Cpu },
        { id: "ram", label: "RAM Usage", value: 5.8, unit: "GB", trend: [5.2, 5.5, 6.0, 5.8], status: "warning", icon: Database },
        { id: "temp_cpu", label: "CPU Temp", value: 48, unit: "°C", trend: [45, 47, 50, 48], status: "optimal", icon: Thermometer },
        { id: "fps", label: "FPS", value: 0, unit: "", trend: [0, 0, 0, 0], status: "optimal", icon: Gauge },
        { id: "ping", label: "Ping", value: 12, unit: "ms", trend: [10, 15, 12, 12], status: "optimal", icon: Network },
        { id: "disk", label: "Disk Usage", value: 15, unit: "%", trend: [10, 12, 18, 15], status: "optimal", icon: HardDrive },
      ],
      optimizations: INITIAL_OPTIMIZATIONS,
      history: [],

      startScan: async () => {
        set({ isScanning: true, scanProgress: 0, scanStep: "Inicializando scanner..." });
        
        const steps = [
          { p: 15, s: "Verificando serviços do Windows..." },
          { p: 35, s: "Analisando gargalos de hardware..." },
          { p: 60, s: "Checando latência de rede..." },
          { p: 85, s: "Escaneando arquivos temporários..." },
          { p: 100, s: "Scan completo!" },
        ];

        for (const step of steps) {
          await new Promise(r => setTimeout(r, 800));
          set({ scanProgress: step.p, scanStep: step.s });
        }

        setTimeout(() => {
          set({ isScanning: false, lastScanDate: new Date().toISOString(), performanceScore: 87 });
        }, 500);
      },

      applyOptimization: (id) => {
        set((state) => {
          const item = state.optimizations.find(o => o.id === id);
          if (!item) return state;

          const newHistory: OptimizationHistory = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            name: item.name,
            category: item.category,
            result: "completed"
          };

          return {
            optimizations: state.optimizations.map(o => 
              o.id === id ? { ...o, status: "optimized" as const } : o
            ),
            history: [newHistory, ...state.history],
            performanceScore: Math.min(100, state.performanceScore + 2)
          };
        });
      },

      updateMetrics: (newMetrics) => {
        set((state) => ({
          metrics: state.metrics.map(m => {
            const update = newMetrics.find(um => um.id === m.id);
            if (!update) return m;
            return {
              ...m,
              ...update,
              trend: [...m.trend.slice(1), typeof update.value === 'number' ? update.value : m.value as number]
            };
          })
        }));
      }
    }),
    {
      name: "spectre-optimizer-storage",
      partialize: (state) => ({ 
        history: state.history, 
        optimizations: state.optimizations,
        performanceScore: state.performanceScore,
        lastScanDate: state.lastScanDate
      }),
    }
  )
);
