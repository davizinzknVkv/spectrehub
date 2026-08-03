import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfo } from "@/lib/quest-runner";
import { discordLogin } from "@/lib/discord.functions";
import { verifyTurnstile } from "@/lib/turnstile.functions";
import { Turnstile } from "@/components/Turnstile";
import { Hcaptcha } from "@/components/Hcaptcha";
import { PageHeader } from "@/components/PageHeader";
import { KeyRound } from "lucide-react";
import { Badge, Button, Card, Field, Input } from "@/components/ui/ds";



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
    <div className="page-stack">
      <PageHeader
        eyebrow="auth --login"
        icon={KeyRound}
        title="Entrar na sua"
        highlight="conta"
        description="Escolha como quer logar. Fica salvo apenas no seu navegador (localStorage) e só é enviado para o Discord via proxy deste site."
      />

      {creds && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--ok)_30%,transparent)] bg-[color-mix(in_oklab,var(--ok)_6%,transparent)] px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <Badge variant="success">
              <span className="pulse-dot inline-block">●</span>
              <span className="ml-1 truncate">sessão ativa neste navegador</span>
            </Badge>
          </div>
          <Button variant="danger" size="sm" onClick={disconnect} className="shrink-0">
            sair
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-[var(--border-1)] bg-[var(--surface-1)] p-1">
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
        <form onSubmit={save} className="ds-card space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="ds-label">authorization</span>
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="ds-small uppercase tracking-widest hover:text-[var(--text-1)]"
                >
                  {show ? "ocultar" : "mostrar"}
                </button>
              </div>
              <p className="mt-1 ds-small">
                DevTools (F12) → Network → qualquer request → header{" "}
                <code className="rounded bg-[#0a0a0a] px-1 py-0.5 font-mono text-[11px] text-[var(--accent-soft)]">
                  authorization
                </code>
                .
              </p>
              <Input
                type={show ? "text" : "password"}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4.XxXxXx.…"
                autoComplete="off"
                className="mt-3 font-mono"
              />
            </div>

            <Button type="submit" variant="primary" disabled={saving || !token} className="w-full sm:w-auto">
              {saving ? "validando…" : "→ salvar & validar"}
            </Button>
        </form>
      )}

      <div className="rounded-lg border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_5%,transparent)] p-4 ds-small">
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
      className={`rounded-md px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-widest transition ${
        active ? "bg-[var(--accent-1)] text-[#0a0a12]" : "text-[var(--text-3)] hover:text-[var(--text-1)]"
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
  const [mfaError, setMfaError] = useState<string | null>(null);

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
        setMfaError(null);
        setDiscordCaptcha(null);
        setDiscordCaptchaToken(null);
        onLogged();
        return;
      }
      if ("mfa" in res && res.mfa && res.ticket) {
        setMfaTicket(res.ticket);
        setMfaError(null);
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
      if ("mfaInvalid" in res && res.mfaInvalid) {
        // stay on the 2FA step, keep/refresh ticket and surface the error
        if (res.ticket) setMfaTicket(res.ticket);
        setMfaCode("");
        setMfaError(res.error ?? "Código 2FA inválido.");
        toast.error(res.error ?? "Código 2FA inválido.");
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
    <form onSubmit={submit} className="ds-card space-y-4">
      {!mfaTicket ? (
        <>
          <Field label="email ou telefone">
            <Input
              type="text"
              required
              autoComplete="username"
              inputMode="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="voce@exemplo.com"
            />
          </Field>
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="ds-label">senha</span>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="ds-small uppercase tracking-widest hover:text-[var(--accent-soft)]"
              >
                {showPw ? "ocultar" : "mostrar"}
              </button>
            </div>
            <Input
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2"
            />
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="ds-label text-[var(--accent-soft)]">◆ verificação 2fa</div>
            <p className="mt-1 ds-small">
              Sua conta tem 2FA ativada. Escolha o método e digite o código para concluir o login.
            </p>
          </div>

          {mfaMethods.length > 1 && (
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-[var(--border-1)] bg-[#0a0a0a] p-1">
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
                    className={`flex-1 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition ${
                      active
                        ? "bg-[var(--accent-1)] text-[#0a0a12]"
                        : "text-[var(--text-3)] hover:text-[var(--text-1)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <Field
            label={
              mfaMethod === "backup"
                ? "backup code (8 dígitos ou alfanumérico)"
                : mfaMethod === "sms"
                  ? "código enviado por sms"
                  : "código do app autenticador (6 dígitos)"
            }
          >
            <Input
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
              className="text-center font-mono text-lg tracking-widest"
            />
          </Field>

          <button
            type="button"
            onClick={() => {
              setMfaTicket(null);
              setMfaMethods([]);
              setMfaCode("");
            }}
            className="ds-small uppercase tracking-widest hover:text-[var(--accent-soft)]"
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
        <div className="space-y-2 rounded-lg border border-[color-mix(in_oklab,var(--accent-1)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-1)_5%,transparent)] p-3">
          <div className="ds-label text-[var(--accent-soft)]">◆ captcha do discord</div>
          <Hcaptcha
            sitekey={discordCaptcha.sitekey}
            rqdata={discordCaptcha.rqdata}
            onVerify={(t) => setDiscordCaptchaToken(t)}
            onExpire={() => setDiscordCaptchaToken(null)}
          />
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
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
      >
        {loading
          ? "entrando…"
          : mfaTicket
            ? mfaMethod === "backup"
              ? "→ usar backup code"
              : "→ confirmar 2fa"
            : "→ entrar"}
      </Button>

      <p className="ds-small">
        Se o Discord pedir captcha, resolva o desafio acima. Como alternativa,
        use a aba <span className="text-[var(--accent-soft)]">Token</span>.
      </p>

    </form>
  );
}
