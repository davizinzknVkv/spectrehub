import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Menu, LogIn } from "lucide-react";
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
        className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-full ${
          scrolled 
            ? "bg-black/40 backdrop-blur-2xl px-6 py-3 border border-white/5 shadow-2xl" 
            : "bg-transparent px-2 py-2"
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
        <nav className="hidden md:flex items-center gap-10">
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

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/hub" 
            className="font-display text-[10px] tracking-[0.3em] text-white/40 hover:text-white transition-colors uppercase italic flex items-center gap-2"
          >
            <LogIn className="w-3 h-3" />
            Painel
          </Link>
          <a
            href={guildInvite}
            target="_blank"
            rel="noreferrer"
            className="ds-btn ds-btn-primary !py-2.5 !px-6 !text-[9px]"
          >
            Acessar Discord
          </a>
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
              Discord
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
