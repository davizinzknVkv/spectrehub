import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neighborshub — Auto Quests para Orbs do Discord" },
      {
        name: "description",
        content:
          "Script Node.js que completa automaticamente as missões do Discord (vídeo e jogos) e acumula Orbs. Open source, sem interface, roda no seu terminal.",
      },
      { property: "og:title", content: "Neighborshub — Auto Quests para Orbs do Discord" },
      {
        property: "og:description",
        content:
          "Script Node.js que completa automaticamente as missões do Discord (vídeo e jogos) e acumula Orbs. Open source, sem interface, roda no seu terminal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SCRIPT_CODE = `const axios = require('axios');
const fs    = require('fs').promises;
const path  = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

let config = {};

const DEFAULT_CONFIG = {
    token: '',
    xSuperProperties: 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6InB0LUJSIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIwLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OTk5LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9217 Chrome/138.0.7204.251 Electron/37.6.0 Safari/537.36'
};

// ... (script completo disponível no repositório)`;

const CONFIG_EXAMPLE = `{
  "token": "SEU_TOKEN_DO_DISCORD_AQUI",
  "xSuperProperties": "...",
  "userAgent": "..."
}`;

function Index() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 antialiased">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(600px 400px at 15% 10%, rgba(88,101,242,0.25), transparent 60%), radial-gradient(500px 350px at 85% 20%, rgba(235,69,158,0.15), transparent 60%)",
        }}
      />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#5865F2] font-black text-white shadow-lg shadow-indigo-500/30">
            D
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Discord<span className="text-[#5865F2]">Hub</span>
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
          <a href="#features" className="hover:text-white">Recursos</a>
          <a href="#como-usar" className="hover:text-white">Como usar</a>
          <a href="#aviso" className="hover:text-white">Aviso</a>
        </nav>
        <a
          href="/hub"
          className="rounded-md bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4752c4]"
        >
          Abrir Hub
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Automação de Missões · Node.js
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Complete missões do Discord
            <br />
            <span className="bg-gradient-to-r from-[#5865F2] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
              enquanto você dorme.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 md:text-xl">
            Script open source que se inscreve, cumpre e finaliza as quests de vídeo e
            jogo automaticamente — acumulando Orbs sem manter o Discord aberto.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/hub"
              className="rounded-lg bg-[#5865F2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
            >
              Abrir o Hub
            </a>
            <a
              href="#como-usar"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Como funciona
            </a>
          </div>
        </div>

        {/* Terminal preview */}
        <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#0f1218] shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-slate-500">node neighborshub.js</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-slate-300">
{`🔍 Validando token...
👤 Conta: Vinicius (@vinicius)
🆔 ID: 123456789012345678
💰 Orbs: 2.450

📋 Buscando missões disponíveis...

🎯 3 missão(ões) encontrada(s):

   1. Fortnite — Jogue 15 minutos
      🎮 Jogar | 15 minutos | 🎁 500 Orbs
   2. Assista ao trailer de Arcane S2
      🎬 Vídeo | 45 segundos | 🎁 Decoração de Avatar

▶️ Iniciando execução automática...

🚀 Iniciando: Fortnite — Jogue 15 minutos
   [██████████████░░░░░░] 70% | 10:30 / 15:00`}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Recursos</h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Tudo que você precisa para farmar missões de forma silenciosa e confiável.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Auto-inscrição",
              desc: "Detecta missões disponíveis, filtra as ainda não completas e se inscreve automaticamente.",
              icon: "⚡",
            },
            {
              title: "Vídeo & Jogo",
              desc: "Suporte a WATCH_VIDEO, PLAY_ON_DESKTOP, XBOX e PlayStation com heartbeat próprio.",
              icon: "🎮",
            },
            {
              title: "Prioridade inteligente",
              desc: "Ordena por recompensa (Orbs primeiro) e menor duração para maximizar ganho por hora.",
              icon: "🧠",
            },
            {
              title: "Jitter humano",
              desc: "Delays aleatórios entre chamadas para evitar padrões robóticos e rate limits.",
              icon: "🎲",
            },
            {
              title: "Progress bar",
              desc: "Acompanhe no terminal, em tempo real, quanto falta pra cada missão terminar.",
              icon: "📊",
            },
            {
              title: "Zero dependências pesadas",
              desc: "Apenas axios. Um único arquivo .js. Config em JSON separado.",
              icon: "📦",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#5865F2]/50 hover:bg-white/[0.06]"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como usar */}
      <section id="como-usar" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Como usar</h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Quatro passos e você já está acumulando Orbs.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              n: "01",
              title: "Instale o Node.js",
              body: "Baixe a versão LTS em nodejs.org. Requer Node 18+.",
            },
            {
              n: "02",
              title: "Instale o axios",
              body: "No terminal, dentro da pasta do script:",
              code: "npm install axios",
            },
            {
              n: "03",
              title: "Configure seu token",
              body: "Crie um config.json ao lado do script:",
              code: CONFIG_EXAMPLE,
            },
            {
              n: "04",
              title: "Execute",
              body: "Rode o script e deixe rolar:",
              code: "node neighborshub.js",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#5865F2]/20 px-2 py-1 font-mono text-xs text-[#a5b4fc]">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-400">{s.body}</p>
              {s.code && (
                <pre className="mt-4 overflow-x-auto rounded-lg border border-white/5 bg-[#0f1218] p-3 font-mono text-xs text-slate-300">
                  {s.code}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Código */}
      <section id="codigo" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">O script</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Um único arquivo. Prioridade por recompensa. Progress bar. Jitter humano.
            </p>
          </div>
          <button
            onClick={() => copy(SCRIPT_CODE, "script")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            {copied === "script" ? "✓ Copiado" : "Copiar snippet"}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0f1218]">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs text-slate-500">
            <span className="font-mono">neighborshub.js</span>
            <span>JavaScript · ~300 linhas</span>
          </div>
          <pre className="max-h-[420px] overflow-auto p-5 font-mono text-[13px] leading-6 text-slate-300">
            {SCRIPT_CODE}
          </pre>
        </div>
      </section>

      {/* Aviso */}
      <section id="aviso" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-300">
                Uso por sua conta e risco
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Automatizar a API do Discord com o token da sua conta pessoal viola os{" "}
                <a
                  href="https://discord.com/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-yellow-400/50 hover:text-white"
                >
                  Termos de Serviço do Discord
                </a>{" "}
                (self-bots) e pode resultar em suspensão da conta. Este projeto é
                educacional. Nunca compartilhe seu token com terceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-6">
          Neighborshub · Feito com Node.js e um bom motivo pra farmar Orbs.
        </div>
      </footer>
    </div>
  );
}
