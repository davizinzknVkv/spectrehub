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
    description: "Execução massiva de missões oficiais do Discord. Coleta automatizada de Orbs e recompensas com sistema anti-detecção e cooldown inteligente.",
    status: "Ativo",
    type: "Automação",
  },
  {
    id: "optimizer",
    name: "Spectre Optimizer",
    icon: Activity,
    description: "Maximize a performance do seu hardware. Ferramenta elite para limpeza de registros e otimização de CPU/RAM.",
    status: "Em Breve",
    type: "Sistema",
  },
  {
    id: "sniper",
    name: "Nicks-Gun Sniper",
    icon: Sparkles,
    description: "Domine sua identidade. Sniper avançado para capturar usernames raros de 2 e 3 letras antes de todos.",
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
    <div className="bg-[#030303] text-white selection:bg-spectre-pink/30 flex flex-col min-h-full">
      <main className="flex-1 relative z-10 py-12 px-4 sm:px-8">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-spectre-pink/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-spectre-pink/5 rounded-full blur-[120px] pointer-events-none" />
          
          <Reveal>
            <div className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-6xl uppercase italic tracking-tighter mb-4">
                MEUS <span className="text-spectre-pink">SISTEMAS</span>
              </h1>
              <p className="text-white/40 font-sans max-w-2xl mx-auto uppercase tracking-widest text-[10px]">
                Gerencie seus protocolos ativos e acesse as ferramentas de elite do Spectre Hub.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 100}>
                <div className="ds-card p-8 group hover:border-spectre-pink/30 transition-all bg-white/[0.02] relative overflow-hidden flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-spectre-pink/10 flex items-center justify-center text-spectre-pink group-hover:scale-110 transition-transform">
                        <product.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[9px] font-display text-white/20 uppercase tracking-[0.2em] italic mb-1 block">
                          {product.type}
                        </span>
                        <h3 className="font-display text-xl uppercase italic tracking-widest text-white group-hover:text-spectre-pink transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-[9px] font-display uppercase tracking-widest italic border ${
                      product.status === 'Ativo' 
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' 
                        : 'border-white/10 text-white/30 bg-white/5'
                    }`}>
                      {product.status}
                    </div>
                  </div>

                  <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed mb-8 flex-1">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                    <button 
                      className={`ds-btn ds-btn-primary flex-1 !py-3 !text-[10px] ${product.status !== 'Ativo' && 'opacity-50 cursor-not-allowed filter grayscale'}`}
                      disabled={product.status !== 'Ativo'}
                    >
                      ACESSAR TERMINAL
                    </button>
                    <button className="ds-btn ds-btn-secondary !p-3 !min-w-[50px]">
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Aesthetic Corner - Hover Trail Effect */}
                  <div className="absolute top-1/2 -right-8 w-32 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none select-none rotate-12">
                    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                      <path 
                        d="M5 5L95 25L5 45L95 55" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-spectre-pink animate-[dash_3s_ease-in-out_infinite]"
                        style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
                      />
                    </svg>
                  </div>

                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                    <product.icon className="w-full h-full text-spectre-pink -rotate-12 translate-x-4 -translate-y-4" />
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
