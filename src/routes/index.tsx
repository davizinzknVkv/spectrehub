/* no perfil onde loga coloca isso tb */

1. Auditoria Ofensiva (Vulnerability Assessment):

OWASP Top 10: Varra o código em busca de injeções (SQLi, NoSQL, Command), Broken Access Control, e falhas de autenticação.
XSS & CSRF: Identifique superfícies de ataque para Cross-Site Scripting (Refletido, Armazenado e DOM-based) e garanta a presença de proteções contra Cross-Site Request Forgery.
Sensitive Data Exposure: Localize chaves de API, segredos, ou PII (Informações Pessoais Identificáveis) expostas no código ou em logs. Verifique a força dos algoritmos de hashing e criptografia utilizados.
2. Defesa de Camada de Aplicação (Hardening):

Authorization & Authentication: Valide se o sistema segue o princípio do "Menor Privilégio" (Least Privilege). Garanta que a validação de permissões ocorra no Server-Side e não apenas na UI.
Input Sanitization: Implemente uma camada rigorosa de sanitização e validação de tipos para todas as entradas de usuário, utilizando esquemas de validação (Zod, Joi, etc.) ou tipos fortes.
Security Headers: Configure ou recomende headers de segurança críticos (CSP - Content Security Policy, HSTS, X-Frame-Options, X-Content-Type-Options).
3. Resiliência de Infraestrutura e Banco de Dados:

RLS & DB Security: Se houver banco de dados (ex: Supabase/PostgreSQL), audite as políticas de Row Level Security (RLS) para garantir que um usuário nunca acesse dados de outro.
Rate Limiting & DoS: Implemente ou sugira mecanismos de controle de taxa (Rate Limit) para prevenir ataques de força bruta ou negação de serviço.
Dependency Audit: Analise bibliotecas externas em busca de vulnerabilidades conhecidas (CVEs) e sugira atualizações ou substituições seguras.
4. Relatório de Remediação:

Para cada falha encontrada: Classifique a severidade (Baixa, Média, Alta, Crítica), descreva o vetor de ataque e forneça o código corrigido.
Explique o impacto da correção na lógica de negócio e como validar que a vulnerabilidade foi mitigada.
Instrução de Execução: Não ignore falhas "teóricas". Trate cada brecha como um potencial ponto de entrada para um ataque real. Entregue um código blindado contra os ataques mais modernos da web. */
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { PlansSection } from "@/components/home/PlansSection";
import { FreeSignup } from "@/components/home/FreeSignup";
import { CommunitySection } from "@/components/home/CommunitySection";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/home/SiteFooter";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

const TITLE = "Spectre Hub — Elite Discord Automation";
const DESCRIPTION =
  "Domine o Discord com o Spectre Hub. Automação de quests, sniper de nicks raros e ferramentas de elite em uma infraestrutura obsidian premium.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://spectrehub.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://spectrehub.lovable.app/" },
      { rel: "preload", as: "image", href: logoAsset.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1324600310286516255";
const GUILD_INVITE = "https://discord.gg/vbYK559Jnb";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const FALLBACK_MEMBERS = [
  "davizinzkn",
  "rd9m",
  "fuam",
  "felipe",
  "biell",
  "lilith",
  "neo",
  "kaz",
  "mira",
  "juno",
  "hex",
];

function Index() {
  const { t } = useTranslation();
  const [liveMembers, setLiveMembers] = useState<{ id: string; name: string; avatar: string | null }[]>([]);
  
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(WIDGET_URL, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (j?.members && Array.isArray(j.members)) {
          setLiveMembers(j.members.map((m: any) => ({
            id: m.id,
            name: m.username,
            avatar: m.avatar_url
          })));
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  
  /* REDESIGN DA DOCUMENTAÇÃO — SITE PÚBLICO E INDEPENDENTE */

  return (
    <div
      id="topo"
      className="relative min-h-screen bg-obsidian font-sans text-foreground antialiased selection:bg-primary/30 flex flex-col"
    >
      <AnimatedBackground />

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main className="relative z-10 flex-1">
        <Hero 
          guildInvite={GUILD_INVITE} 
          fallbackMembers={FALLBACK_MEMBERS} 
          liveMembers={liveMembers}
        />
        
        <SocialProof widgetUrl={WIDGET_URL} products={PRODUCTS} />
        <div id="produtos">
          <ProductsSection products={PRODUCTS} />
        </div>
        <div id="como-funciona">
          <ReasonsSection reasons={REASONS} />
        </div>
        <div id="planos">
          <PlansSection plans={PLANS} />
        </div>
        <FreeSignup guildInvite={GUILD_INVITE} />
        <div id="comunidade">
          <CommunitySection 
            widgetUrl={WIDGET_URL} 
            guildId={GUILD_ID} 
            guildInvite={GUILD_INVITE} 
            fallbackMembers={FALLBACK_MEMBERS} 
          />
        </div>
        <FinalCta guildInvite={GUILD_INVITE} />
      </main>

      <SiteFooter guildInvite={GUILD_INVITE} />
    </div>
  );
}
