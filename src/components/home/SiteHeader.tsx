import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Menu, LogIn, Search, Github, Twitter, Linkedin, ChevronDown, MessageSquare } from "lucide-react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteHeaderProps {
  guildInvite: string;
}

const NAV = [
  { href: "#produtos", label: "sistemas" },
  { href: "#como-funciona", label: "método" },
  { href: "#planos", label: "planos" },
  { href: "#comunidade", label: "comunidade" },
];

export function SiteHeader({ guildInvite }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 md:px-8">
      <div 
        className={`mx-auto max-w-[1400px] flex items-center justify-between transition-all duration-700 rounded-xl ${
          scrolled 
            ? "bg-black/60 backdrop-blur-2xl px-6 py-2 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.8)]" 
            : "bg-transparent px-4 py-4"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img
              src={logoAsset.url}
              alt="Spectre Hub"
              className="w-full h-full object-contain invert group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="font-display text-lg tracking-tighter text-white uppercase italic hidden sm:block">
            Spectre <span className="text-spectre-pink">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center max-w-2xl px-8">
          {/* Search Bar (image-80.png) */}
          <div className="flex-1 relative group max-w-[300px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar" 
              className="w-full bg-black/40 border border-white/5 py-1.5 pl-9 pr-12 text-[11px] text-white/60 placeholder:text-white/20 focus:outline-none focus:border-spectre-pink/30 focus:bg-black/60 transition-all rounded-md"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <span className="text-[9px] text-white/20 border border-white/10 px-1 py-0.5 rounded bg-white/[0.02]">Ctrl K</span>
            </div>
          </div>

          <nav className="flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-display text-[10px] tracking-[0.3em] text-white/40 hover:text-white transition-colors uppercase italic"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Actions & Socials (image-81.png) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 text-white/40 pr-6 border-r border-white/5">
            <a href="#" className="hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md text-white/60 hover:border-white/10 transition-colors cursor-pointer group">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10">
              <img src="https://flagcdn.com/w40/br.png" alt="BR" className="w-full h-full object-cover" />
            </div>
            <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white/40" />
          </div>

          <Link 
            to="/hub" 
            className="ds-btn ds-btn-primary !py-2 !px-5 !text-[9px] flex items-center gap-2"
          >
            <LogIn className="w-3 h-3" />
            Acessar Spectre
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/60 hover:text-white transition-colors"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-4 right-4 mt-4 bg-obsidian-soft border border-white/5 p-8 md:hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <nav className="flex flex-col gap-6 mb-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-display text-lg text-white uppercase italic tracking-widest"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-4">
             <Link 
              to="/hub" 
              className="ds-btn ds-btn-secondary w-full"
              onClick={() => setOpen(false)}
            >
              Painel
            </Link>
            <a
              href={guildInvite}
              target="_blank"
              rel="noreferrer"
              className="ds-btn ds-btn-primary w-full"
            >
              Quero Usar o Spectre
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
