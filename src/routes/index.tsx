/**
 * Você é um Diretor de Arte e Desenvolvedor Frontend de elite, reconhecido por criar interfaces premiadas (nível Awwwards/Apple). Seu objetivo é transformar a página atual em uma experiência visual "Premium", focada em sofisticação, minimalismo moderno e fluidez absoluta.
 *
 * 1. Refino Estético e Identidade Visual (Premium Look):
 *
 * Color Theory & Depth: Aplique uma paleta de cores sofisticada (tonalidades sóbrias com acentos vibrantes calculados). Implemente profundidade usando camadas de sombras suaves (Soft Shadows), Glassmorphism (blur de fundo) e gradientes lineares sutis que guiam o olhar.
 * Typography Engine: Reestruture a hierarquia tipográfica. Utilize escalas fluídas, ajuste o line-height para máxima legibilidade e o letter-spacing para um aspecto editorial. Garanta que o contraste entre títulos (Bold/Display) e corpo de texto seja elegante.
 * 2. Precisão de Layout e Espaçamento (The 8pt Grid):
 *
 * Visual Rhythm: Aplique um sistema de grade rigoroso (8px grid). Corrija inconsistências de padding e margin. Utilize o "espaço em branco" (White Space) como elemento de design para permitir que o conteúdo "respire" e reduzir a carga cognitiva.
 * Layout Modernization: Se apropriado, implemente estruturas contemporâneas como Bento Grids, seções com Full-height impactantes e alinhamentos assimétricos que mantenham o equilíbrio visual.
 * 3. Micro-interações e Motion Design (The "Feel"):
 *
 * Smooth Transitions: Adicione micro-interações em botões, links e cards (hover effects com cubic-bezier para movimentos naturais).
 * Staggered Animations: Implemente entradas de conteúdo suaves (fade-in, slide-up) com atrasos escalonados (stagger) para criar uma sensação de refinamento tecnológico enquanto o usuário navega.
 * Feedback Visual: Garanta que cada ação do usuário (clique, hover, scroll) tenha uma resposta visual fluida e elegante, elevando a percepção de qualidade do software.
 * 4. Limpeza de Código e Refatoração CSS:
 *
 * CSS Architecture: Elimine estilos redundantes, corrija "hacks" de CSS e unifique variáveis de design (tokens). Use Tailwind CSS ou CSS moderno de forma modular e altamente organizada.
 * Pixel Perfection: Corrija pequenos desalinhamentos, bordas mal renderizadas ou elementos sobrepostos. Garanta que o layout seja impecável em todas as resoluções (Retina-ready).
 * Diretriz de Execução: Analise a página atual como um crítico de design. Identifique o que a torna "comum" e aplique as mudanças necessárias para torná-la "extraordinária". O resultado final deve ser uma página que não apenas funcione perfeitamente, mas que transmita autoridade, luxo e atenção obsessiva aos detalhes.
 */
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
    <div className="min-h-screen bg-[#030303] selection:bg-primary/30 selection:text-white">
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
                 DEPLOYED_MODULES
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
        
        <div className="relative border-y border-border/5">
           <PlansSection plans={PLANS} />
        </div>

        <FinalCta guildInvite={DISCORD_INVITE} />
      </main>

      <SiteFooter guildInvite={DISCORD_INVITE} />
    </div>
  );
}
