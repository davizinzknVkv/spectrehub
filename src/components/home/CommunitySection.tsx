import React, { useState, useEffect } from "react";
import { Users, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="bg-[#080808] border border-white/5 p-8 group hover:border-spectre-pink/20 transition-all duration-500">
      <Icon className="h-5 w-5 text-spectre-pink mb-6 group-hover:scale-110 transition-transform" />
      <div className="font-display text-3xl text-white uppercase italic mb-1">{value}</div>
      <div className="font-display text-[10px] tracking-[0.3em] text-white/30 uppercase group-hover:text-white/50 transition-colors">
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
            <h2 className="font-display text-[2.5rem] md:text-[4rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-8">
              {t('community.title')} <br />
              <span className="text-white/30 text-[1.8rem] md:text-[3rem]">{t('community.subtitle')}</span>
            </h2>
            <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-[0.2em] border-l border-spectre-pink/30 pl-8 mb-12 max-w-xl">
              {t('community.description')}
            </p>


          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/5 mb-12">
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
              className="ds-btn ds-btn-primary px-16 py-5 text-[11px]"
            >
              {t('common.getStarted')}
            </a>

          </Reveal>
        </div>

        <Reveal className="relative bg-[#050505] border border-white/10 p-5 overflow-hidden group shadow-2xl w-full max-w-[500px] mx-auto lg:mx-0">
           {/* Terminal Header */}
           <div className="absolute top-0 left-0 right-0 h-12 bg-[#0A0A0A] border-b border-white/5 flex items-center px-6 gap-3 z-30">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-spectre-pink animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-white/5" />
                <div className="w-2 h-2 rounded-full bg-white/5" />
              </div>
              <span className="font-display text-[10px] text-white/40 uppercase italic tracking-[0.4em] ml-4">DISCORD PROTOCOL V2.0</span>
              <div className="ml-auto flex gap-4">
                <div className="w-3 h-0.5 bg-white/10" />
                <div className="w-3 h-3 border border-white/10" />
                <div className="w-3 h-3 text-white/20 text-[10px] flex items-center justify-center leading-none">×</div>
              </div>
           </div>

           {/* Discord Mockup Body */}
           <div className="pt-12 relative z-20 bg-[#313338] min-h-[500px] flex flex-col font-sans">
              <div className="bg-[#5865F2] p-6 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-white tracking-wide">Discord</span>
                </div>
                <span className="text-[11px] text-white/70 font-medium">{presence !== null ? presence : "—"} Members Online</span>
              </div>
              
              <div className="p-6 space-y-4 flex-1">
                {[
                  { icon: '🔊', name: 'Sala Geral' },
                  { icon: '🎮', name: 'Gaming' },
                  { icon: '💻', name: 'Desenvolvimento' },
                  { icon: '🎵', name: 'Música' },
                  { icon: '💎', name: 'Premium' },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center gap-3 text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1] p-2 rounded transition-colors cursor-pointer group/item">
                    <span className="text-lg opacity-60 group-hover/item:opacity-100">{ch.icon}</span>
                    <span className="text-[13px] font-medium">{ch.name}</span>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-white/5">
                  <span className="text-[11px] font-bold text-[#949BA4] uppercase tracking-wider block mb-4">Members Online</span>
                  <div className="space-y-3">
                    {list.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex items-center gap-3 group/member">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-[#1E1F22] overflow-hidden">
                            {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover" /> : <Avatar seed={m.name} />}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#23A55A] border-[3px] border-[#313338]" />
                        </div>
                        <span className="text-[13px] text-[#DBDEE1] font-medium group-hover/member:text-white transition-colors">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#2B2D31]">
                <button className="w-full bg-[#248046] hover:bg-[#1A6334] text-white text-sm font-medium py-2.5 rounded transition-colors">
                  Join Discord
                </button>
              </div>
           </div>

           {/* Decorative Grid Overlay */}
           <div className="absolute inset-0 z-10 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
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
            <motion.div 
              key={`${m.id}-${i}`} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.2, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.1, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
               <div className="w-8 h-8 rounded-full border border-white/10 bg-black overflow-hidden flex items-center justify-center p-0.5 relative">
                  <div className="absolute inset-0 bg-spectre-pink/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" /> : <Avatar seed={m.name} />}
               </div>
               <span className="font-display text-[10px] text-white uppercase italic tracking-[0.2em] group-hover:text-spectre-pink transition-colors">{m.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
