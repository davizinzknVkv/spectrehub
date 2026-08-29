import React, { useState, useEffect } from "react";
import { Users, MessageSquare, Sparkles } from "lucide-react";
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

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="ds-card">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-sm text-foreground-muted">{label}</div>
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
    <section id="comunidade" className="bn-container py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="bn-badge">{t("community.badge")}</span>
          <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-foreground">
            {t("community.title")} <span className="text-primary">{t("community.subtitle")}</span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground-muted">
            {t("community.description")}
          </p>
          <a
            href={guildInvite}
            target="_blank"
            rel="noreferrer"
            className="ds-btn ds-btn-primary mt-8"
          >
            {t("community.cta") || "Entrar na comunidade"}
          </a>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniStat
              icon={Users}
              label={t("community.statOnline")}
              value={presence !== null ? String(presence) : "—"}
            />
            <MiniStat icon={MessageSquare} label={t("community.statSupport")} value="24/7" />
            <MiniStat icon={Sparkles} label={t("community.statRoles")} value="Elite" />
          </div>
        </Reveal>
      </div>

      <div className="relative mt-20 overflow-hidden border-t border-white/[0.06] pt-10">
        <p className="mb-6 text-sm text-foreground-muted">Membros da comunidade</p>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-8">
          {loop.map((m, i) => (
            <div key={`${m.id}-${i}`} className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-surface-2">
                {m.avatar ? (
                  <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <Avatar seed={m.name} />
                )}
              </div>
              <span className="whitespace-nowrap text-sm text-foreground-muted">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
