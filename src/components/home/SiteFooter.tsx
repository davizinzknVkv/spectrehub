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
    <footer className="bg-[#030303] pt-48 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
      
      <div className="mx-auto max-w-7xl px-6 md:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-24 mb-32">
          <div className="lg:col-span-5 max-w-sm space-y-12">
            <Link to="/" className="flex items-center gap-4">
              <img
                src={logoAsset.url}
                alt="SPECTRE"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display text-2xl tracking-[0.2em] text-white uppercase italic">
                SPECTRE
              </span>
            </Link>
            <div className="border-l border-white/5 pl-8">
              <p className="font-mono text-white/20 leading-loose text-[10px] uppercase tracking-[0.2em] italic">
                {t('footer.slogan')}
              </p>
            </div>
            <div className="flex gap-10">
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
                    className="font-mono text-[9px] tracking-[0.5em] text-white/10 hover:text-primary transition-all duration-500 uppercase"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary" />
                <h3 className="font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">LISTA DE SISTEMAS</h3>
              </div>
              <ul className="space-y-6">
                {["Missões", "Otimizador", "Nicks Sniper", "Controle"].map(item => (
                  <li key={item}>
                    <a href="#" className="font-mono text-[9px] text-white/10 hover:text-white transition-all duration-500 uppercase tracking-[0.3em]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                <h3 className="font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">MENU PRINCIPAL</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { label: t('footer.navHome'), href: "#topo" },
                  { label: t('footer.navPlans'), href: "#planos" },
                  { label: t('footer.navDashboard'), href: "/hub" }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="font-mono text-[9px] text-white/10 hover:text-white transition-all duration-500 uppercase tracking-[0.3em]">
                       {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                <h3 className="font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">PROTOCOLOS LEGAIS</h3>
              </div>
              <ul className="space-y-6">
                {[t('footer.legalPrivacy'), t('footer.legalTerms'), "DOCS"].map(item => (
                  <li key={item}>
                    <a href={item === "DOCS" ? "/docs" : "#"} className="font-mono text-[9px] text-white/10 hover:text-white transition-all duration-500 uppercase tracking-[0.3em]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="font-mono text-[8px] tracking-[0.6em] text-white/10 uppercase">
             {t('footer.rights')}
          </div>
          <div className="flex items-center gap-16">
            <div className="font-mono text-[8px] tracking-[0.5em] text-emerald-500 flex items-center gap-4 uppercase">
               <span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
               SISTEMA ATIVO NÓ 1
            </div>
            <div className="font-mono text-[8px] tracking-[0.5em] text-white/10 uppercase">
               PROPRIEDADE SPECTRE ELITE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
