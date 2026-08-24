import { Target, Loader2, Play, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Quest } from "@/lib/quest-store";
import { Button, Badge, Modal, Card } from "@/components/ui/ds";
import { cn } from "@/lib/utils";

/* ── PlanBanner ─────────────────────────────────────────────────────────── */
export function PlanBanner({
  plan,
  limits,
  usedToday,
  remaining,
  cooldownText,
  cooldownLeft,
}: {
  plan: string;
  limits: any;
  usedToday: number;
  remaining: number | string;
  cooldownText: string | null;
  cooldownLeft: number;
}) {
  return (
    <div className="bg-[#030303] border border-white/5 p-10 font-mono relative">
      <div className="absolute top-0 left-0 w-1 h-1 bg-white/20" />
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <div className="flex items-center gap-16">
          <div className="space-y-3">
            <div className="text-[8px] uppercase tracking-[0.4em] text-white/10">ACTIVE_LICENSE</div>
            <div className="text-2xl font-display uppercase tracking-tighter text-white flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary opacity-50" />
              {limits.label}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-[8px] uppercase tracking-[0.4em] text-white/10">DAILY_ALLOWANCE</div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display text-white tracking-tighter">{remaining === Infinity ? "UNCAPPED" : remaining}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end space-y-3">
          <div className="text-[8px] uppercase tracking-[0.4em] text-white/10">
            {cooldownText ? "COOLING_PROTOCOL" : "TERMINAL_STATUS"}
          </div>
          <div className={cn(
            "text-2xl font-display uppercase tracking-tighter",
            cooldownText ? "text-primary" : "text-emerald-400"
          )}>
            {cooldownText || "READY_TO_DEPLOY"}
          </div>
        </div>
      </div>

      {cooldownLeft > 0 && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/5 w-full">
           <div 
             className="h-full bg-primary shadow-[0_0_10px_#4DA09E] transition-[width] duration-1000"
             style={{ width: `${Math.min(100, (cooldownLeft / limits.cooldownMs) * 100)}%` }} 
           />
        </div>
      )}
    </div>
  );
}

