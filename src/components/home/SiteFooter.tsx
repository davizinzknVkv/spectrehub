import React from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteFooterProps {
  guildInvite: string;
}

export function SiteFooter({ guildInvite }: SiteFooterProps) {
  return (
    <footer className="bg-obsidian pt-32 pb-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-20 mb-24">
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img
                src={logoAsset.url}
                alt="Spectre Hub"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-2xl tracking-tighter text-white uppercase italic">
                Spectre <span className="text-spectre-pink">Hub</span>
              </span>
            </Link>
            <p className="font-sans text-white/30 leading-relaxed text-sm uppercase tracking-widest mb-10">
              A elite da automação para Discord. Desenvolvido para servidores que buscam domínio absoluto e performance inabalável.
            </p>
            <div className="flex gap-4">
               {["Twitter", "Discord", "Docs"].map(social => (
                 <a key={social} href="#" className="font-display text-[9px] tracking-[0.2em] text-white/20 hover:text-spectre-pink transition-colors uppercase italic">
                   {social}
                 </a>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-24">
            <div>
              <h3 className="font-display text-[10px] tracking-[0.3em] text-white uppercase italic mb-8">Sistemas</h3>
              <ul className="space-y-4">
                {["Auto Quests", "Optimizer", "Nicks-Gun", "Farms"].map(item => (
                  <li key={item}>
                    <a href="#" className="font-sans text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-[10px] tracking-[0.3em] text-white uppercase italic mb-8">Navegação</h3>
              <ul className="space-y-4">
                {["Início", "Planos", "Comunidade", "Painel"].map(item => (
                  <li key={item}>
                    <a href="#" className="font-sans text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-display text-[10px] tracking-[0.3em] text-white uppercase italic mb-8">Legal</h3>
              <ul className="space-y-4">
                {["Privacidade", "Termos"].map(item => (
                  <li key={item}>
                    <a href="#" className="font-sans text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-20">
          <div className="font-display text-[9px] tracking-[0.2em] uppercase italic">
             Spectre Hub &copy; 2026. Todos os direitos reservados.
          </div>
          <div className="font-display text-[9px] tracking-[0.2em] uppercase italic">
             Property of Spectre Group
          </div>
        </div>
      </div>
    </footer>
  );
}
