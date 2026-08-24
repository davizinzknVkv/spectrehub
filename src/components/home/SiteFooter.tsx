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
    <footer className="bg-background pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 max-w-sm">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img
                src={logoAsset.url}
                alt="SPECTRE"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display text-xl tracking-[0.2em] text-white uppercase">
                Spectre <span className="text-primary opacity-50">//</span> Hub
              </span>
            </Link>
            <p className="font-sans text-white/30 leading-relaxed text-[11px] uppercase tracking-[0.2em] mb-12">
              {t('footer.slogan')}
            </p>
            <div className="flex gap-8">
               {[
                 { label: "IG", href: "https://instagram.com/davizinzkn" },
                 { label: "YT", href: "https://youtube.com/@ODAVIZINZKN" },
                 { label: "DC", href: "https://discord.gg/vbYK559Jnb" }
                ].map(social => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-display text-[9px] tracking-[0.5em] text-white/20 hover:text-primary transition-colors uppercase"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-display text-[9px] tracking-[0.4em] text-primary uppercase mb-10 block">SYSTEMS_LIST</h3>
              <ul className="space-y-4">
                {["AUTO_QUESTS", "OPTIMIZER", "NICKS_GUN", "SERVER_CTL"].map(item => (
                  <li key={item}>
                    <a href="#" className="font-display text-[9px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[9px] tracking-[0.4em] text-white/20 uppercase mb-10 block">ROOT_MENU</h3>
              <ul className="space-y-4">
                {[
                  { label: t('footer.navHome'), href: "#topo" },
                  { label: t('footer.navPlans'), href: "#planos" },
                  { label: t('footer.navDashboard'), href: "/hub" }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="font-display text-[9px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
                       {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[9px] tracking-[0.4em] text-white/20 uppercase mb-10 block">LEGAL_PROTO</h3>
              <ul className="space-y-4">
                {[t('footer.legalPrivacy'), t('footer.legalTerms'), "DOCS"].map(item => (
                  <li key={item}>
                    <a href={item === "DOCS" ? "/docs" : "#"} className="font-display text-[9px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
          <div className="font-display text-[8px] tracking-[0.5em] text-white uppercase">
             {t('footer.rights')}
          </div>
          <div className="flex items-center gap-12">
            <div className="font-display text-[8px] tracking-[0.4em] text-white uppercase flex items-center gap-3">
               <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
               SYS_ACTIVE
            </div>
            <div className="font-display text-[8px] tracking-[0.4em] text-white uppercase">
               PROP_SPECTRE_GRP
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
