import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Crosshair, Loader2, Play, Square, ExternalLink, Trash2, Search } from "lucide-react";
import { checkDiscordUsername } from "@/lib/nicks.functions";
import { PageHeader } from "@/components/PageHeader";
import { useQuestStore } from "@/lib/quest-store";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/nicksgun")({
  head: () => ({ meta: [{ title: "Nicks-Gun — SPECTRE" }] }),
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
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">O sniper de identidades raras requer uma conexão ativa com o terminal do SPECTRE.</p>
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
        <div className="space-y-8">
           <div className="bg-[#0d0f14] border border-white/5 p-10 space-y-10 relative">
              <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">TAMANHO DO USERNAME</label>
                    <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                       {[2, 3].map(n => (
                          <button 
                            key={n} 
                            onClick={() => setLength(n as 2|3)}
                            disabled={running}
                            className={`py-4 font-display text-[10px] uppercase tracking-[0.3em] transition-all ${length === n ? 'bg-primary text-white' : 'text-white/20 hover:text-white/60'}`}
                          >
                             {n} LETRAS
                          </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">LATÊNCIA DE BUSCA</label>
                    <select 
                       value={concurrency} 
                       onChange={(e) => setConcurrency(Number(e.target.value))}
                       disabled={running}
                       className="w-full bg-white/[0.02] border border-white/5 py-4 px-6 font-display text-[10px] text-white uppercase tracking-[0.2em] outline-none focus:border-primary/30 appearance-none"
                    >
                       <option value={1} className="bg-obsidian">1X // MODO FURTIVO</option>
                       <option value={4} className="bg-obsidian">4X // EXECUÇÃO EQUILIBRADA</option>
                       <option value={8} className="bg-obsidian">8X // MODO AGRESSIVO</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">TIPO DE CARACTERES</label>
                    <select 
                       value={charset} 
                       onChange={(e) => setCharset(e.target.value as Charset)}
                       disabled={running}
                       className="w-full bg-white/[0.02] border border-white/5 py-4 px-6 font-display text-[10px] text-white uppercase tracking-[0.2em] outline-none focus:border-primary/30 appearance-none"
                    >
                       <option value="letters" className="bg-obsidian">APENAS LETRAS (A-Z)</option>
                       <option value="alnum" className="bg-obsidian">ALFANUMÉRICO (A-Z, 0-9)</option>
                       <option value="full" className="bg-obsidian">CONJUNTO ESTENDIDO (A-Z, 0-9, _, .)</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 block">PREFIXO DO NICK</label>
                    <input 
                       value={startsWith}
                       onChange={(e) => setStartsWith(e.target.value.toLowerCase())}
                       disabled={running}
                       placeholder="NULL..."
                       className="w-full bg-white/[0.02] border border-white/5 py-4 px-6 font-display text-[10px] text-white uppercase tracking-[0.2em] outline-none focus:border-primary/30 placeholder:text-white/5"
                    />
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                 <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/10">
                    CANDIDATOS MAPEADOS: {estimate.toLocaleString()}
                 </div>
                 {!running ? (
                    <button onClick={start} className="ds-btn ds-btn-primary !px-12 !h-14">INICIAR SNIPER</button>
                 ) : (
                    <button onClick={stop} className="ds-btn ds-btn-secondary !text-rose-500 border-rose-500/20 !px-12 !h-14">ABORTAR SEQUÊNCIA</button>
                 )}
              </div>
           </div>

           {(running || total > 0) && (
               <div className="bg-[#0d0f14] border border-primary/20 p-10 space-y-8">
                  <div className="flex justify-between items-end">
                     <div className="space-y-3">
                        <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-primary">MONITORAMENTO ATIVO</div>
                        <div className="font-display text-base text-white uppercase tracking-tighter">{running ? `TESTANDO NICK: ${current}` : 'SEQUÊNCIA PARADA'}</div>
                     </div>
                     <div className="text-right">
                        <div className="font-display text-3xl text-white tracking-tighter leading-none">{Math.round((checked/total)*100)}%</div>
                        <div className="font-mono text-[7px] text-white/20 uppercase tracking-[0.4em] mt-2">{checked} / {total} NODOS TOTAIS</div>
                     </div>
                  </div>
                  <div className="h-0.5 bg-white/5 relative overflow-hidden">
                     <div 
                       className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_#005194]" 
                       style={{ width: `${(checked/total)*100}%` }} 
                     />
                  </div>
               </div>
           )}

           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(r => (
                  <div key={r.username} className="bg-[#0d0f14] border border-emerald-500/20 p-6 flex justify-between items-center group hover:border-emerald-500/50 transition-all duration-500">
                     <div>
                        <div className="font-display text-base text-white uppercase tracking-tighter">@{r.username}</div>
                        <div className="font-mono text-[7px] text-emerald-500 uppercase tracking-[0.4em] mt-2">NODO DISPONÍVEL IDENTIFICADO</div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => copy(r.username)} className="text-white/10 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                        <a href="https://discord.com/register" target="_blank" className="text-white/10 hover:text-emerald-500 transition-colors"><ExternalLink className="w-4 h-4" /></a>
                     </div>
                  </div>
              ))}
           </div>
        </div>

        <aside className="space-y-6">
           <div className="bg-[#0d0f14] border border-white/5 p-8 space-y-8">
              <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">DADOS DA SESSÃO</div>
              <div className="space-y-6">
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="font-display text-[10px] text-white/20 uppercase tracking-widest">NICKS DETECTADOS</span>
                    <span className="font-mono text-xs text-white">{availableCount}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="font-display text-[10px] text-white/20 uppercase tracking-widest">LATÊNCIA DA API</span>
                    <span className="font-mono text-xs text-emerald-500">0.05MS</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#0d0f14] border border-rose-500/10 p-8 space-y-6">
              <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-rose-500/50">PROTOCOLO DE RISCO</div>
              <p className="text-[10px] text-white/20 leading-relaxed font-sans uppercase tracking-[0.1em]">
                 IDENTIDADES RARA SÃO MONITORADAS GLOBALMENTE. REIVINDIQUE O NODO IMEDIATAMENTE APÓS A DETECÇÃO PARA EVITAR INTERCEPTAÇÃO POR BOTS EXTERNOS.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
