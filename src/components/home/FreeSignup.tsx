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
    <section id="free" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 bg-[#050505] border border-white/5 p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[100px] pointer-events-none" />
          
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] text-primary uppercase mb-4 flex items-center gap-2">
               <span className="w-8 h-px bg-primary/30" />
               {t('free.badge')}
            </div>
            <h2 className="font-display text-[2.5rem] md:text-[4rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-16">
              {t('free.title')} <br />
              <span className="text-white/30 text-[1.8rem] md:text-[3rem]">{t('free.subtitle')}</span>
            </h2>

            <div className="space-y-10">
              {[
                t('free.step1'),
                t('free.step2'),
                t('free.step3'),
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-8 group">
                   <div className={`w-14 h-14 border flex items-center justify-center font-display italic transition-all duration-500 shrink-0 ${i === 1 ? 'border-primary text-primary bg-primary/5' : 'border-white/10 text-white/20 group-hover:border-white/30 group-hover:text-white'}`}>
                     0{i + 1}
                   </div>
                   <p className="font-sans text-[11px] text-white/40 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors max-w-xs leading-relaxed">
                     {s}
                   </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#080808] border border-white/10 p-10 md:p-14 relative z-10">
             <div className="absolute -top-px -right-px w-10 h-10 border-t border-r border-primary/40 pointer-events-none" />
             <div className="absolute -bottom-px -left-px w-10 h-10 border-b border-l border-primary/40 pointer-events-none" />

             
            {!code ? (
              <form onSubmit={generate} className="space-y-8">
                <div className="space-y-4">
                  <label className="font-display text-[10px] uppercase tracking-[0.3em] text-white/60 italic block">
                    Identificação
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-[#111] border border-white/5 px-6 py-5 text-[11px] text-white uppercase tracking-widest outline-none focus:border-primary/40 transition-all placeholder:text-white/5"

                    placeholder={t('free.formName')}
                  />
                </div>
                <div className="space-y-4">
                  <label className="font-display text-[10px] uppercase tracking-[0.3em] text-white/60 italic block">
                    Usuário Discord
                  </label>

                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full bg-[#111] border border-white/5 px-6 py-5 text-[11px] text-white uppercase tracking-widest outline-none focus:border-primary/40 transition-all placeholder:text-white/5"
                    placeholder={t('free.formDiscord')}
                  />
                </div>
                <button type="submit" className="ds-btn ds-btn-primary w-full py-5 text-[10px]">
                  {t('free.formSubmit')}
                </button>

              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="font-display text-[9px] uppercase tracking-[0.3em] text-white/30 italic mb-4 text-center">
                    {t('free.uniqueCode')}
                  </div>
                  <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 p-6">
                    <code className="flex-1 font-display text-2xl text-primary italic text-center tracking-widest">
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
                  className="ds-btn ds-btn-primary w-full py-5 text-[10px]"
                >
                  {t('common.getStarted')}
                </a>
                
                <button
                  type="button"
                  onClick={() => setCode(null)}
                  className="w-full font-display text-[9px] uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors italic"
                >
                  {t('free.generateNew')}
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
