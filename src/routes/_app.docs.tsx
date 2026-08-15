import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  Search, 
  LayoutDashboard, 
  MessageSquare, 
  Sun, 
  Moon, 
  Laptop,
  BookOpen,
  FileText,
  Lightbulb,
  Award,
  Activity,
  LifeBuoy,
  Sparkles
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/docs")({
  component: DocsPage,
});

function DocsPage() {
  const [activeTab, setActiveTab] = useState("documentacao");
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarGroups = [
    {
      title: "Comece por aqui!",
      items: [
        { id: "boas-vindas", label: "Boas-vindas", icon: BookOpen, active: true },
        { id: "termos", label: "Termos de Uso", icon: Shield },
        { id: "dicas", label: "Dicas", icon: Lightbulb },
      ]
    },
    {
      title: "Nossos produtos",
      items: [
        { id: "auto-quests", label: "Auto Quests", icon: Zap },
        { id: "optimizer", label: "Spectre Optimizer", icon: Activity },
        { id: "sniper", label: "Nicks-Gun Sniper", icon: Sparkles },
        { id: "cloner", label: "Discord Tools", icon: LayoutDashboard },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] border-r border-white/5 bg-[#080808] flex flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoAsset.url} alt="Spectre" className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(255,0,85,0.3)] transition-transform group-hover:scale-110" />
            <span className="font-display text-lg tracking-tighter uppercase italic">Spectre</span>
          </Link>
          <div className="flex items-center gap-2 text-white/20">
            <Sun className="w-3.5 h-3.5" />
            <Moon className="w-3.5 h-3.5" />
            <Laptop className="w-3.5 h-3.5 text-spectre-pink" />
          </div>
        </div>

        <div className="p-4 border-b border-white/5">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-spectre-pink transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar" 
              className="w-full bg-white/[0.02] border border-white/5 py-2 pl-9 pr-4 text-[10px] font-display uppercase tracking-widest outline-none focus:border-spectre-pink/20 transition-all italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-white/10 text-[8px] text-white/20 rounded">Ctrl K</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
           <div className="space-y-1">
             <div className="flex items-center gap-3 px-4 py-2 text-white/40">
               <LayoutDashboard className="w-3.5 h-3.5" />
               <span className="font-display text-[10px] uppercase tracking-widest italic">Painel</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 text-white/40">
               <MessageSquare className="w-3.5 h-3.5" />
               <span className="font-display text-[10px] uppercase tracking-widest italic">Discord</span>
             </div>
           </div>

           {sidebarGroups.map(group => (
             <div key={group.title} className="space-y-1">
               <div className="px-4 pb-2 text-[9px] font-display font-bold uppercase tracking-[0.2em] text-white/20 italic">{group.title}</div>
               {group.items.map(item => (
                 <button 
                  key={item.id} 
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-300 group text-left",
                    item.active ? "bg-spectre-pink/5 text-spectre-pink" : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                  )}
                 >
                   <item.icon className={cn("w-3.5 h-3.5", item.active ? "text-spectre-pink" : "text-white/20 group-hover:text-white")} />
                   <span className="font-display text-[10px] uppercase tracking-widest italic">{item.label}</span>
                 </button>
               ))}
             </div>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/20" />
              <span className="font-display text-[10px] uppercase tracking-widest italic">Português</span>
            </div>
            <ChevronRight className="w-3 h-3 text-white/10" />
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 bg-[#030303] overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-8 h-[73px] flex items-center gap-8">
           <div className="flex gap-6 h-full">
             {["Documentação", "Base Rebirth"].map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "h-full px-2 font-display text-[10px] uppercase tracking-[0.2em] italic relative transition-colors",
                  activeTab === tab.toLowerCase() ? "text-white" : "text-white/40 hover:text-white"
                )}
               >
                 {tab}
                 {activeTab === tab.toLowerCase() && (
                   <div className="absolute bottom-0 left-0 w-full h-0.5 bg-spectre-pink shadow-[0_0_10px_rgba(255,0,85,0.5)]" />
                 )}
               </button>
             ))}
           </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
          <Reveal>
            <div className="space-y-12">
              <section className="space-y-6">
                <h1 className="font-display text-4xl lg:text-6xl uppercase italic tracking-tighter leading-none">Boas-vindas</h1>
                <p className="text-white/40 font-sans text-lg leading-relaxed">Bem-vindo à documentação oficial do Spectre Hub.</p>
                
                <div className="space-y-6 pt-8">
                  <p className="text-white/60 font-sans leading-relaxed">
                    Bem-vindo ao <span className="text-white font-bold">Spectre Hub</span> — a plataforma definitiva focada em automação de elite para Discord e otimização de sistemas.
                  </p>
                  <p className="text-white/60 font-sans leading-relaxed">
                    Aqui você encontra tudo o que precisa para instalar, configurar e aproveitar ao máximo nossos sistemas. Desde a configuração inicial até recursos avançados de API, nossa documentação cobre cada etapa do processo com clareza e objetividade.
                  </p>
                </div>
              </section>

              <section className="space-y-8 pt-8 border-t border-white/5">
                <h2 className="font-display text-2xl lg:text-3xl uppercase italic tracking-tighter leading-none">O que é o Spectre Hub?</h2>
                <p className="text-white/60 font-sans leading-relaxed">
                  O Spectre Hub desenvolve ferramentas para usuários de Discord e entusiastas de automação, com foco em inovação, qualidade e desempenho. Nossos sistemas são criados para oferecer a melhor experiência tanto para os colecionadores de nicks quanto para quem busca otimizar seu tempo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="ds-card p-6 group hover:border-spectre-pink/20 transition-all border-white/5 bg-white/[0.02] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3 text-spectre-pink">
                      <Shield className="w-4 h-4" />
                      <h3 className="font-display text-[11px] uppercase tracking-widest italic">Termos de Uso</h3>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Conheça as regras e condições para aquisição e uso dos nossos produtos.</p>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                      <Shield className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="ds-card p-6 group hover:border-spectre-pink/20 transition-all border-white/5 bg-white/[0.02] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3 text-spectre-pink">
                      <Lightbulb className="w-4 h-4" />
                      <h3 className="font-display text-[11px] uppercase tracking-widest italic">Dicas</h3>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Procedimentos recomendados para utilizar nossos sistemas com segurança.</p>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                      <Lightbulb className="w-12 h-12" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8 pt-8 border-t border-white/5">
                <h2 className="font-display text-2xl lg:text-3xl uppercase italic tracking-tighter leading-none">Por que escolher o Spectre?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Qualidade", icon: Award, desc: "Sistemas desenvolvidos com os mais altos padrões de estabilidade e boas práticas." },
                    { title: "Desempenho", icon: Zap, desc: "Sistemas otimizados para garantir o máximo desempenho sem comprometer seu hardware." },
                    { title: "Suporte", icon: LifeBuoy, desc: "Atendimento especializado para ajudar em instalações, dúvidas e correções." },
                  ].map(item => (
                    <div key={item.title} className="ds-card p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                      <item.icon className="w-4 h-4 text-spectre-pink mb-4" />
                      <h4 className="font-display text-[10px] uppercase tracking-widest text-white italic mb-2">{item.title}</h4>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </Reveal>

          {/* Table of contents */}
          <aside className="hidden lg:block space-y-6 sticky top-[100px] h-fit">
            <div className="flex items-center gap-2 text-white/20">
              <FileText className="w-3 h-3" />
              <span className="font-display text-[8px] uppercase tracking-[0.3em] italic">Nesta página</span>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block text-[9px] font-display uppercase tracking-widest text-spectre-pink italic border-l border-spectre-pink pl-4">O que é o Spectre Hub?</a>
              <a href="#" className="block text-[9px] font-display uppercase tracking-widest text-white/20 hover:text-white transition-colors italic pl-4">Por que escolher o Spectre?</a>
            </nav>
          </aside>
        </div>
      </main>

      {/* Floating AI Button */}
      <button className="fixed bottom-8 right-8 ds-btn ds-btn-primary !px-6 !py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(255,0,85,0.3)] group z-50">
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span className="text-[10px]">PERGUNTAR À IA</span>
      </button>
    </div>
  );
}

