import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfo } from "@/lib/quest-runner";
import { discordLogin } from "@/lib/discord.functions";
import { verifyTurnstile } from "@/lib/turnstile.functions";
import { Turnstile } from "@/components/Turnstile";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Login — Neighborshub" }] }),
  component: SettingsPage,
});

type Tab = "email" | "token";

function SettingsPage() {
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);

  const [tab, setTab] = useState<Tab>("email");
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
    toast.success("Sessão removida");
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
          $ auth --login
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Entrar na sua conta
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-dim">
          Escolha como quer logar. Fica salvo apenas no seu navegador (localStorage) e só é enviado
          para o Discord via proxy deste site.
        </p>
      </div>

      {creds && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-mint/30 bg-mint/[0.06] px-3 py-3 sm:px-4">
          <div className="min-w-0 font-mono text-[11px] uppercase tracking-widest text-mint">
            <span className="pulse-dot inline-block">●</span>
            <span className="ml-2 truncate">sessão ativa neste navegador</span>
          </div>
          <button
            onClick={disconnect}
            className="shrink-0 rounded-md border border-rose/40 bg-rose/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-rose hover:bg-rose/20"
          >
            sair
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface/50 p-1">
        <TabButton active={tab === "email"} onClick={() => setTab("email")}>
          📱 Email & senha
        </TabButton>
        <TabButton active={tab === "token"} onClick={() => setTab("token")}>
          🔑 Token
        </TabButton>
      </div>

      {tab === "email" ? (
        <EmailLoginForm onLogged={() => toast.success("Conectado!")} />
      ) : (
        <form
          onSubmit={save}
          className="space-y-5 rounded-xl border border-line bg-surface/60 p-4 scanline sm:p-6"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
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
            <p className="mt-1 text-xs leading-relaxed text-ink-mute">
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
              autoComplete="off"
              className="mt-3 block w-full rounded-md border border-line bg-background/70 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/40"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !token}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {saving ? "validando…" : "→ salvar & validar"}
          </button>
        </form>
      )}

      <div className="rounded-lg border border-amber/25 bg-amber/[0.05] p-4 font-mono text-[11px] leading-relaxed text-amber/90">
        ⚠ automação com conta pessoal viola os Termos do Discord e pode causar banimento — use por
        sua conta e risco.
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-widest transition ${
        active ? "bg-cyan text-primary-foreground" : "text-ink-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function EmailLoginForm({ onLogged }: { onLogged: () => void }) {
  const setCreds = useQuestStore((s) => s.setCreds);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [mfaTicket, setMfaTicket] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaTicket && !captchaToken) {
      toast.error("Complete o captcha antes de entrar");
      return;
    }
    setLoading(true);
    try {
      if (!mfaTicket && captchaToken) {
        const cap = await verifyTurnstile({ data: { token: captchaToken } });
        if (!cap.ok) {
          toast.error(cap.error);
          setCaptchaToken(null);
          window.turnstile?.reset();
          setLoading(false);
          return;
        }
      }
      const res = await discordLogin({
        data: mfaTicket
          ? { login, password, mfaCode, ticket: mfaTicket }
          : { login, password },
      });
      if (res.ok) {
        setCreds({ token: res.token });
        const user = await fetchUserInfo();
        toast.success(
          `Conectado como ${(user as { username?: string } | null)?.username ?? "usuário"}`,
        );
        setPassword("");
        setMfaTicket(null);
        setMfaCode("");
        onLogged();
        return;
      }
      if ("mfa" in res && res.mfa && res.ticket) {
        setMfaTicket(res.ticket);
        toast.message("Código de 2 fatores necessário");
        return;
      }
      toast.error(res.error ?? "Falha no login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-line bg-surface/60 p-4 scanline sm:p-6"
    >
      {!mfaTicket ? (
        <>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
              email ou telefone
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              inputMode="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="voce@exemplo.com"
              className="mt-2 block w-full rounded-md border border-line bg-background/70 px-3 py-3 text-base text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/40 sm:text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                senha
              </label>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-cyan"
              >
                {showPw ? "ocultar" : "mostrar"}
              </button>
            </div>
            <input
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 block w-full rounded-md border border-line bg-background/70 px-3 py-3 text-base text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/40 sm:text-sm"
            />
          </div>
        </>
      ) : (
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
            código 2FA (autenticador)
          </label>
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="000000"
            className="mt-2 block w-full rounded-md border border-line bg-background/70 px-3 py-3 text-center font-mono text-lg tracking-widest text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/40"
          />
          <button
            type="button"
            onClick={() => {
              setMfaTicket(null);
              setMfaCode("");
            }}
            className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-cyan"
          >
            ← voltar
          </button>
        </div>
      )}

      {!mfaTicket && (
        <Turnstile
          onVerify={(t) => setCaptchaToken(t)}
          onExpire={() => setCaptchaToken(null)}
        />
      )}

      <button
        type="submit"
        disabled={
          loading ||
          (mfaTicket ? mfaCode.length < 6 : !login || !password || !captchaToken)
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "entrando…" : mfaTicket ? "→ confirmar 2fa" : "→ entrar"}
      </button>

      <p className="font-mono text-[10px] leading-relaxed text-ink-mute">
        Se o Discord pedir captcha, use a aba <span className="text-cyan">Token</span> como
        alternativa.
      </p>
    </form>
  );
}
