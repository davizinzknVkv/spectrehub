function PresenceModal({ 
  settings, 
  onClose,
  onUpdate 
}: { 
  settings: any; 
  onClose: () => void;
  onUpdate: (s: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'status' | 'custom' | 'rich'>('status');
  const [status, setStatus] = useState(settings?.status || 'online');
  const [customText, setCustomText] = useState(settings?.custom_status?.text || '');
  const [customEmoji, setCustomEmoji] = useState(settings?.custom_status?.emoji_name || '');
  const [richEnabled, setRichEnabled] = useState(false);
  const [richName, setRichName] = useState('Spectre Hub');
  const [richDetails, setRichDetails] = useState('Optimizing Discord');
  const [loading, setLoading] = useState(false);
  
  const token = useQuestStore(s => s.creds?.token);

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { updatePresence } = await import("@/lib/presence.functions");
      await updatePresence({
        data: {
          token,
          status: activeTab === 'status' ? status : undefined,
          customStatus: activeTab === 'custom' ? {
            text: customText,
            emojiName: customEmoji || undefined
          } : undefined,
          richPresence: activeTab === 'rich' ? {
            enabled: richEnabled,
            name: richName,
            details: richDetails
          } : undefined
        }
      });

      toast.success("Status atualizado");
      const newSettings = { ...settings };
      if (activeTab === 'status') newSettings.status = status;
      if (activeTab === 'custom') newSettings.custom_status = { text: customText, emoji_name: customEmoji };
      onUpdate(newSettings);
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar presença");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      title="Status & Presença" 
      description="Gerencie como você aparece no Discord através da rede Spectre"
      onClose={onClose}
      className="max-w-lg rounded-2xl"
    >
      <div className="space-y-6">
        <div className="flex border-b border-border mb-6">
          {['status', 'custom', 'rich'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-3 font-sans text-[11px] font-bold uppercase tracking-wider transition-all relative",
                activeTab === tab 
                  ? "text-primary" 
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {tab === 'status' && 'Status'}
              {tab === 'custom' && 'Personalizado'}
              {tab === 'rich' && 'Rich Presence'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_rgba(255,0,85,0.4)]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[200px] py-4">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 mb-4">Selecione sua visibilidade</div>
              <div className="grid grid-cols-2 gap-3">
                {['online', 'idle', 'dnd', 'invisible'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "p-4 border border-border bg-card/30 rounded-xl flex items-center gap-4 group transition-all duration-300",
                      status === s && "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      s === 'online' && "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
                      s === 'idle' && "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
                      s === 'dnd' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
                      s === 'invisible' && "bg-white/20"
                    )} />
                    <span className={cn(
                      "font-sans text-xs font-bold uppercase tracking-wider",
                      status === s ? "text-foreground" : "text-foreground-muted/50"
                    )}>{s === 'dnd' ? 'Não Perturbe' : s === 'invisible' ? 'Invisível' : s === 'idle' ? 'Ausente' : 'Online'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Ativar Status Customizado</span>
                <button 
                  onClick={() => setCustomText(customText ? '' : 'Spectre Hub User')}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-500",
                    customText ? "bg-primary shadow-[0_0_10px_rgba(255,0,85,0.4)]" : "bg-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500",
                    customText ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Texto do Status</label>
                  <input 
                    type="text" 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="O que você está fazendo agora?"
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all placeholder:text-foreground-muted/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Emoji (Opcional)</label>
                  <input 
                    type="text" 
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    placeholder="🚀 ou nome_do_emoji"
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all placeholder:text-foreground-muted/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rich' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-xs font-bold text-foreground uppercase tracking-tight">Atividade do Sistema</div>
                    <div className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">Simular atividade de jogo</div>
                  </div>
                </div>

                <button 
                  onClick={() => setRichEnabled(!richEnabled)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-500",
                    richEnabled ? "bg-primary shadow-[0_0_10px_rgba(255,0,85,0.4)]" : "bg-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500",
                    richEnabled ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div className={cn("space-y-4 transition-all duration-500", !richEnabled && "opacity-20 pointer-events-none grayscale")}>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Nome da Atividade</label>
                  <input 
                    type="text" 
                    value={richName}
                    onChange={(e) => setRichName(e.target.value)}
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Detalhes</label>
                  <input 
                    type="text" 
                    value={richDetails}
                    onChange={(e) => setRichDetails(e.target.value)}
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose}
            className="flex-1 ds-btn ds-btn-secondary !py-3 font-bold uppercase tracking-widest text-[11px] rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 ds-btn ds-btn-primary !py-3 font-bold uppercase tracking-widest text-[11px] rounded-lg shadow-lg shadow-primary/20"
          >
            {loading ? "Sincronizando..." : "Aplicar Protocolo"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
