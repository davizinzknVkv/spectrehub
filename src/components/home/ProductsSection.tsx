import React from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Product } from "./constants";
import { LenticularCarousel } from "@/components/ui/LenticularCarousel";

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="produtos" className="relative py-24 bg-[#0A0A0D]">
      {/* Background Decorator */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <div className="font-display text-[10px] tracking-[0.4em] text-primary uppercase mb-4 flex items-center justify-center gap-3">
               <span className="w-12 h-px bg-primary/30" />
               NOSSAS FERRAMENTAS
               <span className="w-12 h-px bg-primary/30" />
            </div>
            <h2 className="font-display text-[2.5rem] md:text-[4.5rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-6">
              EXPLORE OS <span className="text-white/20 italic">SISTEMAS</span>
            </h2>
            <p className="font-sans text-white/40 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
              A SPECTRE É ONDE A INOVAÇÃO ACONTECE. DESENVOLVEMOS FERRAMENTAS PROPRIETÁRIAS, TESTADAS SOB ESTRESSE REAL, PARA GARANTIR QUE VOCÊ ESTEJA SEMPRE UM PASSO À FRENTE DA CONCORRÊNCIA.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="w-full">
            <LenticularCarousel 
              items={products}
              cardWidth={300}
              gap={32}
              borderRadius={0} // SPECTRE style is sharp/clipped
              tilt={15}
              perspective={2000}
              inactiveScale={0.85}
              inactiveDim={0.4}
              speed={0.8}
              trigger="hover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
