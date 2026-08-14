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
    <section id="free" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 reveal-item">
      <Reveal>
        <div className="grid gap-12 rounded-[40px] border border-white/10 bg-[#080808]/40 p-8 backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-16 shadow-2xl">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff0055] font-black">
              <span className="h-2 w-2 rounded-full bg-[#ff0055] shadow-[0_0_10px_#ff0055]" /> COMUNIDADE
            </span>
            <h2 className="mt-8 font-display text-3xl font-[900] leading-[1] tracking-tighter text-white sm:text-5xl lg:text-6xl uppercase">
              COMECE SUA
              <br />
              JORNADA
              <br />
              GRATUITA.
            </h2>
            <ol className="mt-12 space-y-6">
              {[
                "Preencha os dados e gere seu identificador único.",
                "Junte-se ao nosso ecossistema oficial no Discord.",
                "Autentique-se via suporte para liberar suas ferramentas."
              ].map((s, i) => (
                <li key={s} className="flex gap-5 text-[15px] font-medium text-white/60 leading-tight">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 font-display text-[14px] font-black text-white shadow-sm">
                    {i + 1}
                  </span>
                  <span className="pt-2">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 shadow-inner">
            {!code ? (
              <form onSubmit={generate} className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                    IDENTIFICAÇÃO
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-[#ff0055]/50 focus:ring-1 focus:ring-[#ff0055]/50"
                    placeholder="Seu nome ou apelido"
                  />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">
                    USUÁRIO DISCORD
                  </span>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-[#ff0055]/50 focus:ring-1 focus:ring-[#ff0055]/50"
                    placeholder="@usuario"
                  />
                </div>
                <button type="submit" className="ds-btn ds-btn-primary rounded-full w-full py-2 shadow-xl shadow-[#ff0055]/20">
                  GERAR CÓDIGO DE ACESSO
                </button>
                <p className="text-[11px] leading-relaxed text-white/30 text-center font-medium">
                  Seus dados são processados localmente e criptografados.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu código Free
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#ff0055]/30 bg-[#ff0055]/[0.08] p-5 shadow-inner">
                    <code className="flex-1 font-mono text-2xl font-black tracking-[0.2em] text-[#ff0055]">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      aria-label="Copiar código"
                      className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[#a0a0a0] transition hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4 text-[#ff0055]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-[#8a8a8a]">
                  Abra um ticket no servidor e cole esse código na primeira mensagem.
                </p>
                <a
                  href={guildInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn ds-btn-primary rounded-full w-full py-2 shadow-xl shadow-[#ff0055]/20"
                >
                  AUTENTICAR NO DISCORD <ArrowRight className="h-4 w-4 ml-2" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setCode(null);
                    setName("");
                    setDiscord("");
                  }}
                  className="w-full font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f] transition hover:text-white"
                >
                  Gerar outro código
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
