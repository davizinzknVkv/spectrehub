/* Melhore o contraste e a legibilidade dos cartões de missões para que títulos, recompensas e descrições fiquem nítidos mesmo no fundo escuro. */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { PlansSection } from "@/components/home/PlansSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { LenticularCarousel } from "@/components/ui/LenticularCarousel";
import { FreeSignup } from "@/components/home/FreeSignup";
import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";

const DISCORD_INVITE = "https://discord.gg/vbYK559Jnb";
const GUILD_ID = "1511467436543709184"; // Updated from history
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPECTRE — A Elite do Discord" },
      { name: "description", content: "O ecossistema mais avançado para automação e gestão de Discord." },
      { property: "og:title", content: "SPECTRE — A Elite do Discord" },
      { property: "og:description", content: "O ecossistema mais avançado para automação e gestão de Discord." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    // Add smooth scroll for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <SiteHeader guildInvite={DISCORD_INVITE} />
      
      <main className="relative">
        <Hero 
          guildInvite={DISCORD_INVITE}
          fallbackMembers={["Spectre", "Elite", "User", "Member"]}
        />
        
        <ReasonsSection reasons={REASONS} />
        
        <div id="produtos" className="py-32 overflow-hidden bg-background relative border-y border-white/5">
          <div className="mx-auto px-6 md:px-12 mb-16">
            <div className="max-w-xl">
              <div className="font-display text-[9px] tracking-[0.5em] text-white/20 uppercase mb-6 flex items-center gap-4">
                 <div className="w-12 h-px bg-white/5" />
                 MÓDULOS IMPLANTADOS
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase leading-tight tracking-tighter">
                Explore a <br/><span className="text-primary italic">Infraestrutura.</span>
              </h2>
            </div>
          </div>
          <LenticularCarousel items={PRODUCTS} />
        </div>

        <div id="como-funciona" className="relative">
          <FreeSignup guildInvite={DISCORD_INVITE} />
        </div>

        <CommunitySection 
          widgetUrl={WIDGET_URL}
          guildId={GUILD_ID}
          guildInvite={DISCORD_INVITE}
          fallbackMembers={["Spectre", "Elite", "Admin", "Mod"]}
        />
        
        <div className="relative border-y border-white/5">
           <PlansSection plans={PLANS} />
        </div>

        <FinalCta guildInvite={DISCORD_INVITE} />
      </main>

      <SiteFooter guildInvite={DISCORD_INVITE} />
    </div>
  );
}
