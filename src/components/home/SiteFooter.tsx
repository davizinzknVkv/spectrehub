import React from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteFooterProps {
  guildInvite: string;
}

export function SiteFooter({ guildInvite }: SiteFooterProps) {
  const { t } = useTranslation();

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
              {t('footer.slogan')}
            </p>
            <div className="flex gap-4">
               {[
                 { label: "YouTube", href: "https://youtube.com/@ODAVIZINZKN" },
                 { label: "Instagram", href: "https://instagram.com/davizinzkn" },
                 { label: "Discord", href: "https://discord.gg/spectrehub" },
                 { label: "Docs", href: "#" }
               ].map(social => (
                 <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="font-display text-[9px] tracking-[0.2em] text-white/20 hover:text-spectre-pink transition-colors uppercase italic">
                   {social.label}
                 </a>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-24">
            <div>
              <h3 className="font-display text-[10px] tracking-[0.3em] text-white uppercase italic mb-8">{t('nav.systems')}</h3>
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
                {[
                  { label: t('footer.navHome'), href: "#topo" },
                  { label: t('footer.navPlans'), href: "#planos" },
                  { label: t('footer.navCommunity'), href: "#comunidade" },
                  { label: t('footer.navDashboard'), href: "/hub" }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="font-sans text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">{item.label}</a>
                  </li>
                ))}
              </ul>

            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-display text-[10px] tracking-[0.3em] text-white uppercase italic mb-8">Legal</h3>
              <ul className="space-y-4">
                {[t('footer.legalPrivacy'), t('footer.legalTerms')].map(item => (
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
             {t('footer.rights')}
          </div>
          <div className="font-display text-[9px] tracking-[0.2em] uppercase italic">
             Property of Spectre Group
          </div>
        </div>
      </div>
    </footer>
  );
}
