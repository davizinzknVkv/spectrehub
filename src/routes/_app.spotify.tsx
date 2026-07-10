import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Music, Lock, Sparkles } from "lucide-react";
import { useQuestStore } from "@/lib/quest-store";

export const Route = createFileRoute("/_app/spotify")({
  head: () => ({
    meta: [
      { title: "Gerador Spotify Premium — Neighborshub" },
      {
        name: "description",
        content:
          "Gere links de Spotify Premium Trimestral com UTM personalizado. Exclusivo VIP.",
      },
    ],
  }),
  component: SpotifyGenPage,
});

const BASE_URL = "https://www.spotify.com/br-pt/premium/";
const DISCORD_INVITE = "https://discord.gg/EMsfMZFyGS";

const PRESETS = [
  { label: "Instagram", source: "instagram", medium: "social" },
  { label: "TikTok", source: "tiktok", medium: "social" },
  { label: "Discord", source: "discord", medium: "community" },
  { label: "WhatsApp", source: "whatsapp", medium: "chat" },
  { label: "YouTube", source: "youtube", medium: "video" },
] as const;

function SpotifyGenPage() {
  const plan = useQuestStore((s) => s.plan);
  const isVip = plan === "premium" || plan === "boost";

  const [source, setSource] = useState("neighborshub");
  const [medium, setMedium] = useState("community");
  const [campaign, setCampaign] = useState("premium_trimestral");
  const [content, setContent] = useState("");

  const link = useMemo(() => {
    const params = new URLSearchParams();
    if (source) params.set("utm_source", source);
    if (medium) params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    if (content) params.set("utm_content", content);
    const qs = params.toString();
    return qs ? `${BASE_URL}?${qs}` : BASE_URL;
  }, [source, medium, campaign, content]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado!");
    } catch {
      toast.error("Falha ao copiar");
    }
  };

  if (!isVip) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
            $ access --check
          </div>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            <Music className="h-6 w-6 text-[#1DB954]" />
            Gerador <span className="text-[#1DB954]">Spotify</span>
          </h1>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-amber/30 bg-surface/60 p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, #1DB954 20%, transparent), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-amber/40 bg-amber/10">
              <Lock className="h-6 w-6 text-amber" />
            </div>
            <h2 className="text-xl font-semibold text-ink">Exclusivo VIP</h2>
            <p className="max-w-md text-sm text-ink-dim">
              O gerador de links Spotify Premium Trimestral está disponível apenas para membros{" "}
              <span className="text-purple">Premium</span> ou{" "}
              <span className="text-cyan">Boost</span>.
            </p>
            <Link
              to="/hub"
              className="mt-2 inline-flex items-center gap-2 rounded-md border border-purple/40 bg-purple/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-purple hover:bg-purple/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              virar VIP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1DB954]">
          $ spotify --gen premium.trimestral
        </div>
        <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          <Music className="h-6 w-6 text-[#1DB954]" />
          Gerador <span className="text-[#1DB954]">Spotify Premium</span>
        </h1>
        <p className="mt-2 text-sm text-ink-dim">
          Personalize os parâmetros UTM e gere um link de{" "}
          <span className="text-ink">Spotify Premium Trimestral</span> para
          divulgação.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setSource(p.source);
              setMedium(p.medium);
            }}
            className="rounded-md border border-line bg-surface/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:border-[#1DB954]/50 hover:text-[#1DB954]"
          >
            + {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-xl border border-line bg-surface/60 p-4 scanline sm:grid-cols-2 sm:p-6">
        <Field label="utm_source" value={source} onChange={setSource} placeholder="ex: instagram" />
        <Field label="utm_medium" value={medium} onChange={setMedium} placeholder="ex: social" />
        <Field
          label="utm_campaign"
          value={campaign}
          onChange={setCampaign}
          placeholder="premium_trimestral"
        />
        <Field
          label="utm_content"
          value={content}
          onChange={setContent}
          placeholder="opcional"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/[0.04] p-4 sm:p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1DB954]">
          → link gerado
        </div>
        <div className="break-all rounded-md border border-line bg-background/70 px-3 py-3 font-mono text-xs text-ink sm:text-sm">
          {link}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            onClick={() => toast.success("Redirecionando pro Discord…")}
            className="inline-flex items-center gap-2 rounded-md bg-[#1DB954] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-black transition hover:brightness-110"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            comprar no discord
          </a>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface/60 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-dim hover:border-[#1DB954]/50 hover:text-[#1DB954]"
          >
            <Copy className="h-3.5 w-3.5" />
            copiar link
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-amber/25 bg-amber/[0.05] p-4 font-mono text-[11px] leading-relaxed text-amber/90">
        ⚠ apenas links oficiais do domínio spotify.com são gerados. UTM serve
        para rastrear a origem da divulgação — nada de conta gratuita/pirata.
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-line bg-background/70 px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-[#1DB954] focus:outline-none focus:ring-2 focus:ring-[#1DB954]/30"
      />
    </label>
  );
}
