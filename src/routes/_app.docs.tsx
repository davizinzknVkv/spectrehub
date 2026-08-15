import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Book, Shield, Zap, Terminal, Code, Cpu, Globe, Lock, MessageSquare, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

export const Route = createFileRoute("/_app/docs")({
  component: DocsPage,
});

function DocsPage() {
  const categories = [
    {
      title: "Introdução",
      icon: Globe,
      items: [
        { name: "O que é o Spectre Hub?", description: "Visão geral do ecossistema de automação elite." },
        { name: "Primeiros Passos", description: "Configurando sua conta e integrando com o Discord." },
        { name: "Requisitos do Sistema", description: "Otimizações necessárias para performance máxima." },
      ],
    },
    {
      title: "Sistemas Elite",
      icon: Zap,
      items: [
        { name: "Auto Quests", description: "Manual completo sobre automação de missões e Orbs." },
        { name: "Spectre Optimizer", description: "Como extrair 100% de performance do seu hardware." },
        { name: "Nicks-Gun Sniper", description: "Técnicas avançadas para captura de usernames raros." },
      ],
    },
    {
      title: "Segurança & Termos",
      icon: Shield,
      items: [
        { name: "Protocolos Anti-Detecção", description: "Como nossos sistemas emulam comportamento humano." },
        { name: "Termos de Uso", description: "Regras da comunidade e diretrizes de utilização." },
        { name: "Privacidade de Dados", description: "Como protegemos suas informações e tokens." },
      ],
    },
    {
      title: "Desenvolvedores",
      icon: Code,
      items: [
        { name: "API Reference", description: "Documentação técnica para integrações externas." },
        { name: "Webhooks", description: "Configurando notificações em tempo real no seu servidor." },
        { name: "CLI Tooling", description: "Uso avançado via terminal para power users." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
            <div>
              <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-spectre-pink/30" />
                Documentação Oficial
              </div>
              <h1 className="font-display text-[2.5rem] md:text-[4rem] leading-[0.9] uppercase italic tracking-tighter">
                CENTRAL DE <br />
                <span className="text-white/30">CONHECIMENTO.</span>
              </h1>
            </div>
            <div className="max-w-md text-right hidden md:block">
              <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed">
                Explore nossos guias detalhados para dominar todas as ferramentas do ecossistema Spectre e elevar sua automação ao nível elite.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 100}>
              <div className="bg-obsidian p-8 md:p-12 h-full border border-transparent hover:border-spectre-pink/20 transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-spectre-pink group-hover:bg-spectre-pink group-hover:text-white transition-all duration-500">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-xl uppercase italic tracking-tighter">{cat.title}</h2>
                </div>

                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <a 
                      key={item.name} 
                      href="#" 
                      className="block group/item hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display text-[11px] uppercase tracking-widest text-white/80 group-hover/item:text-spectre-pink transition-colors">
                          {item.name}
                        </span>
                        <ChevronRight className="w-3 h-3 text-white/20 group-hover/item:text-spectre-pink" />
                      </div>
                      <p className="text-[10px] text-white/30 uppercase tracking-tight leading-normal">
                        {item.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-20 p-8 md:p-16 border border-spectre-pink/20 bg-spectre-pink/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-spectre-pink/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="font-display text-2xl uppercase italic tracking-tighter mb-4">
                  Ainda precisa de <span className="text-spectre-pink">ajuda?</span>
                </h3>
                <p className="text-white/40 text-xs uppercase tracking-widest max-w-xl">
                  Nossa equipe de suporte técnico está disponível 24/7 no Discord para resolver qualquer dúvida complexa ou problema técnico.
                </p>
              </div>
              <a 
                href="https://discord.gg/spectrehub" 
                target="_blank" 
                rel="noreferrer"
                className="ds-btn ds-btn-primary whitespace-nowrap"
              >
                ABRIR TICKET NO DISCORD
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
