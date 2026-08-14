import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Zap, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Product } from "./constants";

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="ds-h1">
              CADA SISTEMA É UM
              <br />
              MOTIVO PRO
              <br />
              JOGADOR FICAR.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 ds-body max-w-xl text-[#8a8a8a]">
              Sistema que o jogador abre, entende na hora e volta pra usar. Todos desenhados, escritos e testados pela SPECTRE, e já rodando em servidor cheio agora.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap gap-3">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(i)}
              className={`px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === i
                  ? "bg-[#ff0055] text-white shadow-[0_8px_20px_rgba(255,0,85,0.3)]"
                  : "bg-white/5 text-[#666] hover:bg-white/10 hover:text-white"
              } border border-white/5 relative min-w-[140px]`}
            >
              <span className="relative z-10 whitespace-nowrap">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch overflow-hidden">
          <Reveal className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[550px] bg-[#080808]/40 border border-white/10 rounded-[32px] overflow-hidden group shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff0055]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-16">
              <div className="relative w-full max-w-lg transition-all duration-1000 group-hover:scale-[1.05]">
                <div className="absolute -inset-10 bg-[#ff0055] opacity-10 blur-[120px]" />
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
                  alt="Elite Interface"
                  className="relative w-full grayscale contrast-[1.1] brightness-[0.85] rounded-2xl border border-white/20 shadow-2xl"
                />
              </div>
            </div>
          </Reveal>

          <div className="relative flex flex-col justify-center py-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#ff0055] text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <h3 className="ds-h2">
                  {products[activeTab].name}
                </h3>
              </div>
              <span className="mt-4 block ds-label text-[#ff0055]">
                SPECTRE-{products[activeTab].id.toUpperCase()}
              </span>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-8 ds-body leading-relaxed text-[#8a8a8a]">
                {products[activeTab].desc}
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10 flex flex-wrap gap-2">
              {["VRPEX", "CREATIVE", "STANDALONE"].map((tag) => (
                <span key={tag} className="bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] font-black text-[#666] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </Reveal>

            <Reveal delay={300} className="mt-12">
              <Link
                to={products[activeTab].to}
                className="ds-btn ds-btn-primary ds-btn-lg rounded-full w-full sm:w-auto"
              >
                <Zap className="h-5 w-5 mr-2" /> COMEÇAR AGORA <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
