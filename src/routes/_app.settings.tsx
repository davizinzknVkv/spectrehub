import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfoDetailed } from "@/lib/quest-runner";
import { PageHeader } from "@/components/PageHeader";
import { 
  KeyRound, 
  ShieldCheck, 
  Copy, 
  Star, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Settings, 
  Bell, 
  Fingerprint,
  X 
} from "lucide-react";
import { Button, Input, Modal } from "@/components/ui/ds";
import step1 from "@/assets/tutorial-step-1.png.asset.json";
import step2 from "@/assets/tutorial-step-2.png.asset.json";
import step3 from "@/assets/tutorial-step-3.png.asset.json";
import step4 from "@/assets/tutorial-step-4.png.asset.json";
import step5 from "@/assets/tutorial-step-5.png.asset.json";

const TOKEN_BOOKMARKLET =
  `javascript:(function(){try{var i=document.createElement('iframe');document.body.appendChild(i);var t=i.contentWindow.localStorage.token;if(!t){for(var k in i.contentWindow.localStorage){if(k.toLowerCase()==='token'){t=i.contentWindow.localStorage[k];break;}}}i.remove();if(!t){alert('Token não encontrado no LocalStorage do Discord. Certifique-se de estar na aba do Discord e logado.');return;}var v=t.replace(/^"|"$/g,'');window.prompt('Seu token do Discord (Ctrl+C para copiar):',v);}catch(e){alert('Erro ao extrair token: '+e.message);}})();`;

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Configurações — SPECTRE" }] }),
  component: SettingsPage,
});

type Tab = "email" | "token";