/* ── MissionCard ────────────────────────────────────────────────────────── */
export function MissionCard({
  quest,
  active,
  progress,
  disabled,
  gateHint,
  onExec,
}: {
  quest: Quest;
  active: boolean;
  progress: { current: number; total: number } | null;
  disabled: boolean;
  gateHint?: string;
  onExec: () => void;
}) {
  const isOrb = quest.rewardText.includes("Orbs");
  const isCompleted = !!quest.completedAt;
  const isClaimed = !!quest.claimedAt;
  const p = progress ? Math.min(100, (progress.current / progress.total) * 100) : (isCompleted ? 100 : 0);

  return (
    <div className={cn(
      "group relative flex min-h-[220px] flex-col justify-between transition-all duration-500 p-8 border border-white/5 bg-[#030303] hover:border-primary/20",
      active && "border-primary/40",
      isCompleted && !active && "border-emerald-500/20"
    )}>
      {quest.imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20 transition-opacity duration-700 group-hover:opacity-40">
          <img
            src={quest.imageUrl}
            alt=""
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
        </div>
      )}

      {active && (
        <div className="absolute right-6 top-6 z-10">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="font-mono text-[8px] text-white/10 uppercase tracking-[0.4em]">
            NODE_{quest.questId.slice(0, 8)}
          </div>
          <div className="flex gap-3">
            {isClaimed && <Badge className="!bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20 !text-[7px] uppercase tracking-widest rounded-none px-2">CLAIMED</Badge>}
            {isCompleted && !isClaimed && <Badge className="!bg-primary/10 !text-primary !border-primary/20 !text-[7px] uppercase tracking-widest rounded-none px-2">VERIFIED</Badge>}
            {isOrb && <Sparkles className="h-3.5 w-3.5 text-amber-500/40" />}
          </div>
        </div>
        <h3 className="text-sm font-display uppercase tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
          {quest.questName}
        </h3>
        <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">{quest.rewardText}</p>
      </div>

      <div className="relative z-10 mt-10">
        {active ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.3em] text-primary">
              <span>PROTOCOL_RUNNING</span>
              <span>{Math.round(p)}%</span>
            </div>
            <div className="h-0.5 overflow-hidden bg-white/5">
              <div className="h-full bg-primary shadow-[0_0_8px_#4DA09E] transition-all duration-500" style={{ width: `${p}%` }} />
            </div>
          </div>
        ) : isCompleted ? (
          <div className="space-y-3">
             <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.3em] text-emerald-400">
               <span>NODE_VERIFIED</span>
               <span>100%</span>
             </div>
             <div className="h-0.5 overflow-hidden bg-white/5">
               <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] w-full" />
             </div>
          </div>
        ) : (
          <button
            onClick={onExec}
            disabled={disabled}
            className={cn(
                "w-full h-12 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.3em] transition-all border",
                disabled 
                  ? "bg-white/5 border-white/5 text-white/10 cursor-not-allowed" 
                  : "bg-transparent border-white/10 text-white hover:border-primary/40 hover:text-primary"
            )}
          >
            {gateHint || (
              <>
                <Play className="mr-3 h-3 w-3 fill-current opacity-50" />
                EXECUTE_NODE
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}


/* ── CaptchaModal ───────────────────────────────────────────────────────── */
export function CaptchaModal({
  quest,
  label,
  onSolved,
  onCancel,
}: {
  quest?: Quest;
  label?: string;
  onSolved: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title="Autorização de Segurança"
      onClose={onCancel}
      className="max-w-lg mx-auto bg-[#030303] border border-white/5"
      actions={
        <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 font-mono">
          <button 
            className="w-full sm:w-auto h-12 px-8 uppercase text-[10px] tracking-widest text-white/40 hover:text-white transition-colors order-2 sm:order-1" 
            onClick={onCancel}
          >
            ABORT
          </button>
          <button 
            className="w-full sm:w-auto h-12 px-10 bg-primary text-white uppercase text-[10px] tracking-widest order-1 sm:order-2 shadow-[0_0_15px_#4DA09E]" 
            onClick={onSolved}
          >
            CONFIRM_PROTOCOL
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="relative border border-primary/20 bg-primary/5 p-8">
          <div className="flex items-start gap-6">
            <AlertTriangle className="h-5 w-5 shrink-0 text-primary opacity-50" />
            <div className="font-mono text-[9px] leading-relaxed text-white/40 uppercase tracking-[0.1em]">
              <span className="block mb-4 text-primary font-display text-[11px] tracking-widest">EXECUTION_PROTOCOL_0x42</span>
              {label || (
                <>
                  Você está prestes a iniciar a missão <span className="text-white">"{quest?.questName}"</span>.
                </>
              )}
              <br /><br />
              Para garantir a integridade da conta, o SPECTRE aplica padrões de comportamento humano. Evite utilizar o Discord em outros dispositivos durante a execução.
            </div>
          </div>
        </div>
        
        <div className="relative border border-white/5 bg-black/40 p-10 text-center group">
          <div className="relative z-10">
            <div className="font-mono text-[8px] mb-4 uppercase tracking-[0.5em] text-white/10">READY_STATE_STATUS</div>
            <div className="font-display text-3xl uppercase tracking-tighter text-white">SYSTEM_READY</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────────────── */
export function MissionEmptyState({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#030303] font-mono p-12">
      <div className="mb-10 w-20 h-20 bg-white/[0.02] border border-white/5 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 w-1 h-1 bg-white/10" />
        <Target className="h-8 w-8 text-white/10" />
      </div>
      <h3 className="text-xl font-display uppercase tracking-tighter text-white">NODES_NOT_FOUND</h3>
      <p className="mt-4 max-w-xs text-[9px] text-white/20 uppercase tracking-[0.2em] leading-relaxed">Não localizamos missões ativas no momento. Realize uma nova sondagem nos servidores.</p>
      <button 
        className="mt-12 h-12 px-12 border border-white/10 text-white font-mono uppercase tracking-[0.3em] text-[10px] hover:border-primary/40 hover:text-primary transition-all" 
        onClick={onScan}
      >
        INITIALIZE_POLLING
      </button>
    </div>
  );
}
