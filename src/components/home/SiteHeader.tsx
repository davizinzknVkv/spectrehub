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
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <div 
        className={`mx-auto max-w-7xl w-full flex items-center justify-between transition-all duration-500 border border-white/5 px-6 py-2 rounded-full ${
          scrolled 
            ? "bg-[#0A0A0D]/80 backdrop-blur-xl shadow-2xl" 
            : "bg-[#0A0A0D]/40 backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="SPECTRE"
            className="w-6 h-6 object-contain"
          />
          <span className="font-display text-sm tracking-[0.2em] text-white uppercase hidden sm:block">
            Spectre <span className="text-primary opacity-50">//</span> Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 flex-1 justify-center">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-display text-[9px] tracking-[0.4em] text-white/30 hover:text-primary transition-colors uppercase"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/docs"
            className="font-display text-[9px] tracking-[0.4em] text-white/30 hover:text-primary transition-colors uppercase"
          >
            Docs
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
                <img src={currentLang.flag} alt={currentLang.label} className="w-4 h-2.5 object-cover" />
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#030303] border-white/5 text-white/60">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={async () => i18n.changeLanguage(lang.code)}
                  className="focus:bg-primary/10 focus:text-primary cursor-pointer text-[9px] uppercase tracking-widest px-4 py-3"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/hub" 
            className="ds-btn ds-btn-primary !py-2 !px-5 !min-h-0 !h-9 !rounded-full text-[10px] flex items-center gap-2 group"
          >
              ACESSAR SPECTRE
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
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
            className="fixed inset-0 z-[60] bg-[#030303] p-12 flex flex-col md:hidden"
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
