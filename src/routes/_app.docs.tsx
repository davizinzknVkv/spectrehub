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
  const [activeTab, setActiveTab] = useState("documentação");
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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row w-full overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] border-r border-border bg-background-secondary flex flex-col h-screen lg:sticky lg:top-0 shrink-0 z-20">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoAsset.url} alt="Spectre" className="h-8 w-8 object-contain transition-transform group-hover:scale-110" />
            <span className="font-display text-lg tracking-tighter uppercase">Spectre</span>
          </Link>
          <div className="flex items-center gap-2 text-foreground-muted/30">
            <Sun className="w-3.5 h-3.5" />
            <Moon className="w-3.5 h-3.5" />
            <Laptop className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted/50 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar documentação" 
              className="w-full bg-background border border-border py-2 pl-9 pr-4 text-xs rounded-md outline-none focus:border-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
           <div className="space-y-1">
             <div className="flex items-center gap-3 px-4 py-2 text-foreground-muted/50 hover:text-foreground cursor-pointer transition-colors">
               <LayoutDashboard className="w-3.5 h-3.5" />
               <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Painel</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 text-foreground-muted/50 hover:text-foreground cursor-pointer transition-colors">
               <MessageSquare className="w-3.5 h-3.5" />
               <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Discord</span>
             </div>
           </div>

           {sidebarGroups.map(group => (
             <div key={group.title} className="space-y-1">
               <div className="px-4 pb-2 text-[10px] font-sans font-bold uppercase tracking-wider text-foreground-muted/30">{group.title}</div>
               {group.items.map(item => (
                 <button 
                  key={item.id} 
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group text-left",
                    item.active ? "bg-primary/10 text-foreground" : "text-foreground-muted hover:text-foreground hover:bg-white/[0.03]"
                  )}
                 >
                   <item.icon className={cn("w-3.5 h-3.5", item.active ? "text-primary" : "text-foreground-muted group-hover:text-foreground")} />
                   <span className="font-sans text-[13px] font-medium">{item.label}</span>
                 </button>
               ))}
             </div>
           ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-between px-4 py-2 bg-background border border-border rounded-lg hover:border-border/80 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-foreground-muted/50" />
              <span className="font-sans text-xs font-semibold">Português (BR)</span>
            </div>
            <ChevronRight className="w-3 h-3 text-foreground-muted/30" />
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 bg-background overflow-y-auto relative z-10">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 h-[73px] flex items-center gap-8">
           <div className="flex gap-6 h-full">
             {["Documentação", "Base Rebirth"].map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "h-full px-2 font-sans text-[11px] font-bold uppercase tracking-wider relative transition-colors",
                  activeTab === tab.toLowerCase() ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                )}
               >
                 {tab}
                 {activeTab === tab.toLowerCase() && (
                   <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_12px_rgba(255,0,85,0.4)]" />
                 )}
               </button>
             ))}
           </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
          <Reveal>
            <div className="space-y-12">
              <section className="space-y-6">
                <h1 className="font-display text-4xl lg:text-6xl uppercase tracking-tight leading-none">Boas-vindas</h1>
                <p className="text-foreground-muted font-sans text-lg leading-relaxed">Bem-vindo à documentação oficial do ecossistema Spectre Hub.</p>
                
                <div className="space-y-6 pt-8">
                  <p className="text-foreground font-sans leading-relaxed text-base opacity-80">
                    O <span className="text-primary font-bold">Spectre Hub</span> é a plataforma definitiva focada em automação de elite para Discord e otimização de sistemas.
                  </p>
                  <p className="text-foreground font-sans leading-relaxed text-base opacity-80">
                    Aqui você encontra tudo o que precisa para instalar, configurar e aproveitar ao máximo nossos sistemas. Desde a configuração inicial até recursos avançados, nossa documentação cobre cada etapa com clareza.
                  </p>
                </div>
              </section>

              <section className="space-y-8 pt-8 border-t border-border">
                <h2 className="font-display text-2xl lg:text-3xl uppercase tracking-tight leading-none">O que é o Spectre Hub?</h2>
                <p className="text-foreground font-sans leading-relaxed text-base opacity-80">
                  Desenvolvemos ferramentas para usuários de Discord e entusiastas de automação, com foco em inovação, qualidade e desempenho extremo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="ds-card !p-6 group hover:border-primary/20 transition-all border-border bg-card/30 relative overflow-hidden rounded-xl">
                    <div className="flex items-center gap-3 mb-3 text-primary">
                      <Shield className="w-4 h-4" />
                      <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider">Termos de Uso</h3>
                    </div>
                    <p className="text-[11px] text-foreground-muted font-sans font-medium leading-relaxed">Conheça as regras e condições para aquisição e uso dos nossos produtos.</p>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                      <Shield className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="ds-card !p-6 group hover:border-primary/20 transition-all border-border bg-card/30 relative overflow-hidden rounded-xl">
                    <div className="flex items-center gap-3 mb-3 text-primary">
                      <Lightbulb className="w-4 h-4" />
                      <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider">Dicas</h3>
                    </div>
                    <p className="text-[11px] text-foreground-muted font-sans font-medium leading-relaxed">Procedimentos recomendados para utilizar nossos sistemas com segurança.</p>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                      <Lightbulb className="w-12 h-12" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8 pt-8 border-t border-border">
                <h2 className="font-display text-2xl lg:text-3xl uppercase tracking-tight leading-none">Vantagens</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Qualidade", icon: Award, desc: "Sistemas desenvolvidos com os mais altos padrões de estabilidade." },
                    { title: "Desempenho", icon: Zap, desc: "Otimização extrema para garantir o máximo desempenho." },
                    { title: "Suporte", icon: LifeBuoy, desc: "Atendimento especializado para ajudar em todas as etapas." },
                  ].map(item => (
                    <div key={item.title} className="ds-card !p-6 border-border bg-card/20 hover:bg-card/40 transition-all rounded-xl">
                      <item.icon className="w-4 h-4 text-primary mb-4" />
                      <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-foreground mb-2">{item.title}</h4>
                      <p className="text-[11px] text-foreground-muted font-sans font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </Reveal>

          {/* Table of contents */}
          <aside className="hidden lg:block space-y-6 sticky top-[100px] h-fit">
            <div className="flex items-center gap-2 text-foreground-muted/30">
              <FileText className="w-3 h-3" />
              <span className="font-sans text-[9px] font-bold uppercase tracking-widest">Nesta página</span>
            </div>
            <nav className="space-y-3">
              <a href="#" className="block text-[11px] font-semibold text-primary border-l-2 border-primary pl-4">O que é o Spectre Hub?</a>
              <a href="#" className="block text-[11px] font-medium text-foreground-muted hover:text-foreground transition-colors pl-4">Por que escolher o Spectre?</a>
            </nav>
          </aside>
        </div>
      </main>

      {/* Floating AI Button */}
      <button className="fixed bottom-8 right-8 ds-btn ds-btn-primary !px-6 !py-3 flex items-center gap-3 shadow-[0_4px_20px_rgba(255,0,85,0.3)] group z-50 rounded-full">
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Perguntar à IA</span>
      </button>
    </div>
  );
}
