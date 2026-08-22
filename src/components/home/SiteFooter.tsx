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
    <footer className="bg-black pt-32 pb-16 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-20 mb-24">
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                <img
                  src={logoAsset.url}
                  alt="SPECTRE"
                  className="w-12 h-12 object-contain relative z-10 transition-transform duration-500 group-hover:rotate-12"
                />
              </div>
              <span className="font-display text-3xl tracking-tighter text-white uppercase italic">
                Spectre <span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="font-sans text-white/30 leading-relaxed text-sm uppercase tracking-[0.2em] mb-10 max-w-xs">
              {t('footer.slogan')}
            </p>
            <div className="flex gap-6">
               {[
                 { label: "INSTAGRAM", href: "https://instagram.com/davizinzkn" },
                 { label: "YOUTUBE", href: "https://youtube.com/@ODAVIZINZKN" },
                 { label: "DISCORD", href: "https://discord.gg/vbYK559Jnb" }
                ].map(social => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-display text-[9px] tracking-[0.3em] text-white/20 hover:text-primary transition-all hover:translate-y-[-2px] uppercase italic border-b border-white/0 hover:border-primary/30 pb-1"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-[11px] tracking-[0.4em] text-primary uppercase italic mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-primary/30" />
              {t('nav.systems')}
            </h3>
            <ul className="space-y-4">
              {["AUTO QUESTS", "OPTIMIZER", "NICKS-GUN", "SERVER CONTROL"].map(item => (
                <li key={item}>
                  <a href="#" className="font-display text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] italic flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary/0 group-hover:bg-primary transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] tracking-[0.4em] text-white/40 uppercase italic mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-white/10" />
              MENU
            </h3>
            <ul className="space-y-4">
              {[
                { label: t('footer.navHome'), href: "#topo" },
                { label: t('footer.navPlans'), href: "#planos" },
                { label: t('footer.navCommunity'), href: "#comunidade" },
                { label: t('footer.navDashboard'), href: "/hub" }
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="font-display text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] italic flex items-center gap-2 group">
                     <span className="w-1 h-1 bg-white/0 group-hover:bg-white/40 transition-all" />
                     {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] tracking-[0.4em] text-white/40 uppercase italic mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-white/10" />
              LEGAL
            </h3>
            <ul className="space-y-4">
              {[t('footer.legalPrivacy'), t('footer.legalTerms'), "DOCUMENTAÇÃO"].map(item => (
                <li key={item}>
                  <a href={item === "DOCUMENTAÇÃO" ? "/docs" : "#"} className="font-display text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] italic flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-white/0 group-hover:bg-white/40 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display text-[9px] tracking-[0.3em] text-white/20 uppercase italic">
             {t('footer.rights')}
          </div>
          <div className="flex items-center gap-6">
            <div className="font-display text-[9px] tracking-[0.3em] text-white/20 uppercase italic flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500/20 flex items-center justify-center">
                 <span className="w-1 h-1 rounded-full bg-green-500" />
               </span>
               SYSTEMS OPERATIONAL
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="font-display text-[9px] tracking-[0.3em] text-white/10 uppercase italic">
               PROPERTY OF SPECTRE GROUP
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
