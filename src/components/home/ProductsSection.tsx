import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Zap, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Product } from "./constants";
import questFlyer from "@/assets/quest-flyer.png.asset.json";

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="max-w-3xl">
          <Reveal>
            <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 flex items-center gap-2">
               <span className="w-8 h-px bg-spectre-pink/30" />
               Ecosistema
            </div>
            <h2 className="font-display text-[2.5rem] md:text-[4.5rem] leading-[0.9] text-white uppercase italic tracking-tighter">
              A SPECTRE CRIA.<br />
              <span className="text-white/30">O MERCADO COPIA.</span>
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Gallery / Preview */}
        <Reveal className="relative aspect-video lg:aspect-square bg-obsidian-soft border border-white/5 overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-spectre-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
             <div className="relative w-full h-full border border-white/10 bg-black/40 backdrop-blur-sm p-4 transition-transform duration-700 group-hover:scale-[1.02]">
                <div className="w-full h-full bg-[#111] overflow-hidden relative">
                   {products[activeTab].id === "quests" ? (
                     <img 
                       src={questFlyer.url} 
                       className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                       alt="Spectre Quests Flyer" 
                     />
                   ) : (
                     <img 
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" 
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700" 
                        alt="Interface Preview" 
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   
                   <div className="absolute bottom-8 left-8 right-8">
                      <div className="font-display text-4xl text-white uppercase italic mb-2">
                        {products[activeTab].name}
                      </div>
                      <div className="font-sans text-white/40 text-sm max-w-md">
                        {products[activeTab].desc}
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </Reveal>

        {/* List / Tabs */}
        <div className="space-y-2">
           {products.map((p, i) => (
             <button
               key={p.id}
               onClick={() => setActiveTab(i)}
                className={`w-full text-left p-6 transition-all duration-300 border border-white/5 flex items-center justify-between group rounded-none ${
                  activeTab === i 
                    ? "bg-spectre-pink/5 border-spectre-pink/30" 
                    : "hover:bg-white/[0.02]"
                }`}
             >
               <div>
                 <div className={`font-display text-lg uppercase italic transition-colors ${activeTab === i ? "text-spectre-pink" : "text-white/60 group-hover:text-white"}`}>
                   {p.name}
                 </div>
                 <div className="font-sans text-[10px] text-white/20 uppercase tracking-[0.2em] mt-1">
                   Spectre System V4.0
                 </div>
               </div>
               <div className={`w-10 h-10 border border-white/10 flex items-center justify-center transition-all ${activeTab === i ? "bg-spectre-pink border-spectre-pink text-white" : "text-white/20 group-hover:text-white group-hover:border-white/30"}`}>
                 <ArrowUpRight className="w-4 h-4" />
               </div>
             </button>
           ))}
           
           <Reveal delay={200} className="mt-8">
             <Link
               to={products[activeTab].to}
               className="ds-btn ds-btn-primary w-full"
             >
               Garantir Acesso Agora
             </Link>
           </Reveal>
        </div>
      </div>
    </section>
  );
}
