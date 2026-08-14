import React from "react";
import { Link } from "@tanstack/react-router";

interface SiteFooterProps {
  guildInvite: string;
}

const logoAsset = { url: "/logo.png" };

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
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-16">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logoAsset.url}
                alt="Spectre Hub"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-display text-[16px] font-extrabold tracking-tighter text-white uppercase">
                Spectre<span className="opacity-40 ml-1.5 font-light">|</span><span className="text-[#ff0055] ml-1.5">HUB</span>
              </span>
            </Link>
            <p className="mt-6 text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] leading-loose">
              INOVAÇÃO · PRODUTO & TECNOLOGIA
              <br />
              Feito por jogadores, para servidores que levam a sério.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterCol
              title="HUB"
              links={[
                { label: "Sistemas", href: "#produtos" },
                { label: "Por que HUB", href: "#recursos" },
                { label: "Servidores", href: "#comunidade" },
              ]}
            />
            <FooterCol
              title="CLIENTE"
              links={[
                { label: "Entrar", href: "/hub" },
                { label: "Abrir ticket", href: guildInvite, external: true },
              ]}
            />
            <FooterCol
              title="COMUNIDADE"
              links={[
                { label: "Discord", href: guildInvite, external: true },
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
