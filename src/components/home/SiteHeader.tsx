import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X, Menu } from "lucide-react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

const NAV = [
  { label: "Início", href: "#topo" },
  { label: "Produtos", href: "#produtos" },
  { label: "Recursos", href: "#recursos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Comunidade", href: "#comunidade" },
];

interface SiteHeaderProps {
  guildInvite: string;
}

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
          ? "border-b border-white/[0.07] bg-[#030303]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[11px] font-bold text-[#8a8a8a] transition-colors duration-200 hover:text-white uppercase tracking-[0.2em]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/hub" className="ds-btn ds-btn-secondary">
            <ArrowRight className="h-3.5 w-3.5" /> Entrar
          </Link>
          <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-primary">
            <ArrowRight className="h-3.5 w-3.5" /> Abrir Ticket
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
