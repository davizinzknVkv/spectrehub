import { Target, Loader2, Play, Sparkles, AlertTriangle } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-none border border-white/5 bg-[#050505] p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-12">
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#444]">PLANO ATIVO</div>
            <div className="text-sm font-black uppercase tracking-tight text-white">{limits.label}</div>
          </div>
          
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#444]">RESTANTES HOJE</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">{remaining === Infinity ? "∞" : remaining}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#444]">
            {cooldownText ? "COOLDOWN ATIVO" : "PRONTO"}
          </div>
          <div className={cn(
            "text-xl font-black tracking-tighter",
            cooldownText ? "text-[#ff0055]" : "text-white"
          )}>
            {cooldownText || "SISTEMA LIVRE"}
          </div>
        </div>
      </div>

      {cooldownLeft > 0 && (
        <div className="absolute bottom-0 left-0 h-[1px] bg-[#ff0055] transition-[width] duration-1000"

             style={{ width: `${Math.min(100, (cooldownLeft / limits.cooldownMs) * 100)}%` }} />
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
  const p = progress ? Math.min(100, (progress.current / progress.total) * 100) : 0;

  return (
    <Card className={cn(
      "group relative flex min-h-[140px] flex-col justify-between transition-all duration-300 !p-4 border-white/5 bg-[#050505] hover:bg-[#080808]",
      active ? "border-[#ff0055]/40" : "hover:border-white/10"
    )}>
      {quest.imageUrl && (
        <div className="absolute inset-0 z-0 opacity-20 transition-opacity group-hover:opacity-30">
          <img
            src={quest.imageUrl}
            alt=""
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
        </div>
      )}

      {active && (
        <div className="absolute right-3 top-3 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-[#ff0055]" />
        </div>
      )}

      <div>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="ds-label text-[9px] text-slate-500 uppercase tracking-widest">#{quest.questId.slice(-8)}</div>
          {isOrb && <Sparkles className="h-3 w-3 text-amber-400" />}
        </div>
        <h3 className="relative z-10 mt-2 line-clamp-2 text-sm font-bold text-white tracking-tight group-hover:text-[#ff0055] transition-colors">{quest.questName}</h3>
        <p className="relative z-10 mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500">{quest.rewardText}</p>
      </div>

      <div className="relative z-10 mt-4">
        {active ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase text-[#ff0055]">
              <span>executando...</span>
              <span>{Math.round(p)}%</span>
            </div>
            <div className="h-1 overflow-hidden bg-white/5">
              <div className="h-full bg-[#ff0055] transition-all duration-500" style={{ width: `${p}%` }} />
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={onExec}
            disabled={disabled}
          >
            {gateHint || (
              <>
                <Play className="mr-1.5 h-3 w-3" />
                Iniciar
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
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
      title="ADVISOR"
      onClose={onCancel}
      className="border-white/10 !rounded-none"
      actions={
        <div className="flex w-full items-center justify-center gap-3">
          <Button 
            variant="ghost" 
            className="uppercase font-black text-xs tracking-widest" 
            onClick={onCancel}
          >
            CANCELAR
          </Button>
          <Button 
            variant="primary" 
            className="ds-btn-lg min-w-[200px] uppercase font-black text-xs tracking-widest" 
            onClick={onSolved}
          >
            CONFIRMAR E INICIAR
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="relative overflow-hidden border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-xs leading-relaxed text-amber-200/80">
              <span className="block mb-2 font-bold text-amber-500 uppercase tracking-widest">Aviso de Segurança</span>
              {label || (
                <>
                  Você está prestes a iniciar a missão <span className="text-white font-bold">"{quest?.questName}"</span>.
                </>
              )}
              <br /><br />
              Para evitar detecção, o Spectre Hub simula o comportamento humano. Certifique-se de que sua conta não está sendo usada em outro dispositivo no momento.
            </div>
          </div>
        </div>
        
        <div className="border border-white/5 bg-[#080808] p-6 text-center">
          <div className="font-mono text-[9px] mb-3 uppercase tracking-[0.3em] text-[#444]">CONFIRMAÇÃO SPECTRE-HUB</div>
          <div className="font-mono text-2xl font-black tracking-tighter text-white">READY_TO_DEPLOY</div>
        </div>
      </div>
    </Modal>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────────────── */
export function MissionEmptyState({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/5">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-none border border-white/10 bg-white/[0.02]">
        <Target className="h-6 w-6 text-slate-500" />
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">Nenhuma missão encontrada</h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500 leading-relaxed">Clique no botão abaixo para sondar os servidores do Discord em busca de novas missões disponíveis.</p>
      <Button variant="secondary" size="sm" className="mt-6" onClick={onScan}>
        Sondar missões agora
      </Button>
    </div>
  );
}
