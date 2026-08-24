import React, { useState, useEffect } from "react";
import { Users, MessageSquare, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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
    <div className="bg-background p-10 group hover:bg-white/[0.02] transition-colors">
      <div className="flex justify-between items-start mb-6">
        <Icon className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="w-1 h-1 bg-white/10 group-hover:bg-primary transition-colors" />
      </div>
      <div className="font-display text-2xl text-white uppercase tracking-tighter mb-2">{value}</div>
      <div className="font-display text-[8px] tracking-[0.4em] text-white/20 uppercase group-hover:text-white/40 transition-colors">
        {label}
      </div>
    </div>
  );
}

export function CommunitySection({ widgetUrl, guildInvite, fallbackMembers }: CommunitySectionProps) {
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
    <section id="comunidade" className="mx-auto max-w-7xl px-6 py-32 sm:px-12">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        <div className="flex-1 lg:max-w-md">
          <Reveal>
             <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase mb-6 flex items-center gap-4">
               <div className="w-12 h-px bg-primary" />
               {t('community.badge')}
            </div>
            <h2 className="font-display text-[3.5rem] md:text-[5rem] leading-[0.85] text-white uppercase tracking-tighter mb-8">
              {t('community.title')} <br />
              <span className="text-primary italic opacity-90">{t('community.subtitle')}</span>
            </h2>
            <div className="border-l border-white/10 pl-8 space-y-12">
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-[0.1em]">
                {t('community.description')}
              </p>
              
              <a
                href={guildInvite}
                target="_blank"
                rel="noreferrer"
                className="ds-btn ds-btn-primary !px-12"
              >
                {t('community.cta') || "ENTRAR NA COMUNIDADE"}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="flex-1 w-full">
          <Reveal delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/5">
               <MiniStat
                  icon={Users}
                  label={t('community.statOnline')}
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label={t('community.statSupport')} value="SUPORTE" />
                <MiniStat icon={Sparkles} label={t('community.statRoles')} value="ELITE" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Marquee Members */}
      <div className="mt-32 pt-16 border-t border-white/5 overflow-hidden relative">
        <div className="mb-12 flex items-center gap-6">
           <div className="font-display text-[8px] text-primary uppercase tracking-[0.5em] whitespace-nowrap">
              FEED DA COMUNIDADE
           </div>
           <div className="h-px w-full bg-white/5" />
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex w-max gap-12 animate-marquee">
          {loop.map((m, i) => (
            <motion.div 
              key={`${m.id}-${i}`} 
              className="flex items-center gap-4 group cursor-default"
            >
               <div className="w-10 h-10 bg-white/[0.02] border border-white/5 flex items-center justify-center p-0.5 relative group-hover:border-primary/50 transition-colors">
                  {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-100 transition-all duration-500" /> : <Avatar seed={m.name} />}
               </div>
               <span className="font-display text-[9px] text-white/10 uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">{m.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
