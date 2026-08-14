import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Music, Lock, Sparkles } from "lucide-react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { Button, Card, Field, Input, buttonClass } from "@/components/ui/ds";

export const Route = createFileRoute("/_app/spotify")({
  head: () => ({
    meta: [
      { title: "Gerador Spotify — Em breve — Neighborshub" },
      {
        name: "description",
        content: "O gerador Spotify do Neighborshub está em desenvolvimento.",
      },
    ],
  }),
  component: () => (
    <ComingSoon
      name="Gerador Spotify"
      icon={Music}
      eyebrow="spotify --soon"
      description="Gerador Spotify está em desenvolvimento e estará disponível em breve."
    />
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars


const BASE_URL = "https://www.spotify.com/br-pt/premium/";
const DISCORD_INVITE = "https://discord.gg/JK7cC9je87";

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
      <div className="page-stack">
        <PageHeader
          eyebrow="access --check"
          icon={Music}
          title="Gerador"
          highlight="Spotify"
          description="O gerador Spotify Premium é exclusivo para membros VIP."
        />

        <Card>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[color-mix(in_oklab,var(--warn)_40%,transparent)] bg-[color-mix(in_oklab,var(--warn)_10%,transparent)]">
              <Lock className="h-6 w-6 text-[var(--warn)]" />
            </div>
            <h2 className="ds-h3">Exclusivo VIP</h2>
            <p className="max-w-md ds-body">
              O gerador de links Spotify Premium Trimestral está disponível apenas para membros{" "}
              <span className="text-[var(--primary)]">Premium</span> ou{" "}
              <span className="text-[var(--primary)]">Boost</span>.
            </p>
            <Link to="/hub" className={buttonClass("primary", "sm", "mt-2")}>
              <Sparkles className="h-3.5 w-3.5" />
              virar VIP
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="spotify --gen premium"
        icon={Music}
        title="Gerador"
        highlight="Spotify Premium"
        description="Personalize os parâmetros UTM e gere um link de Spotify Premium Trimestral para divulgação."
      />

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            variant="secondary"
            size="sm"
            onClick={() => {
              setSource(p.source);
              setMedium(p.medium);
            }}
          >
            + {p.label}
          </Button>
        ))}
      </div>

      <Card className="grid gap-4 sm:grid-cols-2">
        <UtmField label="utm_source" value={source} onChange={setSource} placeholder="ex: instagram" />
        <UtmField label="utm_medium" value={medium} onChange={setMedium} placeholder="ex: social" />
        <UtmField
          label="utm_campaign"
          value={campaign}
          onChange={setCampaign}
          placeholder="premium_trimestral"
        />
        <UtmField
          label="utm_content"
          value={content}
          onChange={setContent}
          placeholder="opcional"
        />
      </Card>

      <Card className="space-y-3">
        <div className="ds-label">→ link gerado</div>
        <div className="break-all rounded-md border border-[var(--border-1)] bg-[#0a0a0a] px-3 py-3 font-mono text-xs text-[var(--text-1)] sm:text-sm">
          {link}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            onClick={() => toast.success("Redirecionando pro Discord…")}
            className={buttonClass("primary")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            comprar no discord
          </a>
          <Button variant="secondary" onClick={copy}>
            <Copy className="h-3.5 w-3.5" />
            copiar link
          </Button>
        </div>
      </Card>

      <div className="rounded-lg border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_5%,transparent)] p-4 ds-small">
        ⚠ apenas links oficiais do domínio spotify.com são gerados. UTM serve
        para rastrear a origem da divulgação — nada de conta gratuita/pirata.
      </div>
    </div>
  );
}

function UtmField({
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
    <Field label={label}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className="font-mono"
      />
    </Field>
  );
}
