import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plus, Trash2, Save, RefreshCw, Lock, LayoutDashboard, Target, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Button, Input, Modal } from "@/components/ui/ds";
import { useQuestStore } from "@/lib/quest-store";
import {
  checkAdmin,
  adminLoadAll,
  adminSavePlan,
  adminSavePreview,
  adminSaveFeature,
  adminDeleteRow,
} from "@/lib/admin.functions";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
import { adminSaveSpotifyLink } from "@/lib/admin.functions";

export const Route = createFileRoute("/_app/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Terminal Admin — SPECTRE" },
      { name: "description", content: "Painel de controle central do SPECTRE." },
    ],
  }),
});

type Plan = {
  id?: string;
  name: string;
  price: string;
  period: string;
  cta: string;
  highlight: boolean;
  features: string[];
  role_ids: string[];
  sort: number;
  active: boolean;
};
type Preview = {
  id?: string;
  product_id: string;
  title: string;
  description: string;
  image_url: string;
  sort: number;
  active: boolean;
};
type Feature = {
  id?: string;
  key: string;
  label: string;
  path: string;
  enabled: boolean;
  allowed_role_ids: string[];
  price: string;
  sort: number;
};

const TABS = ["previas", "planos", "funcoes", "spotify"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  previas: "Prévias",
  planos: "Planos",
  funcoes: "Funções",
  spotify: "Spotify Links",
};

const csv = (a: string[]) => a.join(", ");
const parseCsv = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

function AdminPage() {
  const creds = useQuestStore((s) => s.creds);
  const token = creds?.token ?? "";

  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [tab, setTab] = useState<Tab>("previas");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [spotifyLinks, setSpotifyLinks] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminLoadAll({ data: { token } });
      setPlans(data.plans as Plan[]);
      setPreviews(data.previews as Preview[]);
      setFeatures(data.features as Feature[]);
      setSpotifyLinks(data.spotifyLinks || []);
    } catch {
      toast.error("Falha na Sincronização", { description: "Não foi possível carregar os dados do terminal." });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) { setStatus("denied"); return; }
    checkAdmin({ data: { token } }).then((r) => {
      if (r.ok) { setStatus("ok"); load(); } 
      else setStatus("denied");
    });
  }, [token, load]);

  if (status === "checking") return null;

  if (status === "denied") {
    return (
      <div className="pt-20 text-center space-y-8 font-sans">
        <div className="relative inline-block">
          <Lock className="w-16 h-16 mx-auto text-primary opacity-50" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        </div>
        <h1 className="font-display text-4xl uppercase tracking-tighter text-foreground">Acesso Restrito</h1>
        <p className="text-foreground-muted max-w-sm mx-auto italic">Este terminal é exclusivo para a inteligência central do SPECTRE.</p>
        <Button onClick={() => window.location.href = "/"} variant="secondary">Voltar ao Início</Button>
      </div>
    );
  }

  return (
    <div className="page-stack max-w-6xl mx-auto font-sans">
      <PageHeader
        eyebrow="admin --root"
        icon={ShieldCheck}
        title="Terminal de"
        highlight="Administração"
        description="Controle total sobre a infraestrutura, produtos e permissões do ecossistema Spectre."
      />

      <div className="flex flex-wrap gap-2 p-1 mb-12 max-w-md bg-card/30 border border-border rounded-xl">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2 font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              tab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-foreground-muted hover:text-foreground"
            )}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 pb-20">
        {tab === "previas" && <PreviewsTab token={token} rows={previews} setRows={setPreviews} reload={load} loading={loading} />}
        {tab === "planos" && <PlansTab token={token} rows={plans} setRows={setPlans} reload={load} loading={loading} />}
        {tab === "funcoes" && <FeaturesTab token={token} rows={features} setRows={setFeatures} reload={load} loading={loading} />}
        {tab === "spotify" && <SpotifyTab token={token} rows={spotifyLinks} setRows={setSpotifyLinks} reload={load} loading={loading} />}
      </div>
    </div>
  );
}

