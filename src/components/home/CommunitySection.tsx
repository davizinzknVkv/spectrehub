import React, { useState, useEffect } from "react";
import { Users, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface CommunitySectionProps {
  widgetUrl: string;
  guildId: string;
  guildInvite: string;
  fallbackMembers: string[];
}

type LiveMember = { id: string; name: string; avatar: string | null; status: string };

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0a0a0a] p-5">
      <Icon className="h-4 w-4 text-[#ff0055]" />
      <div className="mt-4 truncate font-display text-lg font-black text-white">{value}</div>
      <div className="mt-1 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[#444]">
        {label}
      </div>
    </div>
  );
}

export function CommunitySection({ widgetUrl, guildId, guildInvite, fallbackMembers }: CommunitySectionProps) {
  const [live, setLive] = useState<LiveMember[] | null>(null);
  const [presence, setPresence] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(widgetUrl, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || !Array.isArray(j.members)) return;
        setPresence(typeof j.presence_count === "number" ? j.presence_count : null);
        setLive(
          j.members.map(
            (m: { id: string; username: string; avatar_url: string | null; status: string }) => ({
              id: m.id,
              name: m.username,
              avatar: m.avatar_url,
              status: m.status,
            }),
          ),
        );
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [widgetUrl]);

  const list: LiveMember[] =
    live ?? fallbackMembers.map((n) => ({ id: n, name: n, avatar: null, status: "online" }));
  const loop = [...list, ...list];

  return (
    <section id="comunidade" className="border-t border-white/[0.08] bg-[#030303]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.45em] text-[#ff0055] font-black">
              <span className="h-2 w-2 rounded-full bg-[#ff0055] shadow-[0_0_10px_#ff0055]" /> ECOSSISTEMA
            </span>
            <h2 className="mt-8 font-display text-[2.8rem] font-[900] leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-[5.5rem] uppercase italic">
              JUNTE-SE
              <br />
              À ELITE.
            </h2>
            <p className="mt-10 text-[18px] font-medium text-[#8a8a8a] leading-[1.6] max-w-xl">
              Suporte técnico de alta performance, atualizações em tempo real e uma comunidade ativa que define os novos padrões do mercado.
            </p>
          </div>
        </Reveal>

        <div
          className="relative mt-20 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
          }}
        >
          {/* Row 1 */}
          <div className="marquee flex w-max gap-4 pb-4">
            {loop.slice(0, Math.ceil(loop.length / 2)).map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-4 border border-white/10 bg-[#080808]/60 backdrop-blur-sm py-4 pl-4 pr-10 transition-all duration-500 hover:border-[#ff0055]/50 hover:bg-[#0c0c0c]/80 rounded-full group"
              >
                <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/5 group-hover:ring-[#ff0055]/30 transition-all">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <span className="whitespace-nowrap font-display text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {m.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 - Offset */}
          <div className="marquee flex w-max gap-4" style={{ animationDirection: 'reverse' }}>
            {loop.slice(Math.ceil(loop.length / 2)).map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-4 border border-white/5 bg-[#0a0a0a] py-3 pl-3 pr-8 transition-all hover:border-[#ff0055]/30"
                style={{
                  clipPath: "polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0% 75%)"
                }}
              >
                <div className="h-10 w-10 overflow-hidden bg-white/5">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <span className="whitespace-nowrap font-display text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <Reveal>
            <div className="border border-white/5 bg-[#0a0a0a] p-8 sm:p-10">
              <div className="flex items-center gap-3 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff0055]">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#ff0055]" /> Conexão Direta
              </div>
              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tighter text-white sm:text-4xl">
                SERVIDOR OFICIAL
                <br />
                NO DISCORD
              </h3>
              <p className="mt-4 max-w-md text-xs font-medium leading-relaxed text-[#8a8a8a] uppercase tracking-wider">
                Widget sincronizado em tempo real — entre, valide seu acesso e interaja com nossa comunidade.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-px bg-white/5 border border-white/5 sm:grid-cols-3">
                <MiniStat
                  icon={Users}
                  label="online agora"
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label="suporte" value="Ticket" />
                <MiniStat icon={Sparkles} label="cargos" value="Premium" />
              </div>

              <a
                href={guildInvite}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 bg-[#ff0055] px-8 py-4 font-display text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#ff0055]/90"
              >
                Entrar no Discord <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <div className="mx-auto w-full max-w-[380px] border border-white/5 bg-[#0a0a0a] p-2">
            <iframe
              src={`https://discord.com/widget?id=${guildId}&theme=dark`}
              width={350}
              height={480}
              title="Widget do Discord"
              loading="lazy"
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto block h-[480px] w-full grayscale contrast-125 brightness-90 transition-all hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
