import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Crosshair, Loader2, Play, Square, ExternalLink, Trash2, Search } from "lucide-react";
import { checkDiscordUsername } from "@/lib/nicks.functions";
import { PageHeader } from "@/components/PageHeader";
import { useQuestStore } from "@/lib/quest-store";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/nicksgun")({
  head: () => ({ meta: [{ title: "Nicks-Gun — Spectre Hub" }] }),
  component: NicksGunPage,
});

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
  const creds = useQuestStore((s) => s.creds);
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
  const estimate = useMemo(() => generateCandidates(length, charset, startsWith).length, [length, charset, startsWith]);

  const start = useCallback(async () => {
    const candidates = generateCandidates(length, charset, startsWith);
    if (candidates.length === 0) {
      toast.error("Nenhum candidato válido");
      return;
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
        const now = Date.now();
        if (cooldownUntil > now) await new Promise((r) => setTimeout(r, cooldownUntil - now));
        setCurrent(u);
        try {
          const res = await checkDiscordUsername({ data: { username: u } });
          if (res.ok) {
            if (res.available) setResults((prev) => [{ username: res.username, available: true }, ...prev]);
          } else if ("rateLimited" in res && res.rateLimited) {
            cooldownUntil = Date.now() + res.retryAfterMs;
            queue.unshift(u);
            continue;
          }
        } catch { /* ignore */ }
        setChecked((c) => c + 1);
      }
    };

    const workers = Array.from({ length: Math.max(1, Math.min(8, concurrency)) }, () => worker());
    await Promise.all(workers);
    setRunning(false);
    setCurrent("");
    if (!stopRef.current) toast.success("Sniper Finalizado", { description: "Varredura de candidatos concluída." });
  }, [length, charset, startsWith, concurrency]);

  const stop = useCallback(() => { stopRef.current = true; toast.info("Sniper Abortado", { description: "O protocolo foi interrompido pelo usuário." }); }, []);
  const copy = (text: string) => { navigator.clipboard.writeText(text).then(() => toast.success("Username Copiado", { description: `@${text} pronto para uso.` })); };

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Sniper Bloqueado</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">O sniper de identidades raras requer uma conexão ativa com o terminal do Spectre Hub.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="identity --sniper"
        icon={Crosshair}
        title="Protocolo"
        highlight="Nicks-Gun"
        description="Capture usernames globais raros de 2 ou 3 letras com monitoramento de latência zero."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
           <div className="ds-card p-8 border-white/5 bg-white/[0.02]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                 <div>
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/30 italic block mb-3">Tamanho</label>
                    <div className="grid grid-cols-2 gap-px bg-white/5 p-1 border border-white/5">
                       {[2, 3].map(n => (
                          <button 
                            key={n} 
                            onClick={() => setLength(n as 2|3)}
                            disabled={running}
                            className={`py-2 font-display text-[10px] uppercase italic tracking-widest transition-all ${length === n ? 'bg-primary text-white' : 'text-white/30 hover:text-white'}`}
                          >
                             {n} Letras
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/30 italic block mb-3">Velocidade</label>
                    <select 
                       value={concurrency} 
                       onChange={(e) => setConcurrency(Number(e.target.value))}
                       disabled={running}
                       className="w-full bg-white/[0.02] border border-white/5 py-2.5 px-4 font-display text-[10px] text-white italic uppercase tracking-widest outline-none focus:border-primary/20"
                    >
                       <option value={1} className="bg-obsidian">1x - Silencioso</option>
                       <option value={4} className="bg-obsidian">4x - Padrão</option>
                       <option value={8} className="bg-obsidian">8x - Agressivo</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div>
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/30 italic block mb-3">Caracteres</label>
                    <select 
                       value={charset} 
                       onChange={(e) => setCharset(e.target.value as Charset)}
                       disabled={running}
                       className="w-full bg-white/[0.02] border border-white/5 py-2.5 px-4 font-display text-[10px] text-white italic uppercase tracking-widest outline-none focus:border-primary/20"
                    >
                       <option value="letters" className="bg-obsidian">Apenas letras (A-Z)</option>
                       <option value="alnum" className="bg-obsidian">Letras + Números</option>
                       <option value="full" className="bg-obsidian">Full (A-Z, 0-9, _, .)</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/30 italic block mb-3">Prefixo Fixo</label>
                    <input 
                       value={startsWith}
                       onChange={(e) => setStartsWith(e.target.value.toLowerCase())}
                       disabled={running}
                       placeholder="OPCIONAL..."
                       className="w-full bg-white/[0.02] border border-white/5 py-2.5 px-4 font-display text-[10px] text-white italic uppercase tracking-widest outline-none focus:border-primary/20"
                    />
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="font-display text-[9px] uppercase tracking-widest text-white/20 italic">
                    ~{estimate.toLocaleString()} candidatos mapeados
                 </div>
                 {!running ? (
                    <button onClick={start} className="ds-btn ds-btn-primary !px-10">Deploy Sniper</button>
                 ) : (
                    <button onClick={stop} className="ds-btn ds-btn-secondary !text-rose-500 border-rose-500/20 !px-10">Abortar</button>
                 )}
              </div>
           </div>

           {(running || total > 0) && (
              <div className="ds-card p-8 border-primary/20 bg-primary/5 space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="font-display text-[9px] uppercase tracking-widest text-primary italic font-bold">Monitoramento de Varredura</div>
                        <div className="font-mono text-[9px] text-white/40 uppercase">{running ? `Testando: ${current}` : 'Finalizado'}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-display text-lg text-white italic">{Math.round((checked/total)*100)}%</div>
                        <div className="font-mono text-[8px] text-white/40 uppercase tracking-widest">{checked} / {total}</div>
                    </div>
                 </div>
                 <div className="h-1 bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${(checked/total)*100}%` }} 
                    />
                 </div>
              </div>
           )}

           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(r => (
                 <div key={r.username} className="ds-card p-4 border-emerald-500/20 bg-emerald-500/5 flex justify-between items-center group">
                    <div>
                        <div className="font-display text-sm text-white uppercase italic tracking-tighter">@{r.username}</div>
                        <div className="font-display text-[8px] text-emerald-500 uppercase tracking-widest italic">Disponível</div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => copy(r.username)} className="p-2 text-white/20 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                       <a href="https://discord.com/register" target="_blank" className="p-2 text-white/20 hover:text-emerald-500 transition-colors"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <aside className="space-y-6">
           <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
              <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Insights</div>
              <div className="space-y-4">
                 <div className="flex justify-between border-b border-white/[0.02] pb-2">
                    <span className="font-display text-[9px] text-white/20 italic uppercase tracking-widest">Encontrados</span>
                    <span className="font-mono text-xs text-white">{availableCount}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/[0.02] pb-2">
                    <span className="font-display text-[9px] text-white/20 italic uppercase tracking-widest">Latência API</span>
                    <span className="font-mono text-xs text-emerald-500">0.05ms</span>
                 </div>
              </div>
           </div>

           <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
              <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic text-rose-500 font-bold">Protocolo de Risco</div>
              <p className="text-[10px] text-white/40 leading-relaxed font-sans italic">Nicks de 2 e 3 letras são monitorados globalmente. Se encontrar um, realize o registro imediato antes que o nome seja reivindicado por bots externos.</p>
           </div>
        </aside>
      </div>
    </div>
  );
}
