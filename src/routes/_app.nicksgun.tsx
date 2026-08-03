import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Crosshair, Loader2, Play, Square, ExternalLink, Trash2 } from "lucide-react";
import { checkDiscordUsername } from "@/lib/nicks.functions";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { Button, Card, EmptyState, Field, Input } from "@/components/ui/ds";

export const Route = createFileRoute("/_app/nicksgun")({
  head: () => ({ meta: [{ title: "Nicks-Gun — Em breve — Neighborshub" }] }),
  component: () => (
    <ComingSoon
      name="Nicks-Gun"
      icon={Crosshair}
      eyebrow="nicks --soon"
      description="Nicks-Gun está em desenvolvimento e estará disponível em breve."
    />
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars


type Charset = "letters" | "alnum" | "full";
type Result = { username: string; available: boolean };

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const EXTRAS = "_.";

function charsetFor(mode: Charset): string {
  if (mode === "letters") return LETTERS;
  if (mode === "alnum") return LETTERS + DIGITS;
  return LETTERS + DIGITS + EXTRAS;
}

function isValidUsername(u: string): boolean {
  if (u.length < 2 || u.length > 32) return false;
  if (!/^[a-z0-9_.]+$/.test(u)) return false;
  if (u.startsWith(".") || u.endsWith(".")) return false;
  if (u.includes("..")) return false;
  return true;
}

function generateCandidates(length: 2 | 3, mode: Charset, startsWith: string): string[] {
  const chars = charsetFor(mode).split("");
  const prefix = startsWith.toLowerCase().trim();
  if (prefix.length >= length) {
    return isValidUsername(prefix.slice(0, length)) ? [prefix.slice(0, length)] : [];
  }
  const remaining = length - prefix.length;
  const out: string[] = [];
  const build = (acc: string, depth: number) => {
    if (depth === 0) {
      const u = prefix + acc;
      if (isValidUsername(u)) out.push(u);
      return;
    }
    for (const c of chars) build(acc + c, depth - 1);
  };
  build("", remaining);
  return out;
}

function NicksGunPage() {
  const [length, setLength] = useState<2 | 3>(2);
  const [charset, setCharset] = useState<Charset>("letters");
  const [startsWith, setStartsWith] = useState("");
  const [concurrency, setConcurrency] = useState(4);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [checked, setChecked] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState<string>("");
  const stopRef = useRef(false);

  const availableCount = results.length;

  const estimate = useMemo(() => {
    return generateCandidates(length, charset, startsWith).length;
  }, [length, charset, startsWith]);

  const start = useCallback(async () => {
    const candidates = generateCandidates(length, charset, startsWith);
    if (candidates.length === 0) {
      toast.error("Nenhum candidato válido com esse filtro");
      return;
    }
    if (candidates.length > 5000) {
      const ok = window.confirm(
        `Serão testados ${candidates.length} nomes. Isso pode levar bastante tempo. Continuar?`,
      );
      if (!ok) return;
    }
    stopRef.current = false;
    setRunning(true);
    setResults([]);
    setChecked(0);
    setTotal(candidates.length);
    setCurrent("");

    const queue = candidates.slice();
    let cooldownUntil = 0;

    const worker = async () => {
      while (!stopRef.current) {
        const u = queue.shift();
        if (!u) return;
        // Global cooldown se Discord pediu rate limit
        const now = Date.now();
        if (cooldownUntil > now) {
          await new Promise((r) => setTimeout(r, cooldownUntil - now));
        }
        setCurrent(u);
        try {
          const res = await checkDiscordUsername({ data: { username: u } });
          if (res.ok) {
            if (res.available) {
              setResults((prev) => [{ username: res.username, available: true }, ...prev]);
            }
          } else if ("rateLimited" in res && res.rateLimited) {
            cooldownUntil = Date.now() + res.retryAfterMs;
            queue.unshift(u); // recoloca
            continue;
          }
        } catch {
          // ignore, segue
        }
        setChecked((c) => c + 1);
      }
    };

    const workers = Array.from({ length: Math.max(1, Math.min(8, concurrency)) }, () => worker());
    await Promise.all(workers);
    setRunning(false);
    setCurrent("");
    if (!stopRef.current) toast.success("Varredura concluída");
  }, [length, charset, startsWith, concurrency]);

  const stop = useCallback(() => {
    stopRef.current = true;
    toast.message("Parando...");
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setChecked(0);
    setTotal(0);
  }, []);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${text} copiado`));
  };

  const progress = total > 0 ? (checked / total) * 100 : 0;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="username sniper"
        icon={Crosshair}
        title="Nicks-"
        highlight="Gun"
        description={
          <>
            Encontre usernames globais do Discord de{" "}
            <span className="text-[var(--text-1)]">2 ou 3 letras</span> que estão{" "}
            <span className="text-[var(--ok)]">disponíveis</span> para registrar.
          </>
        }
      />

      {/* Controles */}
      <Card>
        <div className="card-grid-sm">
          {/* Length */}
          <div>
            <span className="ds-label">tamanho</span>
            <div className="mt-2 flex gap-1 rounded-lg border border-[var(--border-1)] bg-black/40 p-1">
              {[2, 3].map((n) => (
                <button
                  key={n}
                  disabled={running}
                  onClick={() => setLength(n as 2 | 3)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold uppercase tracking-widest transition ${
                    length === n
                      ? "bg-[var(--accent-1)] text-[#0a0a12]"
                      : "text-[var(--text-3)] hover:text-[var(--text-1)]"
                  } disabled:opacity-50`}
                >
                  {n} letras
                </button>
              ))}
            </div>
          </div>

          {/* Charset */}
          <Field label="caracteres">
            <select
              disabled={running}
              value={charset}
              onChange={(e) => setCharset(e.target.value as Charset)}
              className="ds-input disabled:opacity-50"
            >
              <option value="letters">apenas a-z</option>
              <option value="alnum">a-z + 0-9</option>
              <option value="full">a-z + 0-9 + _ .</option>
            </select>
          </Field>

          {/* Starts with */}
          <Field label="começa com (opcional)">
            <Input
              disabled={running}
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
              maxLength={length}
              placeholder="ex: a"
              className="font-mono disabled:opacity-50"
            />
          </Field>

          {/* Concurrency */}
          <Field label="velocidade">
            <select
              disabled={running}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="ds-input disabled:opacity-50"
            >
              <option value={1}>1x (lenta)</option>
              <option value={2}>2x</option>
              <option value={4}>4x (padrão)</option>
              <option value={6}>6x</option>
              <option value={8}>8x (agressiva)</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!running ? (
            <Button variant="primary" onClick={start}>
              <Play className="h-3.5 w-3.5" /> iniciar varredura
            </Button>
          ) : (
            <Button variant="danger" onClick={stop}>
              <Square className="h-3.5 w-3.5" /> parar
            </Button>
          )}
          {results.length > 0 && !running && (
            <Button variant="ghost" onClick={clear}>
              <Trash2 className="h-3.5 w-3.5" /> limpar
            </Button>
          )}
          <span className="ds-small">
            ~{estimate.toLocaleString("pt-BR")} candidatos
          </span>
        </div>
      </Card>

      {/* Progresso */}
      {(running || total > 0) && (
        <Card>
          <div className="flex items-baseline justify-between gap-4">
            <div className="ds-label">progresso</div>
            <div className="ds-small">
              {checked.toLocaleString("pt-BR")} / {total.toLocaleString("pt-BR")}
              {running && current && (
                <span className="ml-3 text-[var(--accent-soft)]">testando: {current}</span>
              )}
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-[var(--accent-1)] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-4 ds-small">
            <span>
              disponíveis:{" "}
              <span className="text-[var(--ok)]">{availableCount.toLocaleString("pt-BR")}</span>
            </span>
            <span>
              taxa:{" "}
              <span className="text-[var(--text-1)]">
                {checked > 0 ? ((availableCount / checked) * 100).toFixed(1) : "0"}%
              </span>
            </span>
          </div>
        </Card>
      )}

      {/* Resultados */}
      {results.length === 0 ? (
        <EmptyState
          icon={running ? Loader2 : undefined}
          title={running ? "Escaneando..." : "Nenhum resultado ainda"}
          description={
            running
              ? "Nomes disponíveis vão aparecer aqui."
              : "Configure os filtros acima e clique em iniciar varredura."
          }
        />
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((r) => (
            <div
              key={r.username}
              className="group flex items-center justify-between gap-2 rounded-lg border border-[color-mix(in_oklab,var(--ok)_20%,transparent)] bg-[color-mix(in_oklab,var(--ok)_5%,transparent)] px-3 py-2.5 transition hover:border-[color-mix(in_oklab,var(--ok)_50%,transparent)]"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-[var(--text-1)]">@{r.username}</div>
                <div className="ds-small uppercase tracking-widest text-[var(--ok)]">
                  disponível
                </div>
              </div>
              <button
                onClick={() => copy(r.username)}
                className="rounded-md p-1.5 text-[var(--text-3)] hover:bg-white/5 hover:text-[var(--text-1)]"
                title="Copiar"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <a
                href="https://discord.com/register"
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 text-[var(--text-3)] hover:bg-white/5 hover:text-[var(--accent-soft)]"
                title="Registrar no Discord"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_5%,transparent)] p-3 ds-small">
        ⚠ nomes de 2–3 letras são extremamente raros — o Discord costuma reservar os mais curtos.
        Se um nome aparecer como disponível, corra pra registrá-lo antes de outra pessoa. A
        verificação usa o mesmo endpoint que a página de cadastro do Discord.
      </div>
    </div>
  );
}
