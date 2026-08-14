import React from "react";
import { Reveal } from "./Reveal";
import { Reason } from "./constants";

interface ReasonsSectionProps {
  reasons: Reason[];
}

export function ReasonsSection({ reasons }: ReasonsSectionProps) {
  return (
    <section id="recursos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            POR QUE OS
            <br />
            GRANDES
            <br />
            ESCOLHEM A
            <br />
            SPECTRE.
          </h2>
          <p className="mt-8 text-lg font-medium text-[#8a8a8a] leading-relaxed max-w-md">
            A SPECTRE não revende script de terceiro. Tudo nasce aqui dentro, é testado em servidor com jogador dentro e só chega até você quando aguenta o horário de pico. É por isso que o mercado copia, mas não alcança.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#ff0055] group-hover:bg-[#ff0055] group-hover:text-white transition-all">
                      <r.icon className="h-4 w-4" />
                   </div>
                   <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">{r.title}</span>
                </div>
                <p className="text-sm font-medium text-[#8a8a8a] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

