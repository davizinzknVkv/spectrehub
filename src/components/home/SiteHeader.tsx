import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Menu, LogIn, Search, Github, Youtube, Instagram, ChevronDown, ChevronRight, MessageSquare, Languages } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoAsset from "@/assets/logo-spectre.png.asset.json";

import brFlag from "@/assets/flags/brazil.png.asset.json";
import usFlag from "@/assets/flags/usa.png.asset.json";
import esFlag from "@/assets/flags/spain.png.asset.json";
import deFlag from "@/assets/flags/germany.png.asset.json";
import itFlag from "@/assets/flags/italy.png.asset.json";
import ruFlag from "@/assets/flags/russia.png.asset.json";

interface SiteHeaderProps {
  guildInvite: string;
}

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: brFlag.url },
  { code: 'en', label: 'English', flag: usFlag.url },
  { code: 'es', label: 'Español', flag: esFlag.url },
  { code: 'de', label: 'Deutsch', flag: deFlag.url },
  { code: 'it', label: 'Italiano', flag: itFlag.url },
  { code: 'ru', label: 'Русский', flag: ruFlag.url },
];

export function SiteHeader({ guildInvite }: SiteHeaderProps) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: "#produtos", label: t('nav.systems') },
    { href: "#como-funciona", label: t('nav.method') },
    { href: "#planos", label: t('nav.plans') },
    { href: "#comunidade", label: t('nav.community') },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] border-b transition-colors duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-white/[0.06]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="bn-container h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logoAsset.url}
            alt="Black Network"
            className="w-7 h-7 object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight text-foreground hidden sm:block">
            Black Network
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/docs"
            className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Idioma" className="flex items-center gap-2 h-9 px-3 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors">
                <img src={currentLang.flag} alt={currentLang.label} className="w-4 h-2.5 object-cover rounded-[2px]" />
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-white/[0.08] text-foreground-muted rounded-xl">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={async () => i18n.changeLanguage(lang.code)}
                  className="focus:bg-primary/15 focus:text-foreground cursor-pointer text-sm px-3 py-2 rounded-lg"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/hub" 
            className="ds-btn ds-btn-primary !min-h-0 !h-10 !px-5 !rounded-xl text-sm group"
          >
              Acessar plataforma
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/60 hover:text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#0d0f14] p-12 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-24">
               <span className="font-display text-[9px] tracking-[0.5em] text-primary uppercase">NAVEGAÇÃO</span>
               <button onClick={() => setOpen(false)}>
                 <X className="w-6 h-6 text-white" />
               </button>
            </div>

            <nav className="flex flex-col gap-12 mb-auto">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="pt-12 border-t border-white/5">
              <Link 
                to="/hub" 
                className="ds-btn ds-btn-primary w-full py-6 mb-4"
                onClick={() => setOpen(false)}
              >
                ACESSAR SPECTRE
              </Link>
              <div className="flex items-center gap-8 opacity-20">
                <a href="https://discord.gg/spectrehub"><MessageSquare className="w-5 h-5" /></a>
                <a href="https://github.com/davizinzkn"><Github className="w-5 h-5" /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
