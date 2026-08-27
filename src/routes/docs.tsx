import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  Search, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Award, 
  LifeBuoy, 
  Sparkles,
  Menu,
  X,
  Target,
  ShieldCheck,
  Music4,
  Send,
  Loader2,
  Bot,
  User
} from "lucide-react";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/home/Reveal";
import { chatWithDocs } from "@/lib/docs-ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introducao");
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Chat State
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useServerFn(chatWithDocs);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    const userText = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await sendMessage({ data: { message: userText } });
      if ('text' in response) {
        setChatMessages(prev => [...prev, { role: 'bot', text: response.text }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'bot', text: "Erro: " + (response.error || "Falha na conexão.") }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Erro ao processar mensagem." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const navItems = [
    { id: "introducao", label: "Introdução", icon: BookOpen },
    { id: "produtos", label: "Produtos", icon: Zap },
    { id: "guia", label: "Como começar", icon: Sparkles },
    { id: "faq", label: "FAQ", icon: Lightbulb },
    { id: "termos", label: "Termos de Uso", icon: Shield },
    { id: "suporte", label: "Suporte", icon: LifeBuoy },
  ];

  const products = [
    { id: "quests", name: "Auto Quests", icon: Target, desc: "Execução massiva de missões oficiais do Discord.", goal: "Automatizar o ganho de orbs e recompensas." },
    { id: "sniper", name: "Nicks-Gun Sniper", icon: Target, desc: "Sniper avançado para capturar usernames raros.", goal: "Garantir identidades exclusivas de 2/3 letras." },
    { id: "optimizer", name: "Spectre Optimizer", icon: Zap, desc: "Otimização de hardware e rede.", goal: "Reduzir latência e maximizar performance." },
    { id: "tools", name: "Discord Tools", icon: ShieldCheck, desc: "Gestão profissional de servidores e contas.", goal: "Facilitar a manutenção de infraestrutura Discord." },
    { id: "spotify", name: "Spotify Gen", icon: Music4, desc: "Gerador de links UTM para campanhas.", goal: "Rastreamento profissional de audiência." },
  ];

  const filteredNav = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans selection:bg-primary/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0f14]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Spectre" className="h-6 w-6 object-contain" />
            <span className="font-display text-sm tracking-[0.2em] uppercase">Spectre <span className="text-primary opacity-50">//</span> Docs</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-12">
            {["Produtos", "Guia", "Suporte"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="font-display text-[9px] tracking-[0.4em] uppercase text-white/30 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
            <Link 
              to="/hub" 
              className="ds-btn ds-btn-primary !px-6 !py-2 !min-h-0 !h-10"
            >
              HUB_ACCESS
            </Link>
          </nav>

          <button 
            className="md:hidden p-2 text-white/60 hover:text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-[#0d0f14] p-6 md:hidden">
          <nav className="space-y-6">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-4 w-full text-left text-lg font-display uppercase tracking-wider transition-colors",
                  activeSection === item.id ? "text-primary" : "text-white/40"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <div className="pt-6 border-t border-white/5">
              <Link to="/hub" className="ds-btn ds-btn-primary w-full text-center py-4">ACESSAR SPECTRE</Link>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[240px] shrink-0 sticky top-32 h-[calc(100vh-160px)] space-y-10 overflow-y-auto pr-4 scrollbar-thin">
          <div className="space-y-12">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10 group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="SEARCH_DB..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-white/5 py-2 pl-9 text-[9px] font-bold uppercase tracking-[0.2em] outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <div className="px-3 text-[8px] font-black text-white/10 uppercase tracking-[0.5em] mb-4">NAV_ROOT</div>
              {filteredNav.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left text-[10px] font-bold uppercase tracking-[0.2em] py-2 px-3 transition-colors",
                    activeSection === item.id 
                      ? "text-primary border-l border-primary" 
                      : "text-white/20 hover:text-white/50"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Reveal>
            <div className="space-y-16">
              {/* Intro Section */}
              {activeSection === "introducao" && (
                <section className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase flex items-center gap-4">
                       <div className="w-12 h-px bg-primary" />
                       GUIDE_INIT
                    </div>
                    <h1 className="font-display text-5xl md:text-8xl leading-[0.85] text-white uppercase tracking-tighter">
                      Spectre <br />
                      <span className="text-primary italic opacity-90">Protocol.</span>
                    </h1>
                    <div className="border-l border-white/5 pl-8 space-y-8">
                      <p className="text-white/40 text-sm leading-relaxed uppercase tracking-[0.1em] max-w-2xl">
                        O SPECTRE é o ecossistema definitivo para entusiastas de automação e performance no Discord. Nossa plataforma foi construída sob os pilares da segurança extrema, latência zero e interface industrial premium.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="px-4 py-2 border border-white/5 bg-white/[0.02] font-mono text-[9px] text-white/40 uppercase tracking-widest">
                          VER: 2.0.4_STABLE
                        </div>
                        <div className="px-4 py-2 border border-white/5 bg-white/[0.02] font-mono text-[9px] text-primary uppercase tracking-widest">
                          STATUS: SYSTEMS_ONLINE
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                    {[
                      { icon: Zap, label: "Performance", desc: "Infraestrutura otimizada para execução em milissegundos." },
                      { icon: Shield, label: "Segurança", desc: "Protocolos avançados de proteção e anti-detecção." },
                      { icon: LifeBuoy, label: "Suporte", desc: "Comunidade ativa e atendimento especializado." },
                    ].map((item, i) => (
                      <div key={i} className="p-8 bg-[#0d0f14] group hover:bg-white/[0.02] transition-colors">
                        <item.icon className="w-5 h-5 text-primary mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <h3 className="font-display text-[10px] uppercase tracking-[0.3em] mb-4">{item.label}</h3>
                        <p className="text-[9px] text-white/20 uppercase tracking-[0.1em] leading-relaxed group-hover:text-white/40 transition-colors">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Products Section */}
              {activeSection === "produtos" && (
                <section className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-6">
                    <div className="font-display text-[9px] tracking-[0.5em] text-white/20 uppercase flex items-center gap-4">
                       <div className="w-12 h-px bg-white/10" />
                       CORE_CATALOG
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tighter">Sistemas <span className="text-primary italic">&</span> Módulos</h2>
                  </div>

                  <div className="grid gap-px bg-white/5 border border-white/5">
                    {products.map((p, i) => (
                      <div key={p.id} className="group p-10 bg-[#0d0f14] hover:bg-white/[0.02] transition-all relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 relative z-10">
                          <div className="space-y-8 flex-1">
                            <div className="flex items-center gap-6">
                              <div className="font-mono text-[9px] text-primary/40">ID_0{i + 1}</div>
                              <h3 className="font-display text-2xl text-white uppercase tracking-tight">{p.name}</h3>
                              <div className="px-2 py-0.5 border border-primary/20 bg-primary/5 text-[7px] font-black text-primary uppercase tracking-[0.3em]">ACTIVE</div>
                            </div>
                            <p className="text-white/30 text-[11px] uppercase tracking-[0.1em] leading-relaxed max-w-xl">{p.desc}</p>
                            <div className="flex items-center gap-4">
                              <div className="font-mono text-[8px] text-white/10 uppercase tracking-[0.3em]">TARGET_GOAL:</div>
                              <div className="font-mono text-[8px] text-primary uppercase tracking-[0.3em] opacity-60">{p.goal}</div>
                            </div>
                          </div>
                          <Link 
                            to={p.id === 'spotify' ? '/spotify' : p.id === 'sniper' ? '/nicksgun' : '/hub'} 
                            className="ds-btn ds-btn-primary !text-[9px] !px-8 !min-h-0 !h-12 shrink-0"
                          >
                            RUN_MODULE
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Guide Section */}
              {activeSection === "guia" && (
                <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <h2 className="font-display text-4xl uppercase tracking-tighter italic">Guia de <span className="text-primary">Início</span></h2>
                    <p className="text-white/50 text-base max-w-2xl">Siga estes passos fundamentais para configurar sua conta e começar a utilizar o SPECTRE.</p>
                  </div>

                  <div className="space-y-8">
                    {[
                      { step: "01", title: "Autenticação", desc: "O primeiro passo é realizar o login através do Discord. Isso permite que o sistema identifique seu nível de acesso e carregue suas configurações personalizadas." },
                      { step: "02", title: "Configuração de Token", desc: "Para utilizar as ferramentas de automação, você precisará vincular sua conta através de um token seguro. Utilize nossos tutoriais internos no Hub para realizar este processo com segurança." },
                      { step: "03", title: "Exploração de Módulos", desc: "Navegue pelo painel lateral do Hub para encontrar as ferramentas contratadas. Cada módulo possui sua própria interface intuitiva e controles específicos." },
                      { step: "04", title: "Monitoramento", desc: "Acompanhe suas estatísticas e logs em tempo real na Dashboard central para garantir que tudo está operando conforme o esperado." },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="font-display text-4xl text-white/10 group-hover:text-primary/20 transition-colors shrink-0 pt-1 leading-none">{step.step}</div>
                        <div className="space-y-3 pb-8 border-b border-white/5 last:border-0">
                          <h3 className="font-display text-xl uppercase tracking-widest">{step.title}</h3>
                          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              {activeSection === "faq" && (
                <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <h2 className="font-display text-4xl uppercase tracking-tighter italic">Perguntas <span className="text-primary">Frequentes</span></h2>
                    <p className="text-white/50 text-base max-w-2xl">Respostas rápidas para as dúvidas mais comuns da comunidade.</p>
                  </div>
                  <div className="grid gap-4">
                    {[
                      { q: "O SPECTRE é seguro?", a: "Sim. Utilizamos métodos de anti-detecção avançados e rotação de headers para garantir a máxima segurança da sua conta." },
                      { q: "Como resgatar as missões?", a: "Basta vincular seu token no Hub e ativar o módulo de Auto Quests. O sistema fará o resto automaticamente." },
                      { q: "Quais são as formas de pagamento?", a: "Aceitamos diversas formas de pagamento através da nossa loja oficial no Discord." }
                    ].map((item, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-white/5">
                        <h4 className="font-display text-sm uppercase tracking-wider text-primary mb-2">{item.q}</h4>
                        <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Terms Section */}
              {activeSection === "termos" && (
                <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <h2 className="font-display text-4xl uppercase tracking-tighter italic">Termos de <span className="text-primary">Uso</span></h2>
                    <p className="text-white/50 text-base max-w-2xl">Regras e diretrizes para a utilização dos nossos serviços.</p>
                  </div>
                  <div className="space-y-8 text-white/50 text-sm leading-relaxed max-w-4xl">
                    <div className="space-y-4">
                      <h3 className="font-display text-lg text-white uppercase tracking-widest">1. Aceitação dos Termos</h3>
                      <p>Ao acessar o SPECTRE, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis. O uso indevido da plataforma resultará em banimento imediato sem direito a reembolso.</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-display text-lg text-white uppercase tracking-widest">2. Uso de Automação</h3>
                      <p>Nossas ferramentas são destinadas a otimização e fins educacionais. O usuário assume total responsabilidade por qualquer ação realizada através dos nossos sistemas.</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-display text-lg text-white uppercase tracking-widest">3. Política de Reembolso</h3>
                      <p>Devido à natureza digital dos nossos serviços, reembolsos são avaliados individualmente apenas em caso de falha técnica comprovada do sistema que não possa ser resolvida em 48h.</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Support Section */}
              {activeSection === "suporte" && (
                <section className="space-y-8 py-20 text-center border border-white/5 bg-white/[0.01]">
                   <LifeBuoy className="w-12 h-12 text-white/10 mx-auto mb-4" />
                   <h2 className="font-display text-2xl uppercase tracking-widest">Central de Suporte</h2>
                   <p className="text-white/40 text-sm max-w-md mx-auto">Nossa equipe está disponível 24/7 no Discord para ajudar com qualquer problema técnico ou dúvida comercial.</p>
                   <a href="https://discord.gg/vbYK559Jnb" target="_blank" rel="noreferrer" className="ds-btn ds-btn-primary inline-flex !px-8 mt-4">Abrir Ticket no Discord</a>
                </section>
              )}
            </div>
          </Reveal>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 bg-[#0d0f14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-6 w-6 opacity-30" />
            <span className="font-display text-[10px] tracking-[0.3em] uppercase text-white/20 italic">SPECTRE <span className="text-white/10 px-2">|</span> Base Rebirth</span>
          </div>
          <div className="flex gap-8">
             {["Termos", "Privacidade", "Discord", "Status"].map(link => (
               <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-primary transition-colors">{link}</a>
             ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            © 2026. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Floating AI Chat Window */}
      {aiChatOpen && (
        <div className="fixed bottom-28 right-8 w-[380px] h-[500px] bg-[#010b12] border border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-display text-[10px] font-bold uppercase tracking-widest italic">Spectre AI Support</span>
            </div>
            <button onClick={() => setAiChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Bot className="w-8 h-8" />
                <p className="text-[10px] font-bold uppercase tracking-widest max-w-[200px]">Como posso ajudar você com a documentação hoje?</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn("w-6 h-6 shrink-0 flex items-center justify-center border", msg.role === 'user' ? "border-white/10 bg-white/5" : "border-primary/20 bg-primary/5")}>
                  {msg.role === 'user' ? <User className="w-3 h-3 text-white/40" /> : <Bot className="w-3 h-3 text-primary" />}
                </div>
                <div className={cn(
                  "p-3 text-[11px] leading-relaxed max-w-[80%]",
                  msg.role === 'user' ? "bg-white/[0.03] text-white/80" : "bg-primary/[0.03] text-primary/90"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 flex items-center justify-center border border-primary/20 bg-primary/5">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="p-3 bg-primary/[0.03] text-primary/90">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/5 bg-white/[0.02]">
            <div className="relative flex gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pergunte algo..."
                className="flex-1 bg-white/[0.03] border border-white/5 p-3 text-[11px] font-bold uppercase tracking-wider outline-none focus:border-primary/50 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping}
                className="ds-btn ds-btn-primary !px-4 shrink-0"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button 
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className={cn(
          "fixed bottom-8 right-8 ds-btn ds-btn-primary !px-6 !py-4 flex items-center gap-3 shadow-[0_10px_40px_rgba(255,0,85,0.2)] group z-50 rounded-none border border-white/10 transition-all",
          aiChatOpen && "scale-90 opacity-50"
        )}
      >
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-125" />
        <span className="font-display text-[10px] font-bold uppercase tracking-widest italic">Suporte IA Docs</span>
      </button>
    </div>
  );
}

