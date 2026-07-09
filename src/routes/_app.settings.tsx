import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfo } from "@/lib/quest-runner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Token — DiscordHub" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);

  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (creds) setToken(creds.token);
  }, [creds]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setCreds({ token: token.trim() });
      const user = await fetchUserInfo();
      if (!user) throw new Error("Token inválido ou expirado");
      toast.success(`Conectado como ${(user as { username?: string }).username ?? "usuário"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao validar");
    } finally {
      setSaving(false);
    }
  };

  const disconnect = () => {
    if (!confirm("Remover o token salvo?")) return;
    setCreds(null);
    setToken("");
    toast.success("Token removido");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
          $ auth --set-token
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Token do Discord
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-dim">
          Cole seu token abaixo. Fica salvo apenas no seu navegador (localStorage); só é enviado
          para o Discord (via proxy CORS deste site).
        </p>
      </div>

      {creds && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-mint/30 bg-mint/[0.06] px-4 py-3 sm:flex sm:justify-between">
          <div className="min-w-0 font-mono text-[11px] uppercase tracking-widest text-mint">
            <span className="pulse-dot inline-block">●</span>
            <span className="ml-2">token ativo neste navegador</span>
          </div>
          <button
            onClick={disconnect}
            className="shrink-0 rounded-md border border-rose/40 bg-rose/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose hover:bg-rose/20"
          >
            ✕ remover
          </button>
        </div>
      )}

      <form
        onSubmit={save}
        className="space-y-5 rounded-xl border border-line bg-surface/60 p-6 scanline"
      >
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
              authorization
            </label>
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-cyan"
            >
              {show ? "ocultar" : "mostrar"}
            </button>
          </div>
          <p className="mt-1 text-xs text-ink-mute">
            DevTools (F12) → Network → qualquer request → header{" "}
            <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[11px] text-cyan">
              authorization
            </code>
            .
          </p>
          <input
            type={show ? "text" : "password"}
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4.XxXxXx.…"
            className="mt-3 block w-full rounded-md border border-line bg-background/70 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/40"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !token}
          className="inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "validando…" : "→ salvar & validar"}
        </button>
      </form>

      <div className="rounded-lg border border-amber/25 bg-amber/[0.05] p-4 font-mono text-[11px] leading-relaxed text-amber/90">
        ⚠ usar automação com token pessoal viola os Termos do Discord e pode causar banimento — use
        por sua conta e risco.
      </div>
    </div>
  );
}
