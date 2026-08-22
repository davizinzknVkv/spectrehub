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
  Fingerprint 
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
  head: () => ({ meta: [{ title: "Configurações — Spectre Hub" }] }),
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
        <div className="space-y-2">
           {[
             { id: "geral", label: "Geral", icon: Settings },
             { id: "conta", label: "Conta & Discord", icon: User },
             { id: "seguranca", label: "Segurança", icon: Lock },
             { id: "interface", label: "Interface", icon: Eye },
             { id: "notificacoes", label: "Notificações", icon: Bell },
           ].map(cat => (
             <button 
              key={cat.id} 
              onClick={() => setCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium text-sm",
                category === cat.id ? "bg-primary/10 text-foreground" : "text-foreground-muted hover:text-foreground hover:bg-white/[0.03]"
              )}
             >
               <cat.icon className={cn("w-4 h-4", category === cat.id ? "text-primary" : "text-foreground-muted")} />
               {cat.label}
             </button>
           ))}
        </div>

        {/* Conteúdo das Configurações */}
        <div className="md:col-span-2 space-y-8">
          {category === "geral" && (
            <>
              {/* Sessão de Acesso */}
              <section className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <KeyRound className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-sans text-base font-bold text-foreground">Acesso ao Terminal</h3>
                <p className="text-xs text-foreground-muted">Gerencie sua chave de autorização do Discord.</p>
              </div>
            </div>

            {creds && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-sans text-xs font-semibold text-foreground">Conexão Ativa</span>
                 </div>
                 <button onClick={() => setConfirmDisconnect(true)} className="text-xs font-bold text-primary hover:text-foreground transition-colors">Encerrar</button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden p-[1px]">
               <button 
                 onClick={() => setTab("email")}
                 className={cn("py-2.5 font-sans text-xs font-bold transition-all", tab === 'email' ? 'bg-primary text-white' : 'bg-background-secondary text-foreground-muted hover:text-foreground')}
               >E-mail</button>
               <button 
                 onClick={() => setTab("token")}
                 className={cn("py-2.5 font-sans text-xs font-bold transition-all", tab === 'token' ? 'bg-primary text-white' : 'bg-background-secondary text-foreground-muted hover:text-foreground')}
               >Token</button>
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
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">Contas Salvas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-background-secondary/50 border border-border rounded-xl group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-foreground leading-none">euvictors2</div>
                            <div className="text-[9px] text-foreground-muted uppercase tracking-tighter mt-1">Toque para conectar</div>
                          </div>
                        </div>
                        <button type="button" className="p-2 text-foreground-muted hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
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
                O <span className="text-foreground font-semibold">Spectre Hub</span> utiliza criptografia AES-256 no armazenamento local. Suas credenciais nunca tocam nossos servidores, garantindo privacidade total.
              </p>
            </div>
          </section>

          {/* Manual de Extração */}
          <section className="space-y-6">
            <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground-muted/50 border-b border-border pb-4">Manual de Extração</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="ds-card !p-6 border-border bg-card/20 rounded-xl space-y-4 hover:border-primary/20 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">01</div>
                <h4 className="font-sans text-sm font-bold text-foreground">Bookmarklet Helper</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">Arraste para sua barra de favoritos e clique enquanto estiver no Discord.</p>
                <a 
                  href={TOKEN_BOOKMARKLET}
                  onClick={(e) => e.preventDefault()}
                  className="ds-btn ds-btn-primary w-full !text-xs rounded-lg cursor-grab active:cursor-grabbing gap-2"
                >
                  <Star className="w-3.5 h-3.5" />
                  SPECTRE HELPER
                </a>
              </div>

              <div className="ds-card !p-6 border-border bg-card/20 rounded-xl space-y-4 hover:border-primary/20 transition-all">
                <div className="w-8 h-8 rounded-lg bg-foreground-muted/10 flex items-center justify-center text-foreground-muted font-bold text-xs">02</div>
                <h4 className="font-sans text-sm font-bold text-foreground">Extração via Console</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">Utilize o script direto no console do desenvolvedor (F12).</p>
                <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`);
                     toast.success("Código Copiado", { description: "Cole no console do Discord (F12)" });
                   }}
                   className="ds-btn ds-btn-secondary w-full !text-xs rounded-lg gap-2"
                 >
                   <Copy className="w-3.5 h-3.5" />
                   COPIAR SCRIPT
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