/**
 * Spectre Hub — Industrial Design System
 * 
 * Mix: BlackNetwork (Obsidian + Pink) & HubNetwork (High Contrast + Industrial).
 * Theme: Midnight Obsidian (#030303), Spectre Pink (#ff0055).
 */

import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
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
      { property: "og:url", content: "https://neighbordhubdc.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://neighbordhubdc.lovable.app/" },
      { rel: "preload", as: "image", href: logoAsset.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1511467436543709184";
const GUILD_INVITE = "https://discord.gg/JK7cC9je87";
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
  return (
    <div
      id="topo"
      className="relative min-h-screen overflow-x-hidden bg-[#030303] font-sans text-[#f5f5f5] antialiased selection:bg-[#ff0055]/30"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
        <div className="absolute inset-0 bg-[#030303]/60 backdrop-blur-[120px]" />
      </div>

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main>
        <Hero guildInvite={GUILD_INVITE} fallbackMembers={FALLBACK_MEMBERS} />
        <SocialProof widgetUrl={WIDGET_URL} products={PRODUCTS} />
        <ProductsSection products={PRODUCTS} />
        <ReasonsSection reasons={REASONS} />
        <PlansSection plans={PLANS} />
        <FreeSignup guildInvite={GUILD_INVITE} />
        <CommunitySection 
          widgetUrl={WIDGET_URL} 
          guildId={GUILD_ID} 
          guildInvite={GUILD_INVITE} 
          fallbackMembers={FALLBACK_MEMBERS} 
        />
        <FinalCta guildInvite={GUILD_INVITE} />
      </main>

      <SiteFooter guildInvite={GUILD_INVITE} />
    </div>
  );
}