function SpotifyTab({ token, rows, setRows, reload }: any) {
  const [bulkText, setBulkText] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const update = (i: number, patch: any) => setRows(rows.map((r: any, idx: number) => (idx === i ? { ...r, ...patch } : r)));
  const save = async (row: any) => {
    try {
      await adminSaveSpotifyLink({ data: { token, link: row } });
      toast.success("Link Salvo", { description: "Link do Spotify atualizado na base." });
      await reload();
    } catch { toast.error("Falha ao salvar link."); }
  };
  const remove = async (row: any) => {
    if (!row.id) { setRows(rows.filter((r: any) => r !== row)); return; }
    await adminDeleteRow({ data: { token, table: "spotify_links", id: row.id } });
    toast.success("Removido.");
    await reload();
  };

  const handleBulkAdd = async () => {
    const urls = bulkText.split("\n").map(u => u.trim()).filter(u => u.startsWith("http"));
    if (urls.length === 0) {
      toast.error("Nenhuma URL válida encontrada.");
      return;
    }

    toast.loading(`Importando ${urls.length} links...`);
    try {
      for (const url of urls) {
        await adminSaveSpotifyLink({ data: { token, link: { url, active: true } } });
      }
      toast.dismiss();
      toast.success("Importação Concluída", { description: `${urls.length} links adicionados.` });
      setBulkText("");
      setIsBulkOpen(false);
      await reload();
    } catch (err) {
      toast.dismiss();
      toast.error("Erro na importação em massa.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
         <div className="font-mono text-[10px] uppercase font-bold text-foreground-muted/50">{rows.length} Links Base</div>
         <div className="flex gap-2">
           <Button 
             onClick={() => setIsBulkOpen(true)}
             variant="secondary"
             size="sm"
             className="border-primary/20 text-primary"
           >Multi-Links</Button>
           <Button 
             onClick={() => setRows([{ url: "", label: "", active: true }, ...rows])}
             size="sm"
           >Adicionar Link</Button>
         </div>
      </div>

      {isBulkOpen && (
        <Modal 
          onClose={() => setIsBulkOpen(false)}
          title="Importação em Massa"
        >
          <div className="space-y-4 pt-4">
            <p className="text-[11px] text-foreground-muted uppercase font-bold tracking-wider">Cole os links abaixo (um por linha):</p>
            <textarea 
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full h-48 bg-background border border-border rounded-lg p-3 font-mono text-xs focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder={"https://open.spotify.com/...\nhttps://open.spotify.com/..."}
            />
            <div className="flex gap-2">
              <Button onClick={handleBulkAdd} className="flex-1">Processar Links</Button>
              <Button onClick={() => setIsBulkOpen(false)} variant="secondary">Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 gap-4">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card !p-6 border-border bg-card/30 rounded-xl flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 space-y-1 w-full">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">URL do Spotify</label>
                <Input value={row.url} onChange={(e) => update(i, { url: e.target.value })} className="font-mono text-[11px]" placeholder="https://open.spotify.com/..." />
             </div>
             <div className="w-full md:w-32 space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Stock</label>
                <Input type="number" value={row.stock ?? 100} onChange={(e) => update(i, { stock: parseInt(e.target.value) || 0 })} className="font-mono text-[11px]" />
             </div>
             <div className="w-full md:w-48 space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Label (Opcional)</label>
                <Input value={row.label || ""} onChange={(e) => update(i, { label: e.target.value })} className="text-[11px]" placeholder="Ex: Pop Hits" />
             </div>
             <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={() => save(row)} className="flex-1 md:flex-none h-10 px-6">Salvar</Button>
                <Button onClick={() => remove(row)} variant="secondary" className="w-10 h-10 !p-0 text-primary border-primary/20 hover:bg-primary/5">
                   <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewsTab({ token, rows, setRows, reload, loading }: any) {
  const update = (i: number, patch: Partial<Preview>) => setRows(rows.map((r: any, idx: number) => (idx === i ? { ...r, ...patch } : r)));
  const save = async (row: Preview) => {
    try {
      await adminSavePreview({ data: { token, preview: row } });
      toast.success("Commit Realizado", { description: "As alterações foram salvas com sucesso." });
      await reload();
    } catch { toast.error("Falha no commit."); }
  };
  const remove = async (row: Preview) => {
    if (!row.id) { setRows(rows.filter((r: any) => r !== row)); return; }
    await adminDeleteRow({ data: { token, table: "site_previews", id: row.id } });
    toast.success("Deletado.");
    await reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
         <div className="font-mono text-[10px] uppercase font-bold text-foreground-muted/50">{rows.length} Entradas no Sistema</div>
         <Button 
           onClick={() => setRows([...rows, { product_id: "quests", title: "", description: "", image_url: "", sort: rows.length, active: true }])}
           size="sm"
         >Novo Registro</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card !p-6 border-border bg-card/30 rounded-xl space-y-4 hover:border-primary/20 transition-all">
             <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-background relative group">
                {row.image_url ? (
                  <img src={row.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-muted/20">
                    <Activity className="w-8 h-8" />
                  </div>
                )}
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Product ID</label>
                   <Input value={row.product_id} onChange={(e) => update(i, { product_id: e.target.value })} className="h-8 text-[11px] font-mono" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Status</label>
                   <select value={row.active ? "1" : "0"} onChange={(e) => update(i, { active: e.target.value === "1" })} className="w-full h-8 bg-background border border-border rounded-md px-2 text-[11px] outline-none">
                      <option value="1">Ativo</option>
                      <option value="0">Desativado</option>
                   </select>
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Título do Produto</label>
                <Input value={row.title} onChange={(e) => update(i, { title: e.target.value })} className="h-8 text-[11px]" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Asset URL</label>
                <Input value={row.image_url} onChange={(e) => update(i, { image_url: e.target.value })} className="h-8 text-[10px] font-mono" />
             </div>
             <div className="flex gap-2 pt-2">
                <Button onClick={() => save(row)} className="flex-1 h-8 text-[10px]">Commit</Button>
                <Button onClick={() => remove(row)} variant="secondary" className="w-10 h-8 !p-0 text-primary border-primary/20 hover:bg-primary/5">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlansTab({ token, rows, setRows, reload }: any) {
  const update = (i: number, patch: Partial<Plan>) => setRows(rows.map((r: any, idx: number) => (idx === i ? { ...r, ...patch } : r)));
  const save = async (row: Plan) => {
    try {
      await adminSavePlan({ data: { token, plan: row } });
      toast.success("Plano Sincronizado", { description: "Alterações de nível enviadas para o sistema." });
      await reload();
    } catch { toast.error("Erro no deploy."); }
  };
  const remove = async (row: Plan) => {
    if (!row.id) { setRows(rows.filter((r: any) => r !== row)); return; }
    await adminDeleteRow({ data: { token, table: "site_plans", id: row.id } });
    toast.success("Removido.");
    await reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
         <div className="font-mono text-[10px] uppercase font-bold text-foreground-muted/50">{rows.length} Níveis de Acesso</div>
         <Button 
           onClick={() => setRows([...rows, { name: "New Tier", price: "0", period: "month", cta: "Unlock", highlight: false, features: ["20 missões diárias"], role_ids: [], sort: rows.length, active: true }])}
           size="sm"
         >Novo Plano</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Nome do Plano</label>
                   <Input value={row.name} onChange={(e) => update(i, { name: e.target.value })} className="font-bold uppercase" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Valor (R$)</label>
                   <Input value={row.price} onChange={(e) => update(i, { price: e.target.value })} className="font-bold text-primary" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Discord Role IDs (CSV)</label>
                <Input value={csv(row.role_ids)} onChange={(e) => update(i, { role_ids: parseCsv(e.target.value) })} className="font-mono text-[11px]" />
             </div>
             <div className="flex gap-3 pt-2">
                <Button onClick={() => save(row)} className="flex-1">Sincronizar Plano</Button>
                <Button onClick={() => remove(row)} variant="secondary" className="w-12 text-primary border-primary/20 hover:bg-primary/5">
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesTab({ token, rows, setRows, reload }: any) {
  const update = (i: number, patch: Partial<Feature>) => setRows(rows.map((r: any, idx: number) => (idx === i ? { ...r, ...patch } : r)));
  const save = async (row: Feature) => {
    try {
      await adminSaveFeature({ data: { token, feature: row } });
      toast.success("Protocolo Atualizado", { description: "Configurações de função salvas." });
      await reload();
    } catch { toast.error("Falha na atualização."); }
  };

  return (
    <div className="space-y-6">
      <div className="font-mono text-[10px] uppercase font-bold text-foreground-muted/50 px-2">{rows.length} Funções Sistêmicas</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card !p-8 border-border bg-card/30 rounded-xl space-y-6">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="font-bold text-foreground uppercase tracking-tight">{row.label}</div>
                   <div className="font-mono text-[10px] text-foreground-muted">{row.path}</div>
                </div>
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  row.enabled ? 'bg-primary shadow-[0_0_12px_rgba(255,0,85,0.4)]' : 'bg-foreground-muted/20'
                )} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">IDs com Acesso</label>
                <Input value={csv(row.allowed_role_ids)} onChange={(e) => update(i, { allowed_role_ids: parseCsv(e.target.value) })} className="font-mono text-[11px]" />
             </div>
             <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Disponibilidade</label>
                   <select value={row.enabled ? "1" : "0"} onChange={(e) => update(i, { enabled: e.target.value === "1" })} className="w-full bg-background border border-border rounded-md py-2 px-3 text-xs outline-none">
                      <option value="1">Online / Ativo</option>
                      <option value="0">Offline / Manutenção</option>
                   </select>
                </div>
                <Button onClick={() => save(row)} className="w-full">Atualizar</Button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
