import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteDiscordAccount,
  getDiscordAccountStatus,
  saveDiscordAccount,
} from "@/lib/discord.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Conta — DiscordHub" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const accountQ = useQuery({
    queryKey: ["discord-account"],
    queryFn: () => getDiscordAccountStatus(),
  });
  const [token, setToken] = useState("");
  const [xsp, setXsp] = useState("");
  const [ua, setUa] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveDiscordAccount({
        data: { token, xSuperProperties: xsp, userAgent: ua },
      });
      toast.success(`Conectado como ${res.user.username}`);
      setToken("");
      qc.invalidateQueries({ queryKey: ["discord-account"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async () => {
    if (!confirm("Remover a conta Discord conectada?")) return;
    await deleteDiscordAccount();
    qc.invalidateQueries({ queryKey: ["discord-account"] });
    toast.success("Desconectado");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conta Discord</h1>
        <p className="mt-1 text-sm text-slate-400">
          Cadastre seu token para o hub poder executar missões em seu nome.
        </p>
      </div>

      {accountQ.data && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-emerald-300">✓ Conectado</div>
              <div className="mt-1 font-medium">
                {accountQ.data.discord_global_name || accountQ.data.discord_username}
              </div>
            </div>
            <button
              onClick={disconnect}
              className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
            >
              Desconectar
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
        ⚠️ O token é armazenado criptografado. Usar automação com token pessoal viola os Termos do
        Discord e pode causar banimento — use por sua conta e risco.
      </div>
    </div>
  );
}
