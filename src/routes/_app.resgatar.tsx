import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Zap, 
  Activity, 
  Sparkles, 
  LayoutDashboard 
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

export const Route = createFileRoute("/_app/resgatar")({
  component: ResgatarPage,
});

const PRODUCTS = [
  {
    id: "auto-quests",
    name: "Auto Quests",
    icon: Zap,
    description: "Execução massiva de missões oficiais do Discord com sistema anti-detecção e cooldown inteligente.",
    status: "Ativo",
    type: "Automação",
  },
  {
    id: "optimizer",
    name: "Spectre Optimizer",
    icon: Activity,
    description: "Maximize a performance do seu hardware. Ferramenta elite para limpeza de registros e CPU/RAM.",
    status: "Em Breve",
    type: "Sistema",
  },
  {
    id: "sniper",
    name: "Nicks-Gun Sniper",
    icon: Sparkles,
    description: "Sniper avançado para capturar usernames raros de 2 e 3 letras antes de todos.",
    status: "Ativo",
    type: "Identidade",
  },
  {
    id: "discord-tools",
    name: "Discord Tools",
    icon: LayoutDashboard,
    description: "Poder total sobre sua conta. Gestão profissional de servidores, clonagem e limpeza em massa.",
    status: "Ativo",
    type: "Utilidades",
  },
];

function ResgatarPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/30 flex flex-col min-h-full">
      <main className="flex-1 relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <Reveal>
            <div className="mb-20 space-y-6">
              <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase mb-6 flex items-center gap-4">
                 <div className="w-12 h-px bg-primary" />
                 MÓDULOS DE INFRAESTRUTURA
              </div>
              <h1 className="font-display text-[4rem] md:text-[6rem] leading-[0.85] text-white uppercase tracking-tighter">
                MEUS <br/><span className="text-primary italic opacity-90">SISTEMAS.</span>
              </h1>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 pb-20">
            {PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 50} className="bg-[#030303] group">
                <div className="p-12 flex flex-col h-full relative overflow-hidden hover:bg-white/[0.01] transition-all duration-500">
                  <div className="flex items-start justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary group-hover:border-primary/40 transition-all duration-500">
                        <product.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-white/10 uppercase tracking-[0.4em] mb-2 block">
                          MÓDULO 0{idx + 1} // {product.type}
                        </span>
                        <h3 className="font-display text-2xl uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <div className={`font-mono text-[7px] uppercase tracking-[0.3em] ${
                      product.status === 'Ativo' 
                        ? 'text-emerald-500' 
                        : 'text-white/10'
                    }`}>
                      {product.status === 'Ativo' ? '[ ONLINE ]' : '[ STANDBY ]'}
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-white/30 uppercase tracking-[0.1em] leading-relaxed mb-16 flex-1 max-w-sm group-hover:text-white/50 transition-colors">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-10 border-t border-white/5 flex gap-4">
                    <button 
                      className={`ds-btn ds-btn-primary flex-1 !h-14 !text-[10px] tracking-[0.2em] ${product.status !== 'Ativo' ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                      disabled={product.status !== 'Ativo'}
                    >
                      ACESSAR TERMINAL
                    </button>
                    <button className="ds-btn ds-btn-secondary !w-14 !h-14 flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Corner indicator */}
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white/5 group-hover:bg-primary transition-colors" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
