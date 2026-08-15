import React, { useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface FreeSignupProps {
  guildInvite: string;
}

export function FreeSignup({ guildInvite }: FreeSignupProps) {
  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const clean = { name: name.trim().slice(0, 40), discord: discord.trim().slice(0, 40) };
    if (!clean.name || !clean.discord) return;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const c = `FREE-${rand}`;
    try {
      localStorage.setItem(
        "nh:free-signup",
        JSON.stringify({ ...clean, code: c, at: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
    setCode(c);
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="free" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 bg-obsidian-soft border border-white/5 p-8 md:p-16 rounded-none">
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 flex items-center gap-2">
               <span className="w-8 h-px bg-spectre-pink/30" />
               Acesso Comunitário
            </div>
            <h2 className="font-display text-[2rem] md:text-[3.5rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-12">
              JORNADA <br />
              <span className="text-white/30 text-[1.5rem] md:text-[2.5rem]">GRATUITA.</span>
            </h2>
            
            <div className="space-y-8">
              {[
                "Preencha os dados e gere seu identificador único.",
                "Junte-se ao nosso ecossistema oficial no Discord.",
                "Autentique-se via suporte para liberar suas ferramentas."
              ].map((s, i) => (
                <div key={s} className="flex gap-6 group">
                   <div className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center font-display text-white italic transition-colors group-hover:border-spectre-pink/40 group-hover:text-spectre-pink shrink-0">
                     0{i + 1}
                   </div>
                   <div className="pt-2">
                     <p className="font-sans text-xs text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                       {s}
                     </p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 p-8 md:p-10 relative">
             <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-spectre-pink/30 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-spectre-pink/30 pointer-events-none" />
             
            {!code ? (
              <form onSubmit={generate} className="space-y-8">
                <div className="space-y-3">
                  <label className="font-display text-[9px] uppercase tracking-[0.3em] text-white/30 italic">
                    Identificação
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs text-white uppercase tracking-widest outline-none focus:border-spectre-pink/50 transition-all placeholder:text-white/10"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-3">
                  <label className="font-display text-[9px] uppercase tracking-[0.3em] text-white/30 italic">
                    Usuário Discord
                  </label>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs text-white uppercase tracking-widest outline-none focus:border-spectre-pink/50 transition-all placeholder:text-white/10"
                    placeholder="@usuario"
                  />
                </div>
                <button type="submit" className="ds-btn ds-btn-primary w-full py-5 text-[10px]">
                  Gerar Identificador
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="font-display text-[9px] uppercase tracking-[0.3em] text-white/30 italic mb-4 text-center">
                    Seu Código Único
                  </div>
                  <div className="flex items-center gap-2 border border-spectre-pink/30 bg-spectre-pink/5 p-6">
                    <code className="flex-1 font-display text-2xl text-spectre-pink italic text-center tracking-widest">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      className="text-white/20 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-spectre-pink" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <a
                  href={guildInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn ds-btn-primary w-full py-5 text-[10px]"
                >
                  Quero Usar o Spectre
                </a>
                
                <button
                  type="button"
                  onClick={() => setCode(null)}
                  className="w-full font-display text-[9px] uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors italic"
                >
                  Gerar Novo Código
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
