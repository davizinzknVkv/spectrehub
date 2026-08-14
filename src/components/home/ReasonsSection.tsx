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
          <h2 className="font-display text-[2.8rem] font-[900] leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-[5.5rem]">
            A ESCOLHA
            <br />
            DAS ELITES
            <br />
            NO DISCORD.
          </h2>
          <p className="mt-10 text-[18px] font-medium text-[#8a8a8a] leading-[1.6] max-w-md px-1 border-l border-[#ff0055]/30 ml-1 pl-6">
            A SPECTRE é onde a inovação acontece. Desenvolvemos ferramentas proprietárias, testadas sob estresse real, para garantir que você esteja sempre um passo à frente da concorrência.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ff0055] group-hover:bg-[#ff0055] group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-[#ff0055]/20">
                      <r.icon className="h-5 w-5" />
                   </div>
                   <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">{r.title}</span>
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

