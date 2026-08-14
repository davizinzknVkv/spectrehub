import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfoDetailed } from "@/lib/quest-runner";
import { PageHeader } from "@/components/PageHeader";
import { KeyRound, Mail, ShieldCheck, Copy, Star, BookOpen, Eye, EyeOff, HelpCircle, AlertTriangle, Lock, type LucideIcon } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui/ds";
import step1 from "@/assets/tutorial-step-1.png.asset.json";
import step2 from "@/assets/tutorial-step-2.png.asset.json";
import step3 from "@/assets/tutorial-step-3.png.asset.json";
import step4 from "@/assets/tutorial-step-4.png.asset.json";
import step5 from "@/assets/tutorial-step-5.png.asset.json";

const TOKEN_BOOKMARKLET =
  `javascript:(function(){try{var i=document.createElement('iframe');document.body.appendChild(i);var t=i.contentWindow.localStorage.token;i.remove();if(!t){alert('Token não encontrado. Faça login no Discord no mesmo navegador.');return;}var v=t.replace(/^"|"$/g,'');window.prompt('Seu token do Discord (Ctrl+C para copiar):',v);}catch(e){alert('Erro: '+e.message);}})();`;

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Login — Spectre Hub" }] }),
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
      const user = await fetchUserInfoDetailed();
      if (!user.ok) throw new Error("Token inválido ou expirado");
      toast.success(`Conectado como ${user.data.username}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao validar");
    } finally {
      setSaving(false);
    }
  };

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="auth --gateway"
        icon={KeyRound}
        title="Portal de"
        highlight="Acesso"
        description="Vincule sua conta para ativar os recursos premium. Seus dados são processados localmente e nunca são compartilhados."
      />

      <div className="mx-auto w-full max-w-xl space-y-6">
        {creds && (
          <div className="ds-card p-4 border-spectre-pink/20 bg-spectre-pink/5 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-spectre-pink shadow-[0_0_8px_#ff0055]" />
                <span className="font-display text-[10px] uppercase tracking-widest italic text-white">Sessão Ativa Terminal</span>
             </div>
             <button onClick={() => setConfirmDisconnect(true)} className="text-[9px] uppercase tracking-widest text-spectre-pink hover:text-white transition-colors italic font-bold">Encerrar</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 p-1">
           <button 
             onClick={() => setTab("email")}
             className={`py-3 font-display text-[10px] uppercase tracking-widest italic transition-all ${tab === 'email' ? 'bg-spectre-pink text-white' : 'text-white/40 hover:text-white'}`}
           >Email</button>
           <button 
             onClick={() => setTab("token")}
             className={`py-3 font-display text-[10px] uppercase tracking-widest italic transition-all ${tab === 'token' ? 'bg-spectre-pink text-white' : 'text-white/40 hover:text-white'}`}
           >Token</button>
        </div>

        <div className="ds-card p-8 border-white/5 bg-white/[0.02]">
           {tab === 'email' ? (
              <p className="text-white/40 text-center py-10 font-sans italic text-sm">Login por email indisponível neste terminal. Utilize o método de Token para acesso imediato.</p>
           ) : (
             <form onSubmit={save} className="space-y-6">
                <div>
                   <label className="block font-display text-[9px] uppercase tracking-widest text-white/40 mb-2 italic">Chave de Autorização</label>
                   <Input 
                      type={show ? "text" : "password"}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="MTIzNDU2..."
                      className="bg-black/50 border-white/5 rounded-none font-mono text-xs"
                   />
                </div>
                <div className="flex gap-4">
                   <button type="submit" className="ds-btn ds-btn-primary flex-1" disabled={saving || !token}>
                      {saving ? "Processando..." : "Validar Acesso"}
                   </button>
                   <button type="button" onClick={() => setShow(!show)} className="ds-btn ds-btn-secondary px-6">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                </div>
             </form>
           )}
        </div>

        <div className="border border-spectre-pink/20 bg-spectre-pink/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-spectre-pink">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-display text-[9px] uppercase tracking-widest italic font-bold">Aviso de Segurança</span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed font-sans">O Spectre Hub não armazena suas credenciais em servidores externos. Toda a autenticação é mantida localmente em seu navegador. O uso de automação pode violar os termos do Discord.</p>
        </div>
      </div>

      {confirmDisconnect && (
        <Modal
          title="Encerrar Sessão"
          onClose={() => setConfirmDisconnect(false)}
          actions={
            <div className="flex gap-4 w-full">
              <button className="ds-btn ds-btn-secondary flex-1" onClick={() => setConfirmDisconnect(false)}>Cancelar</button>
              <button className="ds-btn ds-btn-primary flex-1" onClick={() => {
                setCreds(null);
                setToken("");
                setConfirmDisconnect(false);
                toast.success("Terminal limpo.");
              }}>Encerrar</button>
            </div>
          }
        >
          <p className="text-white/60 text-sm font-sans">Tem certeza que deseja remover o acesso deste terminal? Você precisará validar o token novamente para entrar.</p>
        </Modal>
      )}
    </div>
  );
}
