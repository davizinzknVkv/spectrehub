/* no perfil onde loga coloca isso tb */
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
import { PRODUCTS } from "@/components/home/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spectre Hub — A Elite do Discord" },
      { name: "description", content: "O ecossistema mais avançado para automação e gestão de Discord." },
      { property: "og:title", content: "Spectre Hub — A Elite do Discord" },
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
      <SiteHeader />
      
      <main className="relative">
        <Hero 
          guildInvite="https://discord.gg/vbYK559Jnb"
          fallbackMembers={["Spectre", "Spectre", "Spectre", "Spectre"]}
        />
        
        <ReasonsSection />
        
        <div className="py-24 sm:py-32 overflow-hidden bg-background relative border-y border-border/5">
          <div className="container mx-auto px-6 lg:px-12 mb-16">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase leading-none tracking-tighter mb-4">
                Explore os <span className="text-primary">Sistemas</span>
              </h2>
              <p className="text-foreground-muted font-sans text-lg max-w-xl">
                Tecnologia de ponta em cada módulo. Descubra o poder da automação industrial.
              </p>
            </div>
          </div>
          <LenticularCarousel items={PRODUCTS} />
        </div>

        <div className="py-24 sm:py-32 bg-background-secondary/30 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl sm:text-6xl text-white uppercase leading-none tracking-tighter mb-6">
                  Inicie seu <span className="text-primary">Protocolo</span>
                </h2>
                <p className="text-foreground-muted font-sans text-lg mb-10 leading-relaxed">
                  Cadastre-se no nível Free para receber acesso imediato ao terminal básico. 
                  Siga as instruções de validação via ticket no servidor oficial.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">01</div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wider">Cadastro Rápido</h4>
                      <p className="text-xs text-foreground-muted mt-1">Gere seu código de identificação único.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">02</div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white uppercase tracking-wider">Validação Discord</h4>
                      <p className="text-xs text-foreground-muted mt-1">Abra um ticket e informe seu protocolo.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <FreeSignup />
              </div>
            </div>
          </div>
        </div>

        <CommunitySection />
        
        <div className="relative border-y border-border/5">
           <PlansSection />
        </div>

        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
