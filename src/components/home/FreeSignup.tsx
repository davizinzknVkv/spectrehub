import React, { useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

interface FreeSignupProps {
  guildInvite: string;
}

export function FreeSignup({ guildInvite }: FreeSignupProps) {
  const { t } = useTranslation();

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
    <section id="free" className="mx-auto max-w-7xl px-6 py-24 sm:px-12">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-20 items-start">
          <div>
            <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase mb-6 flex items-center gap-4">
               <div className="w-12 h-px bg-primary" />
               {t('free.badge')}
            </div>
            <h2 className="font-display text-[3.5rem] md:text-[5rem] leading-[0.85] text-white uppercase tracking-tighter mb-16">
              {t('free.title')} <br />
              <span className="text-primary italic opacity-90">{t('free.subtitle')}</span>
            </h2>

            <div className="space-y-12 border-l border-white/10 pl-8">
              {[
                t('free.step1'),
                t('free.step2'),
                t('free.step3'),
              ].map((s, i) => (
                <div key={s} className="group cursor-default">
                   <div className="font-mono text-[9px] text-primary/40 mb-3 block">PASSO 0{i + 1}</div>
                   <p className="font-sans text-[11px] text-white/40 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors max-w-xs leading-relaxed">
                     {s}
                   </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#030303] border border-white/5 p-12 relative">
             <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
             <div className="absolute bottom-0 left-0 w-1 h-1 bg-primary" />
             
            {!code ? (
              <form onSubmit={generate} className="space-y-10">
                <div className="space-y-4">
                  <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">
                    TAG DE IDENTIDADE
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-white/[0.02] border border-white/5 px-6 py-5 text-[10px] text-white uppercase tracking-widest outline-none focus:border-primary/30 transition-all placeholder:text-white/5"
                    placeholder="SEU NOME"
                  />
                </div>
                <div className="space-y-4">
                  <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">
                    ID DO DISCORD
                  </label>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-white/[0.02] border border-white/5 px-6 py-5 text-[10px] text-white uppercase tracking-widest outline-none focus:border-primary/30 transition-all placeholder:text-white/5"
                    placeholder="USER#0000"
                  />
                </div>
                <button type="submit" className="ds-btn ds-btn-primary w-full !h-14">
                  GENERATE_AUTH_CODE
                </button>
              </form>
            ) : (
              <div className="space-y-10">
                <div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 mb-6 text-center">
                    UNIQUE_SESSION_CODE
                  </div>
                  <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 p-8 group">
                    <code className="flex-1 font-display text-3xl text-primary italic text-center tracking-widest">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      className="text-white/20 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <a
                  href={guildInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn ds-btn-primary w-full !h-14 flex items-center justify-center"
                >
                  INITIALIZE_TICKET
                </a>
                
                <button
                  type="button"
                  onClick={() => setCode(null)}
                  className="w-full font-mono text-[8px] uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors"
                >
                  REGENERATE_PROTOCOL
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
