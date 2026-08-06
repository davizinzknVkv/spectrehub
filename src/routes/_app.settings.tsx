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
import { KeyRound, Mail, ShieldCheck, Copy, Star, BookOpen, Eye, EyeOff, HelpCircle, AlertTriangle, Lock, type LucideIcon } from "lucide-react";
import { Badge, Button, Card, Field, Input, Modal } from "@/components/ui/ds";
import step1 from "@/assets/tutorial-step-1.png.asset.json";
import step2 from "@/assets/tutorial-step-2.png.asset.json";
import step3 from "@/assets/tutorial-step-3.png.asset.json";
import step4 from "@/assets/tutorial-step-4.png.asset.json";
import step5 from "@/assets/tutorial-step-5.png.asset.json";

const TOKEN_BOOKMARKLET =
  `javascript:(function(){try{var i=document.createElement('iframe');document.body.appendChild(i);var t=i.contentWindow.localStorage.token;i.remove();if(!t){alert('Token não encontrado. Faça login no Discord no mesmo navegador.');return;}var v=t.replace(/^"|"$/g,'');window.prompt('Seu token do Discord (Ctrl+C para copiar):',v);}catch(e){alert('Erro: '+e.message);}})();`;



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

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const disconnect = () => {
    setConfirmDisconnect(false);
    setCreds(null);
    setToken("");
    toast.success("Sessão removida");
  };

  const disconnectModal = confirmDisconnect ? (
    <Modal
      title="Remover token salvo?"
      description="O token será apagado deste navegador e você será desconectado do hub."
      onClose={() => setConfirmDisconnect(false)}
      actions={
        <>
          <Button variant="ghost" onClick={() => setConfirmDisconnect(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={disconnect}>
            Remover
          </Button>
        </>
      }
    />
  ) : null;


  return (
    <div className="page-stack">
      {disconnectModal}

      <PageHeader
        eyebrow="auth --gateway"
        icon={KeyRound}
        title="Portal de"
        highlight="Acesso"
        description="Vincule sua conta para ativar os recursos premium. Seus dados são processados localmente e nunca são compartilhados com terceiros."
      />

      <div className="mx-auto w-full max-w-xl space-y-4">
        {creds && (
          <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 !py-3">
            <div className="min-w-0">
              <Badge variant="success">
                <span className="pulse-dot inline-block">●</span>
                <span className="ml-1 truncate">sessão ativa neste navegador</span>
              </Badge>
            </div>
            <Button variant="danger" size="sm" onClick={() => setConfirmDisconnect(true)} className="shrink-0">
              sair
            </Button>
          </Card>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-[var(--r-md)] border border-[var(--border-1)] bg-[var(--surface-1)] p-1">
          <TabButton active={tab === "email"} onClick={() => setTab("email")} icon={Mail}>
            email & senha
          </TabButton>
          <TabButton active={tab === "token"} onClick={() => setTab("token")} icon={KeyRound}>
            token
          </TabButton>
        </div>

        {tab === "email" ? (
          <EmailLoginForm onLogged={() => toast.success("Conectado!")} />
        ) : (
          <form onSubmit={save} className="ds-card space-y-5">
            <Field
              label="authorization"
              hint={
                <>
                  Cole abaixo o token do Discord. Veja o tutorial se não souber como pegar.
                </>
              }
            >
              <Input
                type={show ? "text" : "password"}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4.XxXxXx.…"
                autoComplete="off"
                className="font-mono"
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="submit" variant="primary" disabled={saving || !token}>
                {saving ? "validando…" : "→ salvar & validar"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShow((v) => !v)}>
                {show ? "ocultar token" : "mostrar token"}
              </Button>
            </div>

            <TokenTutorial />
          </form>
        )}

        <div className="rounded-[var(--r-md)] border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_5%,transparent)] p-4 ds-small">
          ⚠ automação com conta pessoal viola os Termos do Discord e pode causar banimento — use por
          sua conta e risco.
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex items-center justify-center gap-2 rounded-[var(--r-sm)] px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
        active
          ? "bg-[var(--accent-1)] text-[#0a0a12]"
          : "text-[var(--text-3)] hover:bg-white/[0.04] hover:text-[var(--text-1)]"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

function TokenTutorial() {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TOKEN_BOOKMARKLET);
      setCopied(true);
      toast.success("Bookmarklet copiado!", {
        description: "Agora crie um favorito e cole este código na URL.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o código.");
    }
  };

  const maskCode = (code: string) => {
    return code.substring(0, 20) + "..." + code.substring(code.length - 20);
  };

  return (
    <details className="group rounded-[var(--r-md)] border border-[var(--border-1)] bg-[var(--surface-1)]/60 open:bg-[var(--surface-1)]">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-[12px] font-semibold uppercase tracking-widest text-[var(--text-2)] hover:text-[var(--text-1)]">
        <BookOpen className="h-3.5 w-3.5 text-[var(--accent-soft)]" />
        como pegar meu token?
        <span className="ml-auto text-[10px] text-[var(--text-3)] transition group-open:rotate-180">
          ▾
        </span>
      </summary>

      <div className="space-y-6 border-t border-[var(--border-1)] px-4 py-4">
        <div className="space-y-1">
          <div className="ds-label text-[var(--accent-soft)]">
            método rápido — favorito (bookmarklet)
          </div>
          <p className="ds-small">
            O Discord bloqueia colar código no console. A forma mais fácil é criar um <b>favorito</b>{" "}
            com o código abaixo e clicar nele estando logado em{" "}
            <code className="font-mono">discord.com</code>.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-1)] text-[10px] font-bold text-[#0a0a12]">
                1
              </span>
              <div className="space-y-2 flex-1">
                <span className="ds-small block">
                  Abra <code className="font-mono">discord.com</code>, faça login e clique na{" "}
                  <b>estrela</b> para adicionar aos favoritos.
                </span>
                <img
                  src={step1.url}
                  alt="Passo 1"
                  className="w-full rounded-lg border border-[var(--border-1)] bg-black/20 shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-1)] text-[10px] font-bold text-[#0a0a12]">
                2
              </span>
              <div className="space-y-2 flex-1">
                <span className="ds-small block">
                  Na janela que abrir, clique em <b>Mais...</b> ou <b>Escolher outra pasta...</b> para
                  editar a URL.
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={step2.url}
                    alt="Passo 2"
                    className="w-full rounded-lg border border-[var(--border-1)] bg-black/20 shadow-lg"
                  />
                  <img
                    src={step3.url}
                    alt="Passo 3"
                    className="w-full rounded-lg border border-[var(--border-1)] bg-black/20 shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-1)] text-[10px] font-bold text-[#0a0a12]">
                3
              </span>
              <div className="space-y-2 flex-1">
                <span className="ds-small block">
                  Em Nome coloque <b>PEGARTOKEN</b> e em URL cole o <b>CÓDIGO ABAIXO</b>. Salve o
                  favorito.
                </span>
                <img
                  src={step4.url}
                  alt="Passo 4"
                  className="w-full rounded-lg border border-[var(--border-1)] bg-black/20 shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-1)] text-[10px] font-bold text-[#0a0a12]">
                4
              </span>
              <div className="space-y-2 flex-1">
                <span className="ds-small block">
                  Digite o nome que você deu ao favorito na barra de endereços e <b>clique nele</b>{" "}
                  para mostrar seu token.
                </span>
                <img
                  src={step5.url}
                  alt="Passo 5"
                  className="w-full rounded-lg border border-[var(--border-1)] bg-black/20 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--r-sm)] border border-[var(--border-1)] bg-[#050505] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="ds-label text-[var(--text-3)]">código do favorito</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={copy}>
                <Copy className="mr-1 h-3 w-3" />
                {copied ? "copiado" : "copiar"}
              </Button>
            </div>
          </div>
          <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all font-mono text-[10px] leading-relaxed text-[var(--accent-soft)]">
            {showCode ? TOKEN_BOOKMARKLET : maskCode(TOKEN_BOOKMARKLET)}
          </pre>
        </div>

        <div className="space-y-1 border-t border-[var(--border-1)] pt-3">
          <div className="ds-label text-[var(--text-2)]">método manual (DevTools)</div>
          <ol className="space-y-1 ds-small">
            <li>
              1. Em <code className="font-mono">discord.com</code>, aperte <b>F12</b> → aba{" "}
              <b>Application</b>.
            </li>
            <li>
              2. Menu esquerdo: <b>Storage → Local storage → https://discord.com</b>.
            </li>
            <li>
              3. Procure a chave <code className="font-mono text-[var(--accent-soft)]">token</code> e
              copie o valor (sem as aspas).
            </li>
          </ol>
          <p className="ds-small text-[var(--text-3)]">
            ⚠ Nunca compartilhe seu token com ninguém — ele dá acesso total à sua conta.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-[var(--r-sm)] border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_5%,transparent)] p-2 ds-small">
          <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--warn)]" />
          <span>
            Se a chave <code className="font-mono">token</code> não aparecer no Local Storage, use o
            método do favorito acima — o Discord esconde a chave quando o DevTools está aberto.
          </span>
        </div>
        {/* FAQ & Security Section */}
        <div className="mt-8 grid gap-4 border-t border-[var(--border-1)] pt-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--accent-soft)]">
              <HelpCircle className="h-4 w-4" />
              <span className="ds-label !text-inherit">FAQ — Perguntas Frequentes</span>
            </div>
            <div className="space-y-4">
              <details className="group text-[11px]">
                <summary className="cursor-pointer font-semibold text-[var(--text-2)] hover:text-[var(--text-1)]">
                  O que acontece se eu perder meu token?
                </summary>
                <p className="mt-1 text-[var(--text-3)] leading-relaxed">
                  Se você perder o token, basta repetir o processo do tutorial. O token muda sempre
                  que você altera sua senha do Discord ou ativa/desativa a 2FA.
                </p>
              </details>
              <details className="group text-[11px]">
                <summary className="cursor-pointer font-semibold text-[var(--text-2)] hover:text-[var(--text-1)]">
                  O NeighborD salva minha senha?
                </summary>
                <p className="mt-1 text-[var(--text-3)] leading-relaxed">
                  Não. Se usar o login por email/senha, os dados são enviados diretamente ao Discord
                  via proxy e o token resultante é salvo apenas no <b>seu</b> navegador (LocalStorage).
                </p>
              </details>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--danger)]">
              <AlertTriangle className="h-4 w-4" />
              <span className="ds-label !text-inherit">Segurança & Riscos</span>
            </div>
            <ul className="space-y-2 ds-small text-[var(--text-3)]">
              <li className="flex gap-2">
                <Lock className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent-soft)]" />
                <span>
                  <b>Acesso Total:</b> Seu token dá acesso total à sua conta. Nunca o envie para
                  ninguém, nem para o suporte do NeighborD.
                </span>
              </li>
              <li className="flex gap-2">
                <Lock className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent-soft)]" />
                <span>
                  <b>Onde guardar:</b> Se for salvar fora daqui, use um gerenciador de senhas (Bitwarden,
                  1Password) ou um arquivo criptografado.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </details>

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
  // true depois que o Turnstile foi validado no servidor (token é single-use)
  const [humanVerified, setHumanVerified] = useState(false);

  const codeMaxLen = mfaMethod === "backup" ? 8 : 6;
  const codeMinLen = mfaMethod === "backup" ? 8 : 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaTicket && !humanVerified && !captchaToken) {
      toast.error("Complete o captcha antes de entrar");
      return;
    }
    if (!mfaTicket && discordCaptcha && !discordCaptchaToken) {
      toast.error("Resolva o captcha do Discord");
      return;
    }
    setLoading(true);
    try {
      // Turnstile só é validado uma vez (token single-use). Depois disso o
      // fluxo segue para o hCaptcha do Discord sem re-renderizar o Turnstile.
      if (!mfaTicket && !humanVerified && captchaToken) {
        const cap = await verifyTurnstile({ data: { token: captchaToken } });
        setCaptchaToken(null);
        if (!cap.ok) {
          toast.error(cap.error);
          window.turnstile?.reset();
          setLoading(false);
          return;
        }
        setHumanVerified(true);
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
        setHumanVerified(false);
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
                className="ds-small uppercase tracking-widest transition hover:text-[var(--accent-soft)]"
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
          <div className="flex items-start gap-3 rounded-[var(--r-md)] border border-[var(--border-1)] bg-white/[0.02] p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-soft)]" />
            <div className="min-w-0">
              <div className="ds-label text-[var(--accent-soft)]">protocolo 2fa ativado</div>
              <p className="mt-1 ds-small">
                Esta conta exige um segundo fator de autenticação. Insira o código gerado pelo seu dispositivo de segurança.
              </p>
            </div>
          </div>


          {mfaMethods.length > 1 && (
            <div className="flex flex-wrap gap-1 rounded-[var(--r-md)] border border-[var(--border-1)] bg-[var(--surface-1)] p-1">
              {mfaMethods.map((m) => {
                const label =
                  m === "totp" ? "app autenticador" : m === "backup" ? "backup code" : "sms";
                const active = mfaMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMfaMethod(m as "totp" | "backup" | "sms");
                      setMfaCode("");
                      setMfaError(null);
                    }}
                    className={`flex-1 rounded-[var(--r-sm)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition ${
                      active
                        ? "bg-[var(--accent-1)] text-[#0a0a12]"
                        : "text-[var(--text-3)] hover:bg-white/[0.04] hover:text-[var(--text-1)]"
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
                if (mfaError) setMfaError(null);
              }}
              placeholder={mfaMethod === "backup" ? "xxxxxxxx" : "000000"}
              className={`text-center font-mono text-lg tracking-widest ${
                mfaError ? "border-[color-mix(in_oklab,var(--danger)_55%,transparent)]" : ""
              }`}
            />
          </Field>

          {mfaError && (
            <div
              role="alert"
              className="rounded-[var(--r-md)] border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--danger)]"
            >
              ✕ {mfaError}
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setMfaTicket(null);
              setMfaMethods([]);
              setMfaCode("");
              setMfaError(null);
            }}
          >
            ← voltar para email/senha
          </Button>
        </div>
      )}

      {/* etapa 1: verificação humana (Turnstile). Some assim que validada
          para não conflitar com o hCaptcha do Discord. */}
      {!mfaTicket && !humanVerified && !discordCaptcha && (
        <Turnstile
          onVerify={(t) => setCaptchaToken(t)}
          onExpire={() => setCaptchaToken(null)}
        />
      )}

      {!mfaTicket && humanVerified && !discordCaptcha && (
        <div className="flex items-center justify-between gap-3 rounded-[var(--r-md)] border border-[color-mix(in_oklab,var(--ok,#22c55e)_25%,transparent)] bg-[color-mix(in_oklab,var(--ok,#22c55e)_6%,transparent)] px-3 py-2">
          <span className="ds-small">✓ verificação humana concluída</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setHumanVerified(false);
              setCaptchaToken(null);
            }}
          >
            refazer
          </Button>
        </div>
      )}

      {/* etapa 2: captcha exigido pelo Discord (hCaptcha) — renderizado sozinho */}
      {!mfaTicket && discordCaptcha && (
        <div className="space-y-2 rounded-[var(--r-md)] border border-[color-mix(in_oklab,var(--accent-1)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent-1)_5%,transparent)] p-3">
          <div className="ds-label text-[var(--accent-soft)]">captcha do discord</div>
          <Hcaptcha
            key={discordCaptcha.sitekey + (discordCaptcha.rqdata ?? "")}
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
              (!humanVerified && !captchaToken) ||
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
