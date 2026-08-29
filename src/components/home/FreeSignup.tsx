import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
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
    <section id="free" className="bn-container py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <span className="bn-badge">{t("free.badge")}</span>
          <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-foreground">
            {t("free.title")} <span className="text-primary">{t("free.subtitle")}</span>
          </h2>

          <ol className="mt-8 space-y-6">
            {[t("free.step1"), t("free.step2"), t("free.step3")].map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground-muted">{s}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={150}>
          <div className="ds-card">
            {!code ? (
              <form onSubmit={generate} className="space-y-5">
                <div>
                  <label htmlFor="free-name" className="mb-2 block text-sm font-medium text-foreground">
                    Seu nome
                  </label>
                  <input
                    id="free-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="bn-input"
                    placeholder="Como devemos te chamar"
                  />
                </div>
                <div>
                  <label htmlFor="free-discord" className="mb-2 block text-sm font-medium text-foreground">
                    Usuário do Discord
                  </label>
                  <input
                    id="free-discord"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="bn-input"
                    placeholder="seu.usuario"
                  />
                </div>
                <button type="submit" className="ds-btn ds-btn-primary w-full">
                  Gerar código de acesso
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-foreground-muted">Seu código de acesso gratuito</p>
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-5">
                  <code className="flex-1 text-center font-mono text-2xl tracking-wider text-foreground">
                    {code}
                  </code>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Copiar código"
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {copied ? <Check className="h-5 w-5 text-accent" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <a
                  href={guildInvite}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn ds-btn-primary w-full"
                >
                  Abrir ticket no Discord
                </a>
                <button
                  type="button"
                  onClick={() => setCode(null)}
                  className="ds-btn ds-btn-ghost w-full"
                >
                  Gerar novo código
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
