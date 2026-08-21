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
    <div className="bg-background text-foreground selection:bg-primary/30 flex flex-col min-h-full font-sans">
      <main className="flex-1 relative z-10 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <Reveal>
            <div className="text-center mb-16 space-y-4">
              <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight">
                MEUS <span className="text-primary">SISTEMAS</span>
              </h1>
              <p className="text-foreground-muted font-sans font-medium uppercase tracking-widest text-[11px] max-w-2xl mx-auto">
                Gerencie seus protocolos ativos e acesse as ferramentas de elite do Spectre Hub.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 100}>
                <div className="ds-card !p-8 group hover:border-primary/20 transition-all bg-card/30 border-border relative overflow-hidden flex flex-col h-full rounded-xl">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <product.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-foreground-muted/50 uppercase tracking-widest mb-1 block">
                          {product.type}
                        </span>
                        <h3 className="font-display text-xl uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                      product.status === 'Ativo' 
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10' 
                        : 'border-foreground-muted/10 text-foreground-muted/50 bg-foreground-muted/5'
                    }`}>
                      {product.status}
                    </div>
                  </div>

                  <p className="text-[13px] text-foreground-muted font-medium leading-relaxed mb-10 flex-1">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-border flex gap-4">
                    <button 
                      className={`ds-btn ds-btn-primary flex-1 !py-3 !text-xs font-bold uppercase tracking-wider rounded-lg ${product.status !== 'Ativo' ? 'opacity-50 cursor-not-allowed grayscale' : 'shadow-lg shadow-primary/10'}`}
                      disabled={product.status !== 'Ativo'}
                    >
                      Acessar Terminal
                    </button>
                    <button className="ds-btn ds-btn-secondary !p-3 !min-w-[50px] rounded-lg">
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                    <product.icon className="w-full h-full text-primary -rotate-12 translate-x-4 -translate-y-4" />
                  </div>
                  
                  {/* Hover Trace Effect */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none select-none">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150 rotate-45">
                      <path 
                        d="M0 50 Q 25 25 50 50 T 100 50" 
                        stroke="currentColor" 
                        strokeWidth="1" 
                        className="text-primary animate-[dash_4s_linear_infinite]"
                        style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
                      />
                    </svg>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
