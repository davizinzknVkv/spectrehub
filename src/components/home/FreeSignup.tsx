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
    <section id="free" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal>
        <div className="grid gap-10 rounded-2xl border border-white/[0.07] bg-[#030303]/70 p-7 backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#ff0055]">
              <span className="h-1 w-1 bg-[#ff0055]" /> Acesso Comunitário
            </span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Habilite seu Acesso Gratuito em Segundos.
            </h2>
            <ol className="mt-8 space-y-4">
              {[
                "Preencha o formulário — geramos um código único pra você.",
                "Entre no servidor e abra um ticket no canal de suporte.",
                "Informe o código no ticket. A staff libera o cargo Free na hora.",
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-[13px] text-[#a0a0a0]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-[10px] font-semibold text-[#ff0055]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
            {!code ? (
              <form onSubmit={generate} className="space-y-4">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu nome
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#ff0055]/60"
                    placeholder="Ex: davizinzkn"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu usuário do Discord
                  </span>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#ff0055]/60"
                    placeholder="@usuario"
                  />
                </label>
                <button type="submit" className="ds-btn ds-btn-primary w-full py-3">
                  Gerar meu código Free
                </button>
                <p className="text-[11px] leading-relaxed text-[#6f6f6f]">
                  O código fica salvo no seu navegador para você abrir o ticket quando quiser.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu código Free
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#ff0055]/30 bg-[#ff0055]/[0.08] p-3">
                    <code className="flex-1 font-mono text-lg font-bold tracking-[0.2em] text-[#ff0055]">
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
                  className="ds-btn ds-btn-primary w-full py-3"
                >
                  Ir pro servidor abrir ticket <ArrowRight className="h-4 w-4" />
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
