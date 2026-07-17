import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfo } from "@/lib/quest-runner";
import { discordLogin } from "@/lib/discord.functions";
import { verifyTurnstile } from "@/lib/turnstile.functions";
import { Turnstile } from "@/components/Turnstile";
import { Hcaptcha } from "@/components/Hcaptcha";


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
  const [mfaMethods, setMfaMethods] = useState<string[]>([]);
  const [mfaMethod, setMfaMethod] = useState<"totp" | "backup" | "sms">("totp");
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [discordCaptcha, setDiscordCaptcha] = useState<{
    sitekey: string;
    rqdata?: string;
    rqtoken?: string;
  } | null>(null);
  const [discordCaptchaToken, setDiscordCaptchaToken] = useState<string | null>(null);

  const codeMaxLen = mfaMethod === "backup" ? 8 : 6;
  const codeMinLen = mfaMethod === "backup" ? 8 : 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaTicket && !captchaToken) {
      toast.error("Complete o captcha antes de entrar");
      return;
    }
    if (!mfaTicket && discordCaptcha && !discordCaptchaToken) {
      toast.error("Resolva o captcha do Discord");
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
          ? { mfaCode, ticket: mfaTicket, mfaMethod }
          : {
              login,
              password,
              captchaKey: discordCaptchaToken ?? undefined,
              captchaRqtoken: discordCaptcha?.rqtoken,
            },
      });
      if (res.ok) {
        setCreds({ token: res.token });
        const user = await fetchUserInfo();
        toast.success(
          `Conectado como ${(user as { username?: string } | null)?.username ?? "usuário"}`,
        );
        setPassword("");
        setMfaTicket(null);
        setMfaMethods([]);
        setMfaCode("");
        setDiscordCaptcha(null);
        setDiscordCaptchaToken(null);
        onLogged();
        return;
      }
      if ("mfa" in res && res.mfa && res.ticket) {
        setMfaTicket(res.ticket);
        const methods = (res as { methods?: string[] }).methods ?? ["totp"];
        const usable = methods.filter((m) => m === "totp" || m === "backup" || m === "sms");
        setMfaMethods(usable.length ? usable : ["totp"]);
        setMfaMethod(
          (usable.includes("totp") ? "totp" : (usable[0] as "totp" | "backup" | "sms")) ?? "totp",
        );
        setDiscordCaptcha(null);
        setDiscordCaptchaToken(null);
        toast.message("Autenticação de 2 fatores necessária", {
          description: "Digite o código do seu app autenticador ou um backup code.",
        });
        return;
      }
      if ("captcha" in res && res.captcha && res.sitekey) {
        setDiscordCaptcha({ sitekey: res.sitekey, rqdata: res.rqdata, rqtoken: res.rqtoken });
        setDiscordCaptchaToken(null);
        toast.message("Captcha do Discord necessário", {
          description: "Resolva o desafio abaixo e clique em entrar novamente.",
        });
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
      className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 scanline sm:p-6"
    >
      {!mfaTicket ? (
        <>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
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
              className="mt-2 block w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:border-[#5865F2] focus:outline-none focus:ring-2 focus:ring-[#5865F2]/40 sm:text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                senha
              </label>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-[#a5b4fc]"
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
              className="mt-2 block w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:border-[#5865F2] focus:outline-none focus:ring-2 focus:ring-[#5865F2]/40 sm:text-sm"
            />
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5b4fc]">
              ◆ verificação 2fa
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Sua conta tem 2FA ativada. Escolha o método e digite o código para concluir o login.
            </p>
          </div>

          {mfaMethods.length > 1 && (
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-white/10 bg-black/40 p-1">
              {mfaMethods.map((m) => {
                const label =
                  m === "totp" ? "🔐 App autenticador" : m === "backup" ? "🎫 Backup code" : "📱 SMS";
                const active = mfaMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMfaMethod(m as "totp" | "backup" | "sms");
                      setMfaCode("");
                    }}
                    className={`flex-1 rounded-md px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest transition ${
                      active
                        ? "bg-[#5865F2] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
              {mfaMethod === "backup"
                ? "backup code (8 dígitos ou alfanumérico)"
                : mfaMethod === "sms"
                  ? "código enviado por sms"
                  : "código do app autenticador (6 dígitos)"}
            </label>
            <input
              type="text"
              required
              inputMode={mfaMethod === "backup" ? "text" : "numeric"}
              autoComplete="one-time-code"
              autoFocus
              value={mfaCode}
              maxLength={mfaMethod === "backup" ? 12 : 8}
              onChange={(e) => {
                const raw = e.target.value;
                const cleaned =
                  mfaMethod === "backup"
                    ? raw.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 12)
                    : raw.replace(/\D/g, "").slice(0, 8);
                setMfaCode(cleaned);
              }}
              placeholder={mfaMethod === "backup" ? "xxxxxxxx" : "000000"}
              className="mt-2 block w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-center font-mono text-lg tracking-widest text-white placeholder:text-slate-500 focus:border-[#5865F2] focus:outline-none focus:ring-2 focus:ring-[#5865F2]/40"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setMfaTicket(null);
              setMfaMethods([]);
              setMfaCode("");
            }}
            className="font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-[#a5b4fc]"
          >
            ← voltar para email/senha
          </button>
        </div>
      )}

      {!mfaTicket && (
        <Turnstile
          onVerify={(t) => setCaptchaToken(t)}
          onExpire={() => setCaptchaToken(null)}
        />
      )}

      {!mfaTicket && discordCaptcha && (
        <div className="space-y-2 rounded-lg border border-[#5865F2]/30 bg-[#5865F2]/5 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5b4fc]">
            ◆ captcha do discord
          </div>
          <Hcaptcha
            sitekey={discordCaptcha.sitekey}
            rqdata={discordCaptcha.rqdata}
            onVerify={(t) => setDiscordCaptchaToken(t)}
            onExpire={() => setDiscordCaptchaToken(null)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          (mfaTicket
            ? mfaCode.replace(/[^a-zA-Z0-9]/g, "").length < codeMinLen ||
              mfaCode.replace(/[^a-zA-Z0-9]/g, "").length > codeMaxLen + 4
            : !login ||
              !password ||
              !captchaToken ||
              (discordCaptcha ? !discordCaptchaToken : false))
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading
          ? "entrando…"
          : mfaTicket
            ? mfaMethod === "backup"
              ? "→ usar backup code"
              : "→ confirmar 2fa"
            : "→ entrar"}
      </button>

      <p className="font-mono text-[10px] leading-relaxed text-slate-500">
        Se o Discord pedir captcha, resolva o desafio acima. Como alternativa,
        use a aba <span className="text-[#a5b4fc]">Token</span>.
      </p>

    </form>
  );
}
