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
  const [xsp, setXsp] = useState("");
  const [ua, setUa] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (creds) {
      setToken(creds.token);
      setXsp(creds.xSuperProperties ?? "");
      setUa(creds.userAgent ?? "");
    }
  }, [creds]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setCreds({
        token: token.trim(),
        xSuperProperties: xsp.trim() || undefined,
        userAgent: ua.trim() || undefined,
      });
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
    setXsp("");
    setUa("");
    toast.success("Token removido");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Token do Discord</h1>
        <p className="mt-1 text-sm text-slate-400">
          Cole seu token abaixo. Ele fica salvo apenas no seu navegador (localStorage) — nada é
          enviado para nenhum servidor além do próprio Discord (via proxy CORS).
        </p>
      </div>

      {creds && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-emerald-300">✓ Token salvo neste navegador</div>
            <button
              onClick={disconnect}
              className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      <form onSubmit={save} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <label className="text-sm font-medium">Token do Discord *</label>
          <p className="mt-1 text-xs text-slate-500">
            DevTools (F12) → Network → qualquer request → header <code>authorization</code>.
          </p>
          <input
            type="password"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="MTIzNDU2..."
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0f1218] px-3 py-2 text-sm font-mono focus:border-[#5865F2] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium">x-super-properties (opcional)</label>
          <textarea
            rows={2}
            value={xsp}
            onChange={(e) => setXsp(e.target.value)}
            placeholder="deixe vazio para usar o padrão"
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0f1218] px-3 py-2 text-xs font-mono focus:border-[#5865F2] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium">user-agent (opcional)</label>
          <textarea
            rows={2}
            value={ua}
            onChange={(e) => setUa(e.target.value)}
            placeholder="deixe vazio para usar o padrão"
            className="mt-2 w-full rounded-md border border-white/10 bg-[#0f1218] px-3 py-2 text-xs font-mono focus:border-[#5865F2] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !token}
          className="rounded-md bg-[#5865F2] px-4 py-2 text-sm font-semibold hover:bg-[#4752c4] disabled:opacity-50"
        >
          {saving ? "Validando..." : "Salvar e validar"}
        </button>
      </form>

      <div className="rounded-md border border-yellow-500/20 bg-yellow-500/[0.05] p-4 text-xs text-yellow-200/80">
        ⚠️ Usar automação com token pessoal viola os Termos do Discord e pode causar banimento —
        use por sua conta e risco.
      </div>
    </div>
  );
}
