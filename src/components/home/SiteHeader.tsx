import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteHeaderProps {
  guildInvite: string;
}

const NAV = [
  { href: "#produtos", label: "Produtos" },
  { href: "#recursos", label: "Recursos" },
  { href: "#planos", label: "Planos" },
  { href: "#comunidade", label: "Comunidade" },
];

export function SiteHeader({ guildInvite }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-[#030303]/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8 bg-[#080808]/90 backdrop-blur-md rounded-full mt-4 border border-white/5 mx-4 sm:mx-6 shadow-2xl shadow-black/50 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <Link to="/" className="flex min-w-0 items-center gap-2.5 relative z-10">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg">
            <img
              src={logoAsset.url}
              alt="Spectre Hub"
              className="h-5 w-5 object-contain invert"
            />
          </div>
          <span className="truncate font-display text-[15px] xs:text-[16px] font-black tracking-tight text-white uppercase shrink-0">
            SpectreHub
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex relative z-10">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-bold text-white/60 transition-all duration-200 hover:text-white hover:scale-105"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-black text-white">euvictors2</span>
            <span className="text-[10px] font-medium text-white/40 -mt-1 block">@euvictors2</span>
          </div>
          
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10 ring-2 ring-[#ff0055]/20">
            <img 
              src="https://cdn.discordapp.com/avatars/291666992642883584/a_6697475d4b5b48479e0a8d468e274b78.gif?size=1024" 
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 ml-2 hover:bg-white/10 transition-colors cursor-pointer group/stats">
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-[#ff0055] to-[#7000ff] flex items-center justify-center shadow-lg shadow-[#ff0055]/20 group-hover/stats:scale-110 transition-transform">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
            <span className="text-[12px] font-black text-white tabular-nums tracking-tight">6.080</span>
          </div>

          <Link 
            to="/hub" 
            className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full font-black text-[12px] uppercase tracking-wider transition-all border border-white/10 hover:border-white/20 active:scale-95"
          >
            Sair
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/[0.07] md:hidden relative z-10"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.07] bg-[#030303]/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-[#a0a0a0] transition hover:bg-white/[0.04] hover:text-white"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
              <Link to="/hub" className="ds-btn ds-btn-secondary w-full" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-primary w-full">
                Discord
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
