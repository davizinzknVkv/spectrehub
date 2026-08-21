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
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/30 p-6 sm:p-8 font-sans">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div className="flex items-center gap-12 sm:gap-16">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Plano Ativo</div>
            <div className="text-xl font-display uppercase tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {limits.label}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Restantes Hoje</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-display text-foreground">{remaining === Infinity ? "∞" : remaining}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end">
          <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">
            {cooldownText ? "Sistema em Resfriamento" : "Status do Terminal"}
          </div>
          <div className={cn(
            "text-2xl font-display uppercase tracking-tight",
            cooldownText ? "text-primary" : "text-emerald-400"
          )}>
            {cooldownText || "Operação Liberada"}
          </div>
        </div>
      </div>

      {cooldownLeft > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
           <div 
             className="h-full bg-primary shadow-[0_0_12px_rgba(255,0,85,0.4)] transition-[width] duration-1000"
             style={{ width: `${Math.min(100, (cooldownLeft / limits.cooldownMs) * 100)}%` }} 
           />
        </div>
      )}
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
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
      "group relative flex min-h-[180px] flex-col justify-between transition-all duration-500 !p-6 border-border bg-card/30 hover:border-primary/20 h-full rounded-xl overflow-hidden",
      active && "border-primary/40 bg-primary/[0.02]"
    )}>
      {quest.imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10 transition-opacity duration-700 group-hover:opacity-20">
          <img
            src={quest.imageUrl}
            alt=""
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      {active && (
        <div className="absolute right-4 top-4 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="font-mono text-[9px] text-foreground-muted/50 font-bold uppercase tracking-widest">
            ID_{quest.questId.slice(0, 8)}
          </div>
          {isOrb && <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/20" />}
        </div>
        <h3 className="mt-4 line-clamp-2 text-sm font-display uppercase tracking-tight text-foreground group-hover:text-primary transition-colors min-h-[2.4em] flex items-center leading-tight">
          {quest.questName}
        </h3>
        <p className="mt-2 line-clamp-1 font-sans text-[11px] text-foreground-muted font-semibold uppercase tracking-wider">{quest.rewardText}</p>
      </div>

      <div className="relative z-10 mt-6">
        {active ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-primary">
              <span>Processando Protocolo</span>
              <span>{Math.round(p)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden bg-white/5 rounded-full">
              <div className="h-full bg-primary shadow-[0_0_8px_rgba(255,0,85,0.4)] transition-all duration-500 rounded-full" style={{ width: `${p}%` }} />
            </div>
          </div>
        ) : (
          <Button
            variant={disabled ? "secondary" : "primary"}
            size="sm"
            className="w-full !py-2.5 !text-[11px] font-bold uppercase tracking-wider rounded-lg"
            onClick={onExec}
            disabled={disabled}
          >
            {gateHint || (
              <>
                <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                Iniciar Missão
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
      title="Autorização de Segurança"
      onClose={onCancel}
      className="max-w-lg mx-auto rounded-2xl"
      actions={
        <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-3 font-sans">
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto uppercase font-bold text-[11px] tracking-wider order-2 sm:order-1 rounded-lg" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="w-full sm:w-auto min-w-[200px] uppercase font-bold text-[11px] tracking-widest order-1 sm:order-2 rounded-lg shadow-lg shadow-primary/20" 
            onClick={onSolved}
          >
            Confirmar e Iniciar
          </Button>
        </div>
      }
    >
      <div className="space-y-6 font-sans">
        <div className="relative overflow-hidden border border-primary/20 bg-primary/5 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-xs leading-relaxed text-foreground-muted">
              <span className="block mb-2 font-bold text-foreground uppercase tracking-wider">Protocolo de Execução</span>
              {label || (
                <>
                  Você está prestes a iniciar a missão <span className="text-foreground font-bold italic">"{quest?.questName}"</span>.
                </>
              )}
              <br /><br />
              Para garantir a integridade da conta, o Spectre Hub aplica padrões de comportamento humano. Evite utilizar o Discord em outros dispositivos durante a execução.
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden border border-border bg-background p-8 text-center rounded-xl group">
          {quest?.imageUrl && (
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img src={quest.imageUrl} alt="" className="h-full w-full object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          )}
          <div className="relative z-10">
            <div className="text-[10px] mb-3 font-bold uppercase tracking-widest text-foreground-muted/50">Status de Prontidão</div>
            <div className="font-display text-2xl uppercase tracking-tight text-foreground">SISTEMA_PRONTO</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────────────── */
export function MissionEmptyState({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl font-sans bg-card/10">
      <div className="mb-6 w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center">
        <Target className="h-8 w-8 text-primary opacity-50" />
      </div>
      <h3 className="text-xl font-display uppercase tracking-tight text-foreground">Missões Indisponíveis</h3>
      <p className="mt-2 max-w-xs text-xs text-foreground-muted font-medium leading-relaxed">Não localizamos missões ativas no momento. Realize uma nova sondagem nos servidores.</p>
      <Button variant="primary" size="sm" className="mt-8 !px-8 rounded-lg font-bold uppercase tracking-widest text-[11px]" onClick={onScan}>
        Sondar Terminal
      </Button>
    </div>
  );
}
