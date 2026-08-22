import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Music, Copy, Download, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, Input } from "@/components/ui/ds";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateSpotifyLinks } from "@/lib/spotify.functions";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app/spotify")({
  head: () => ({ meta: [{ title: "Spotify Gen — Spectre Hub" }] }),
  component: SpotifyGenPage,
});

function SpotifyGenPage() {
  const [quantity, setQuantity] = useState(10);
  const [utmSource, setUtmSource] = useState("spectre");
  const [utmMedium, setUtmMedium] = useState("discord");
  const [utmCampaign, setUtmCampaign] = useState("spotify");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const genFn = useServerFn(generateSpotifyLinks);

  const handleGenerate = async () => {
    if (quantity < 1 || quantity > 100) {
      toast.error("Quantidade inválida (1-100)");
      return;
    }

    setLoading(true);
    try {
      const res = await genFn({
        data: {
          quantity,
          utmSource,
          utmMedium,
          utmCampaign,
        },
      });

      if (res.ok) {
        setLinks(res.links);
        toast.success("Links gerados com sucesso!");
      }
    } catch (err) {
      toast.error("Falha ao gerar links.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (links.length === 0) return;
    navigator.clipboard.writeText(links.join("\n"));
    toast.success("✓ Links copiados");
  };

  const handleDownload = () => {
    if (links.length === 0) return;
    const blob = new Blob([links.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spotify_links.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-stack">
      <PageHeader 
        title="SPOTIFY GEN" 
        description="Gerador de links de campanha para Spotify."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8 relative overflow-hidden">
            {/* Ambient Pink Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-spectre-pink/5 blur-[60px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 flex items-center justify-center border border-spectre-pink/20 bg-spectre-pink/5 text-spectre-pink">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white uppercase italic tracking-widest leading-none">Gerar links Spotify</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-2 font-bold font-sans">Protocolo de Campanha</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">Quantidade de links</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={100} 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="bg-obsidian border-white/10 font-mono text-xs focus:border-spectre-pink/50 transition-all"
                />
                <p className="text-[8px] text-white/20 uppercase tracking-widest pl-1">Máximo: 100 por lote</p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">UTM Source</label>
                    <Input 
                      placeholder="Ex: spectre" 
                      value={utmSource} 
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="bg-obsidian border-white/10 font-mono text-xs focus:border-spectre-pink/50 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">UTM Medium</label>
                    <Input 
                      placeholder="Ex: discord" 
                      value={utmMedium} 
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="bg-obsidian border-white/10 font-mono text-xs focus:border-spectre-pink/50 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">UTM Campaign</label>
                    <Input 
                      placeholder="Ex: spotify" 
                      value={utmCampaign} 
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      className="bg-obsidian border-white/10 font-mono text-xs focus:border-spectre-pink/50 transition-all"
                    />
                 </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="ds-btn ds-btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Gerando Protocolos...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    Gerar Links de Campanha
                  </>
                )}
              </button>
            </div>
          </Card>

          <Card className="p-6 border-white/5 bg-white/[0.01] border-dashed">
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 text-white/40">
                  <AlertCircle className="w-4 h-4" />
                  <h4 className="font-display text-[9px] uppercase tracking-widest italic font-bold">Aviso Legal</h4>
               </div>
               <p className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-sans italic leading-relaxed">
                  Esta ferramenta gera links legítimos de redirecionamento do Spotify com parâmetros UTM para rastreamento de campanhas. Não gera contas premium, vouchers ou assinaturas gratuitas.
               </p>
               <div className="pt-4 border-t border-white/5">
                 <p className="text-[10px] text-spectre-pink uppercase tracking-widest font-bold italic">
                   Restrição de Acesso:
                 </p>
                 <p className="text-[9px] text-white/50 uppercase tracking-[0.1em] mt-1">
                   O acesso ao Spotify Gen está disponível apenas para membros Premium (30 dias) e Lifetime. Planos Free e Booster não possuem acesso a esta funcionalidade.
                 </p>
               </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <Card className="p-8 border-white/5 bg-white/[0.02] flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-spectre-pink shadow-[0_0_8px_#ff0055]" />
                    <h3 className="font-display text-sm text-white uppercase italic tracking-widest">Output de Resultados</h3>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleCopy} 
                      disabled={links.length === 0}
                      className="!text-[9px] !py-2 !h-auto flex items-center gap-2"
                    >
                       <Copy className="w-3 h-3" /> Copiar
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleDownload} 
                      disabled={links.length === 0}
                      className="!text-[9px] !py-2 !h-auto flex items-center gap-2"
                    >
                       <Download className="w-3 h-3" /> Baixar .TXT
                    </Button>
                 </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/5 p-6 font-mono text-[11px] text-white/60 overflow-y-auto custom-scrollbar relative">
                 <AnimatePresence mode="wait">
                   {links.length > 0 ? (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="space-y-2"
                     >
                       {links.map((link, i) => (
                         <div key={i} className="py-1 border-b border-white/[0.02] break-all hover:text-white transition-colors">
                           {link}
                         </div>
                       ))}
                     </motion.div>
                   ) : (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="h-full flex flex-col items-center justify-center gap-4 text-white/10"
                     >
                        <div className="w-16 h-16 border border-white/5 flex items-center justify-center opacity-20">
                           <Music className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] italic">Aguardando geração...</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {links.length > 0 && (
                <div className="mt-6 flex items-center justify-between text-[9px] uppercase tracking-widest text-white/30 italic">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-spectre-pink" />
                      {links.length} Protocolos Gerados
                   </div>
                   <span>Terminal Ativo</span>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
