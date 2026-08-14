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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12 bg-[#080808]/90 backdrop-blur-md rounded-full mt-4 border border-white/5 mx-4 sm:mx-6 shadow-2xl shadow-black/50">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="Spectre Hub"
            className="h-8 w-8 object-contain shrink-0"
          />
          <span className="truncate font-display text-[15px] xs:text-[16px] font-extrabold tracking-tighter text-white uppercase shrink-0">
            Spectre<span className="opacity-40 ml-1 font-light">|</span><span className="text-[#ff0055] ml-1">HUB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-medium text-[#8a8a8a] transition-colors duration-200 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/hub" className="text-[13px] font-medium text-white hover:opacity-80 transition-opacity">
            Log in
          </Link>
          <a 
            href={guildInvite} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-white/90 transition-colors"
          >
            <ArrowRight className="h-4 w-4" /> Download
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/[0.07] md:hidden"
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
