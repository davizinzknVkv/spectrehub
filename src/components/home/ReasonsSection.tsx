import React from "react";
import { Shield, Zap, Lock } from "lucide-react";
import { Reveal } from "./Reveal";
import { Reason } from "./constants";

interface ReasonsSectionProps {
  reasons: Reason[];
}

const ICON_MAP = {
  Zap: Zap,
  Shield: Shield,
  Lock: Lock,
};

export function ReasonsSection({ reasons }: ReasonsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 bg-white/[0.01]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
        {reasons.map((r, i) => {
          const Icon = ICON_MAP[r.icon as keyof typeof ICON_MAP] || Zap;
          return (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-sm bg-white/5 border border-white/10 text-white transition-all group-hover:bg-[#ff0055] group-hover:border-[#ff0055] group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="ds-label text-white mb-4 tracking-[0.2em]">{r.title}</h3>
                <p className="ds-body text-[#8a8a8a] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