function SettingsPage() {
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);

  const [tab, setTab] = useState<Tab>("token");
  const [category, setCategory] = useState("geral");
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
      toast.success("Acesso Validado", { description: `Conectado como ${user.data.username}` });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao validar");
    } finally {
      setSaving(false);
    }
  };

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  return (
    <div className="page-stack max-w-5xl mx-auto font-sans">
      <PageHeader
        eyebrow="Configurações"
        icon={Settings}
        title="Portal de"
        highlight="Gerenciamento"
        description="Controle sua conta, segurança e preferências de interface em um só lugar."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {/* Sidebar de Categorias */}
        <div className="space-y-4">
           {[
             { id: "geral", label: "GENERAL_SYS", icon: Settings },
             { id: "conta", label: "ACCOUNT_LINK", icon: User },
             { id: "seguranca", label: "SECURITY_AUTH", icon: Lock },
             { id: "interface", label: "INTERFACE_UI", icon: Eye },
             { id: "notificacoes", label: "NOTIF_STREAM", icon: Bell },
           ].map(cat => (
             <button 
              key={cat.id} 
              onClick={() => setCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 border-l-2 text-left",
                category === cat.id 
                  ? "bg-primary/5 text-white border-primary" 
                  : "text-white/20 hover:text-white/60 hover:bg-white/[0.02] border-transparent"
              )}
             >
               <cat.icon className={cn("w-4 h-4", category === cat.id ? "text-primary" : "text-white/10")} />
               <span className="font-display text-[11px] uppercase tracking-wider">{cat.label}</span>
             </button>
           ))}
        </div>

        {/* Conteúdo das Configurações */}
        <div className="md:col-span-2 space-y-8">
          {category === "geral" && (
            <>
              {/* Sessão de Acesso */}
              <section className="bg-[#030303] border border-white/5 p-10 space-y-10 relative">
                <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
                
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                  <KeyRound className="w-5 h-5 text-primary opacity-50" />
                  <div>
                    <h3 className="font-display text-base text-white uppercase tracking-tighter">Acesso ao Terminal</h3>
                    <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">AUTH_GATEWAY_CREDENTIALS</div>
                  </div>
                </div>

                {creds && (
                  <div className="p-6 bg-primary/5 border border-primary/20 flex justify-between items-center group">
                     <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#4DA09E]" />
                        <span className="font-display text-[10px] text-white uppercase tracking-wider">Conexão Ativa</span>
                     </div>
                     <button onClick={() => setConfirmDisconnect(true)} className="font-mono text-[9px] text-primary hover:text-white transition-colors uppercase tracking-widest">TERMINATE_SESSION</button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden">
                   <button 
                     onClick={() => setTab("email")}
                     className={cn("py-4 font-display text-[10px] uppercase tracking-widest transition-all", tab === 'email' ? 'bg-primary text-white' : 'bg-transparent text-white/20 hover:text-white/60')}
                   >EMAIL_ENTRY</button>
                   <button 
                     onClick={() => setTab("token")}
                     className={cn("py-4 font-display text-[10px] uppercase tracking-widest transition-all", tab === 'token' ? 'bg-primary text-white' : 'bg-transparent text-white/20 hover:text-white/60')}
                   >TOKEN_PIPE</button>
                </div>

            {tab === 'email' ? (
              <div className="text-center py-12 space-y-4">
                <Lock className="w-12 h-12 text-foreground-muted/20 mx-auto" />
                <p className="text-foreground-muted text-sm italic">O login via e-mail está temporariamente desabilitado para sua região. Por favor, utilize o método de Token.</p>
              </div>
            ) : (
              <form onSubmit={save} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Chave de Autorização</label>
                    <div className="relative">
                      <Input 
                         type={show ? "text" : "password"}
                         value={token}
                         onChange={(e) => setToken(e.target.value)}
                         placeholder="Insira seu token do Discord..."
                         className="pr-12"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShow(!show)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                      >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-10 mt-10 border-t border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">CACHED_TERMINALS</h4>
                      <span className="font-mono text-[8px] text-primary">01</span>
                    </div>
                    
                    <div className="group relative">
                      <div className="bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between hover:border-primary/30 transition-all duration-500 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-display text-[11px] text-white uppercase tracking-wider">euvictors2</div>
                            <div className="font-mono text-[8px] text-white/10 uppercase tracking-[0.2em] mt-1">RESTORE_PROTOCOL_AVAILABLE</div>
                          </div>
                        </div>
                        <button type="button" className="p-2 text-white/5 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                           <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="w-full" disabled={saving || !token}>
                     {saving ? "Validando..." : "Sincronizar Conta"}
                  </Button>
               </form>
             )}
          </section>

          {/* Segurança & Privacidade */}
          <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-sans text-base font-bold text-foreground">Segurança & Privacidade</h3>
                <p className="text-xs text-foreground-muted">Seus dados são protegidos localmente.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
              <Fingerprint className="w-8 h-8 text-primary shrink-0" />
              <p className="text-xs text-foreground-muted leading-relaxed">
                O <span className="text-foreground font-semibold">SPECTRE</span> utiliza criptografia AES-256 no armazenamento local. Suas credenciais nunca tocam nossos servidores, garantindo privacidade total.
              </p>
            </div>
          </section>

          {/* Manual de Extração */}
          <section className="space-y-6">
            <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground-muted/50 border-b border-border pb-4">Manual de Extração</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#030303] border border-white/5 p-8 space-y-6 group hover:border-primary/20 transition-all">
                <div className="font-mono text-[9px] text-primary mb-2">AUTH_MODULE_01</div>
                <h4 className="font-display text-sm text-white uppercase tracking-wider">Bookmarklet Helper</h4>
                <p className="font-sans text-[11px] text-white/30 uppercase tracking-[0.1em] leading-relaxed">Arraste para sua barra de favoritos e clique enquanto estiver no Discord.</p>
                <a 
                  href={TOKEN_BOOKMARKLET}
                  onClick={(e) => e.preventDefault()}
                  className="ds-btn ds-btn-primary w-full !text-[10px] !h-12 cursor-grab active:cursor-grabbing flex items-center justify-center gap-3"
                >
                  <Star className="w-3.5 h-3.5" />
                  SPECTRE_HELPER_V2
                </a>
              </div>

              <div className="bg-[#030303] border border-white/5 p-8 space-y-6 group hover:border-primary/20 transition-all">
                <div className="font-mono text-[9px] text-white/10 mb-2">AUTH_MODULE_02</div>
                <h4 className="font-display text-sm text-white uppercase tracking-wider">Extração via Console</h4>
                <p className="font-sans text-[11px] text-white/30 uppercase tracking-[0.1em] leading-relaxed">Utilize o script direto no console do desenvolvedor (F12).</p>
                <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`);
                     toast.success("Código Copiado", { description: "Cole no console do Discord (F12)" });
                   }}
                   className="ds-btn ds-btn-secondary w-full !text-[10px] !h-12 flex items-center justify-center gap-3"
                 >
                   <Copy className="w-3.5 h-3.5" />
                   EXTRACT_STDOUT
                 </button>
              </div>
            </div>
          </section>

          {/* Guia Visual */}
          <section className="space-y-6">
             <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground-muted/50 border-b border-border pb-4">Guia Visual de Configuração</h3>
             <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[step1, step2, step3, step4, step5].map((s, i) => (
                  <div key={i} className="space-y-2 group">
                     <div className="aspect-[4/3] border border-border bg-card/30 overflow-hidden rounded-lg group-hover:border-primary/50 transition-all duration-500">
                        <img src={s.url} alt={`Passo ${i+1}`} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="font-sans text-[10px] font-bold text-primary">0{i+1}</span>
                        <span className="font-sans text-[9px] text-foreground-muted font-bold uppercase tracking-wider group-hover:text-foreground transition-colors">
                           {i === 0 && "Abrir Discord"}
                           {i === 1 && "F12 Console"}
                           {i === 2 && "Aba Console"}
                           {i === 3 && "Colar Script"}
                           {i === 4 && "Pegar Token"}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </section>
          </>
          )}

          {category === "conta" && (
            <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">Conta & Discord</h3>
                  <p className="text-xs text-foreground-muted">Gerencie a integração com o Discord.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                  <div>
                    <div className="text-xs font-bold text-foreground">Vincular Servidor</div>
                    <div className="text-[10px] text-foreground-muted">Sincroniza seus cargos para desbloquear limites.</div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => window.open('https://discord.gg/vbYK559Jnb', '_blank')}>Vincular</Button>
                </div>
                <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                  <div>
                    <div className="text-xs font-bold text-foreground">Auto-Join Community</div>
                    <div className="text-[10px] text-foreground-muted">Entra automaticamente em novos servidores parceiros.</div>
                  </div>
                  <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer opacity-50">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {category === "seguranca" && (
            <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">Segurança Avançada</h3>
                  <p className="text-xs text-foreground-muted">Proteção de dados e chaves de acesso.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-border space-y-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    Criptografia de Terminal
                  </div>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">
                    Seu token é criptografado via AES-GCM-256 antes de ser persistido no LocalStorage. 
                    Nenhuma chave privada é transmitida para o backend do Spectre.
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                  <div>
                    <div className="text-xs font-bold text-foreground">Limpeza Automática</div>
                    <div className="text-[10px] text-foreground-muted">Remove credenciais após 24h de inatividade.</div>
                  </div>
                  <div className="w-10 h-5 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-foreground-muted rounded-full" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {category === "interface" && (
            <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">Interface & UX</h3>
                  <p className="text-xs text-foreground-muted">Personalize sua experiência visual.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center cursor-pointer">
                  <div className="text-xs font-bold text-primary">Obsidian Pink</div>
                  <div className="text-[9px] text-primary/60 uppercase font-bold mt-1">Ativo</div>
                </div>
                <div className="p-4 bg-background border border-border rounded-lg text-center cursor-not-allowed opacity-50">
                  <div className="text-xs font-bold text-foreground-muted">Cyber Blue</div>
                  <div className="text-[9px] text-foreground-muted uppercase font-bold mt-1">Breve</div>
                </div>
              </div>
            </section>
          )}

          {category === "notificacoes" && (
            <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">Notificações</h3>
                  <p className="text-xs text-foreground-muted">Alertas de missões e sniper.</p>
                </div>
              </div>
              <div className="space-y-3">
                {['Alertas de Som', 'Push Desktop', 'Webhook Discord'].map(notif => (
                  <div key={notif} className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                    <span className="text-xs font-bold text-foreground">{notif}</span>
                    <div className="w-10 h-5 bg-border rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-foreground-muted rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {confirmDisconnect && (
        <Modal
          title="Encerrar Sessão"
          onClose={() => setConfirmDisconnect(false)}
          actions={
            <div className="flex gap-3 w-full">
              <button className="ds-btn ds-btn-secondary flex-1" onClick={() => setConfirmDisconnect(false)}>Cancelar</button>
              <button className="ds-btn ds-btn-primary flex-1" onClick={() => {
                setCreds(null);
                setToken("");
                setConfirmDisconnect(false);
                toast.success("Sessão Encerrada");
              }}>Confirmar</button>
            </div>
          }
        >
          <p className="text-foreground-muted text-sm leading-relaxed text-center sm:text-left">
            Tem certeza que deseja remover o acesso deste terminal? Você precisará validar seu token novamente na próxima visita.
          </p>
        </Modal>
      )}
    </div>
  );
}