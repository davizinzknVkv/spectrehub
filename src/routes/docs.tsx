import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  Search, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Award, 
  LifeBuoy, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("boas-vindas");

  const navItems = [
    { id: "boas-vindas", label: "Introdução" },
    { id: "produtos", label: "Produtos" },
    { id: "guia", label: "Como começar" },
    { id: "faq", label: "FAQ" },
    { id: "termos", label: "Termos de Uso" },
    { id: "suporte", label: "Suporte" },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-spectre-pink/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoAsset.url} alt="Spectre" className="h-8 w-8 object-contain" />
            <span className="font-display text-lg tracking-tighter uppercase italic">Spectre <span className="text-spectre-pink">Docs</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {["Documentação", "Produtos", "Guia", "Suporte"].map((item) => (
              <a key={item} href="#" className="font-display text-[10px] tracking-[0.3em] uppercase italic text-white/50 hover:text-white transition-colors">{item}</a>
            ))}
            <Link to="/hub" className="ds-btn ds-btn-primary !px-6 !py-2 !text-[10px]">ACESSAR SPECTRE</Link>
          </nav>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        <aside className="hidden lg:block w-[240px] shrink-0 sticky top-28 h-fit space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-white/30" />
            <input 
              placeholder="Buscar..." 
              className="w-full bg-white/5 border border-white/5 p-2.5 pl-10 text-xs rounded outline-none focus:border-spectre-pink/50"
            />
          </div>
          <nav className="space-y-2">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "block w-full text-left text-[11px] font-bold uppercase tracking-wider py-2 transition-colors",
                  activeSection === item.id ? "text-spectre-pink" : "text-white/40 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 space-y-12">
          <section className="space-y-6">
            <h1 className="font-display text-5xl uppercase tracking-tighter">Bem-vindo ao Spectre Hub</h1>
            <p className="text-white/60 text-lg max-w-2xl">Conheça nossa plataforma, nossos produtos e como utilizar os recursos disponíveis de forma segura e eficiente.</p>
            <div className="flex gap-4 pt-4">
              <button className="ds-btn ds-btn-primary !px-8">Começar</button>
              <button className="ds-btn ds-btn-secondary !px-8">Conhecer produtos</button>
            </div>
          </section>

          <section className="border-t border-white/5 pt-12 space-y-8">
            <h2 className="font-display text-3xl uppercase tracking-tighter">Produtos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Auto Quests", desc: "Execução massiva de missões." },
                { name: "Nicks-Gun", desc: "Sniper de nicks raros." },
                { name: "Server Control", desc: "Gestão profissional." },
                { name: "Presence Sync", desc: "Sincronização de status." },
              ].map(p => (
                <div key={p.name} className="p-6 bg-white/5 border border-white/5 rounded-lg hover:border-spectre-pink/30 transition-all">
                  <h3 className="font-bold text-sm mb-2">{p.name}</h3>
                  <p className="text-white/50 text-[11px]">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-white/5 mt-20 py-12 text-center text-[10px] uppercase tracking-widest text-white/30">
        Spectre Hub © 2026. Todos os direitos reservados.
      </footer>
    </div>
  );
}
