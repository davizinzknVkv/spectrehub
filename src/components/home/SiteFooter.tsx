import React from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

interface SiteFooterProps {
  guildInvite: string;
}


function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ guildInvite }: SiteFooterProps) {
  return (
    <footer className="bg-[#030303] border-t border-white/10 pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-20">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoAsset.url}
                alt="Spectre Hub"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
              <span className="font-display text-[20px] font-[900] tracking-tighter text-white uppercase italic">
                SPECTRE<span className="text-[#ff0055]">HUB</span>
              </span>
            </Link>
            <p className="mt-10 text-[11px] font-black text-white/30 uppercase tracking-[0.3em] leading-[1.8]">
              DOMÍNIO E TECNOLOGIA
              <br />
              FEITO POR ELITES, PARA SERVIDORES QUE BUSCAM A PERFEIÇÃO.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <FooterCol
              title="SISTEMA"
              links={[
                { label: "Sistemas", href: "#produtos" },
                { label: "Recursos", href: "#recursos" },
                { label: "Planos", href: "#planos" },
              ]}
            />
            <FooterCol
              title="PAINEL"
              links={[
                { label: "Entrar", href: "/hub" },
                { label: "Comunidade", href: guildInvite, external: true },
              ]}
            />
            <FooterCol
              title="LEGAL"
              links={[
                { label: "Privacidade", href: "#" },
                { label: "Termos", href: "#" },
              ]}
            />
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-[#444] uppercase tracking-[0.25em]">
          <div className="flex items-center gap-8">
            <span>SPECTRE HUB</span>
            <span className="opacity-20">//</span>
            <span>PROPERTY OF SPECTRE. ALL CREATIVE RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
