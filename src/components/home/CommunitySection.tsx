import React, { useState, useEffect } from "react";
import { Users, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";


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
    <div className="bg-obsidian border border-white/5 p-6 group hover:border-spectre-pink/30 transition-colors">
      <Icon className="h-4 w-4 text-spectre-pink mb-4" />
      <div className="font-display text-2xl text-white uppercase italic">{value}</div>
      <div className="font-display text-[9px] tracking-[0.2em] text-white/20 uppercase mt-1 group-hover:text-white/40 transition-colors">
        {label}
      </div>
    </div>
  );
}

export function CommunitySection({ widgetUrl, guildId, guildInvite, fallbackMembers }: CommunitySectionProps) {
  const { t } = useTranslation();
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
  const loop = [...list, ...list, ...list];

  return (
    <section id="comunidade" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 lg:gap-20 items-start">
        <div>
          <Reveal>
             <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 flex items-center gap-2">
               <span className="w-8 h-px bg-spectre-pink/30" />
               {t('community.badge')}
            </div>
            <h2 className="font-display text-[2rem] md:text-[3.5rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-6">
              {t('community.title')} <br />
              <span className="text-white/30 text-[1.5rem] md:text-[2.5rem]">{t('community.subtitle')}</span>
            </h2>
            <p className="text-white/40 text-xs leading-relaxed uppercase tracking-widest border-l border-spectre-pink/30 pl-6 mb-8 max-w-xl">
              {t('community.description')}
            </p>

          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5 border border-white/5 mb-8">
               <MiniStat
                  icon={Users}
                  label={t('community.statOnline')}
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label={t('community.statSupport')} value="Ticket" />
                <MiniStat icon={Sparkles} label={t('community.statRoles')} value="Premium" />

            </div>
            <a
              href={guildInvite}
              target="_blank"
              rel="noreferrer"
              className="ds-btn ds-btn-primary px-12"
            >
              {t('common.getStarted')}
            </a>
          </Reveal>
        </div>

        <Reveal className="relative bg-black border border-white/5 p-4 overflow-hidden group rounded-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] w-full max-w-full">
           <div className="absolute top-4 left-4 right-4 h-10 bg-[#080808] border border-white/5 flex items-center px-4 gap-3 z-20">
              <div className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
                <span className="absolute w-3 h-3 rounded-full bg-[#ff0055]/20 animate-ping" />
              </div>
              <span className="font-display text-[9px] text-white/40 uppercase italic tracking-[0.3em]">DISCORD PROTOCOL V2.0</span>
              <div className="ml-auto flex gap-1">
                <div className="w-1 h-1 bg-white/10" />
                <div className="w-1 h-1 bg-white/10" />
                <div className="w-1 h-1 bg-[#ff0055]/40" />
              </div>
           </div>
           <div className="pt-14 h-[350px] sm:h-[500px] overflow-hidden relative bg-[#050505]">
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black" />
              <iframe
                src={`https://discord.com/widget?id=${guildId}&theme=dark`}
                width="100%"
                height="500"
                title="Widget do Discord"
                loading="lazy"
                // @ts-ignore
                allowtransparency="true"
                frameBorder={0}
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="opacity-70 group-hover:opacity-100 transition-all duration-700 w-full h-full filter contrast-[1.1] brightness-[0.9]"
              />
           </div>
           {/* Decorative Corner */}
           <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#ff0055]/30" />
              <div className="absolute bottom-2 right-4 w-4 h-[1px] bg-[#ff0055]/20" />
              <div className="absolute bottom-4 right-2 w-[1px] h-4 bg-[#ff0055]/20" />
           </div>
        </Reveal>
      </div>

      {/* Marquee Members */}
      <div className="mt-20 pt-10 border-t border-white/5 overflow-hidden relative bg-[#050505]/50">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="mb-8 flex items-center gap-4">
           <div className="font-display text-[10px] text-spectre-pink uppercase italic tracking-[0.4em] whitespace-nowrap">
              {t('community.marqueeLabel')}
           </div>
           <div className="h-px w-full bg-white/5" />
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-obsidian to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-obsidian to-transparent z-10" />
        <div className="flex w-max gap-8 animate-marquee">
          {loop.map((m, i) => (
            <div key={`${m.id}-${i}`} className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-300">
               <div className="w-8 h-8 rounded-full border border-white/10 bg-black overflow-hidden flex items-center justify-center p-0.5">
                  {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover grayscale brightness-125" /> : <Avatar seed={m.name} />}
               </div>
               <span className="font-display text-[10px] text-white uppercase italic tracking-[0.2em]">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
