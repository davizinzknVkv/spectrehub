import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Menu, LogIn, Search, Github, Youtube, Instagram, ChevronDown, MessageSquare, Languages } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";

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
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img
              src={logoAsset.url}
              alt="Spectre Hub"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(255,0,85,0.3)]"
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
            <Link
              to="/docs"
              className="font-display text-[10px] tracking-[0.3em] text-white/40 hover:text-white transition-colors uppercase italic"
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Actions & Socials (image-81.png) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 text-white/40 pr-6 border-r border-white/5">
            <a href="https://discord.gg/spectrehub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
            <a href="https://github.com/davizinzkn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="https://youtube.com/@ODAVIZINZKN" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="https://instagram.com/davizinzkn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md text-white/60 hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10">
                  <img src={currentLang.flag} alt={currentLang.label} className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white/40" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-obsidian border-white/5 rounded-none text-white/60">
              <DropdownMenuLabel className="font-display text-[9px] uppercase tracking-widest italic py-3 flex items-center gap-2">
                <Languages className="w-3 h-3 text-spectre-pink" /> {t('common.selectLanguage')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={async () => {
                    await i18n.changeLanguage(lang.code);
                  }}
                  className="focus:bg-spectre-pink focus:text-white cursor-pointer py-2.5 rounded-none flex items-center gap-3"
                >
                  <img src={lang.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
                  <span className="font-display text-[10px] uppercase italic tracking-widest">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/hub" 
            className="ds-btn ds-btn-primary !py-2 !px-5 !text-[9px] flex items-center gap-2"
          >
            <LogIn className="w-3 h-3" />
            {t('common.accessHub')}
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          <div className="flex justify-between items-center mb-12">
             <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase flex items-center gap-2">
               <span className="w-8 h-px bg-spectre-pink/30" />
               Menu
             </div>
             <button onClick={() => setOpen(false)} className="w-10 h-10 border border-white/10 flex items-center justify-center">
               <X className="w-5 h-5 text-white/40" />
             </button>
          </div>

          <nav className="flex flex-col gap-8 mb-auto">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-white uppercase italic tracking-tighter hover:text-spectre-pink transition-colors"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="flex flex-col gap-4 col-span-2">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/5 text-white/60">
                    <div className="flex items-center gap-3">
                      <img src={currentLang.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                      <span className="font-display text-[10px] uppercase italic tracking-widest">{currentLang.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-4rem)] bg-obsidian border-white/5 rounded-none">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code}
                      onClick={async () => {
                        await i18n.changeLanguage(lang.code);
                        setOpen(false);
                      }}
                      className="focus:bg-spectre-pink focus:text-white py-4 flex items-center gap-3"
                    >
                      <img src={lang.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />
                      <span className="font-display text-[11px] uppercase italic tracking-widest">{lang.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to="/hub" 
                className="ds-btn ds-btn-secondary w-full py-5 text-center"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <a
                href={guildInvite}
                target="_blank"
                rel="noreferrer"
                className="ds-btn ds-btn-primary w-full py-5 text-center"
              >
                {t('common.getStarted')}
              </a>
            </div>
            
            <div className="flex items-center gap-6 text-white/20 mt-8">
              <a href="https://discord.gg/spectrehub" target="_blank" rel="noopener noreferrer"><MessageSquare className="w-5 h-5" /></a>
              <a href="https://github.com/davizinzkn" target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5" /></a>
              <a href="https://instagram.com/davizinzkn" target="_blank" rel="noopener noreferrer"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
