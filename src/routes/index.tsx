import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useInView } from "@/components/home/hooks";
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
  const [ref] = useInView<HTMLDivElement>();


  return (
    <div
      id="topo"
      className="relative min-h-screen overflow-x-hidden bg-obsidian font-sans text-white antialiased selection:bg-spectre-pink/30 flex flex-col"
    >
      {/* Global Background Grid & Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main ref={ref} className="relative z-10">
        <Hero guildInvite={GUILD_INVITE} fallbackMembers={FALLBACK_MEMBERS} />
        
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
