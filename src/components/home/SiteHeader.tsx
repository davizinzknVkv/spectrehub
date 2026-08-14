import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteHeaderProps {
  guildInvite: string;
}

const NAV = [
  { href: "#produtos", label: "produtos" },
  { href: "#recursos", label: "recursos" },
  { href: "#planos", label: "planos" },
  { href: "#comunidade", label: "comunidade" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
        ? "py-2"
        : "py-4"
      }`}
    >
      <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8 transition-all duration-500 ${
        scrolled 
          ? "bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-2xl shadow-black/50 mx-4 sm:mx-6" 
          : "bg-transparent border-transparent mx-4 sm:mx-6"
      } relative group overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <Link to="/" className="flex min-w-0 items-center gap-2.5 relative z-10">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg shrink-0">
            <img
              src={logoAsset.url}
              alt="Spectre Hub"
              className="h-5 w-5 object-contain invert"
            />
          </div>
          <span className="truncate font-display text-[15px] xs:text-[16px] font-black tracking-tight text-white uppercase shrink-0">
            SPECTRE | HUB
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2 z-10">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-bold text-white/50 transition-all duration-300 hover:text-white hover:scale-110 tracking-widest uppercase"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex relative z-10">
          <Link 
            to="/hub" 
            className="ds-btn ds-btn-secondary !h-10 !px-6 !text-[12px]"
          >
            Entrar
          </Link>
          <a
            href={guildInvite}
            target="_blank"
            rel="noreferrer"
            className="ds-btn ds-btn-primary !h-10 !px-6 !text-[12px]"
          >
            Comunidade
          </a>
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
        <div className="absolute top-full left-4 right-4 mt-2 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#030303]/95 backdrop-blur-xl md:hidden">
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
