import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plus, Trash2, Save, RefreshCw, Lock, LayoutDashboard, Target, Zap } from "lucide-react";

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

export const Route = createFileRoute("/_app/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Terminal Admin — Spectre Hub" },
      { name: "description", content: "Painel de controle central do Spectre Hub." },
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

const TABS = ["previas", "planos", "funcoes"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  previas: "Prévias",
  planos: "Planos",
  funcoes: "Funções",
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

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminLoadAll({ data: { token } });
      setPlans(data.plans as Plan[]);
      setPreviews(data.previews as Preview[]);
      setFeatures(data.features as Feature[]);
    } catch {
      toast.error("Falha na sincronização.");
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
      <div className="pt-20 text-center space-y-8">
        <Lock className="w-16 h-16 mx-auto text-rose-500 opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white italic">Acesso Restrito</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">Este terminal é exclusivo para a inteligência central do Spectre Hub.</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="admin --root"
        icon={ShieldCheck}
        title="Terminal de"
        highlight="Administração"
        description="Controle total sobre a infraestrutura, produtos e permissões do ecossistema Spectre."
      />

      <div className="flex flex-wrap gap-px bg-white/5 border border-white/5 p-1 mb-8 max-w-md">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 font-display text-[10px] uppercase tracking-widest italic transition-all ${
              tab === t ? "bg-spectre-pink text-white" : "text-white/30 hover:text-white"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {tab === "previas" && <PreviewsTab token={token} rows={previews} setRows={setPreviews} reload={load} loading={loading} />}
        {tab === "planos" && <PlansTab token={token} rows={plans} setRows={setPlans} reload={load} loading={loading} />}
        {tab === "funcoes" && <FeaturesTab token={token} rows={features} setRows={setFeatures} reload={load} loading={loading} />}
      </div>
    </div>
  );
}

function PreviewsTab({ token, rows, setRows, reload, loading }: any) {
  const update = (i: number, patch: Partial<Preview>) => setRows(rows.map((r: any, idx: number) => (idx === i ? { ...r, ...patch } : r)));
  const save = async (row: Preview) => {
    try {
      await adminSavePreview({ data: { token, preview: row } });
      toast.success("Build salva.");
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
      <div className="flex justify-between items-center">
         <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{rows.length} Entradas</div>
         <button 
           onClick={() => setRows([...rows, { product_id: "quests", title: "", description: "", image_url: "", sort: rows.length, active: true }])}
           className="ds-btn ds-btn-secondary !py-2 !px-6 !text-[9px]"
         >Novo Registro</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
             {row.image_url && <img src={row.image_url} alt="" className="aspect-video w-full object-cover grayscale opacity-50 border border-white/5 mb-4" />}
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Product ID</label>
                   <Input value={row.product_id} onChange={(e) => update(i, { product_id: e.target.value })} className="bg-black/40 border-white/5 text-xs font-mono" />
                </div>
                <div>
                   <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Status</label>
                   <select value={row.active ? "1" : "0"} onChange={(e) => update(i, { active: e.target.value === "1" })} className="w-full bg-black/40 border-white/5 py-2 px-3 font-display text-[9px] text-white italic outline-none">
                      <option value="1">Ativo</option>
                      <option value="0">Disabled</option>
                   </select>
                </div>
             </div>
             <div>
                <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Título</label>
                <Input value={row.title} onChange={(e) => update(i, { title: e.target.value })} className="bg-black/40 border-white/5 text-xs italic" />
             </div>
             <div>
                <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Asset URL</label>
                <Input value={row.image_url} onChange={(e) => update(i, { image_url: e.target.value })} className="bg-black/40 border-white/5 text-[10px] font-mono" />
             </div>
             <div className="flex gap-3 pt-2">
                <button onClick={() => save(row)} className="ds-btn ds-btn-primary flex-1 !py-2 !text-[9px]">Commit</button>
                <button onClick={() => remove(row)} className="ds-btn ds-btn-secondary !text-rose-500 border-rose-500/10 !py-2 !px-4"><Trash2 className="w-3.5 h-3.5" /></button>
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
      toast.success("Plano sincronizado.");
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
      <div className="flex justify-between items-center">
         <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{rows.length} Níveis</div>
         <button 
           onClick={() => setRows([...rows, { name: "New Tier", price: "0", period: "month", cta: "Unlock", highlight: false, features: [], role_ids: [], sort: rows.length, active: true }])}
           className="ds-btn ds-btn-secondary !py-2 !px-6 !text-[9px]"
         >Novo Plano</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Nome</label>
                   <Input value={row.name} onChange={(e) => update(i, { name: e.target.value })} className="bg-black/40 border-white/5 text-xs font-bold uppercase italic" />
                </div>
                <div>
                   <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Valor</label>
                   <Input value={row.price} onChange={(e) => update(i, { price: e.target.value })} className="bg-black/40 border-white/5 text-xs text-spectre-pink font-bold" />
                </div>
             </div>
             <div>
                <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Discord Roles (IDs)</label>
                <Input value={csv(row.role_ids)} onChange={(e) => update(i, { role_ids: parseCsv(e.target.value) })} className="bg-black/40 border-white/5 text-[10px] font-mono" />
             </div>
             <div className="flex gap-3 pt-2">
                <button onClick={() => save(row)} className="ds-btn ds-btn-primary flex-1 !py-2 !text-[9px]">Sincronizar</button>
                <button onClick={() => remove(row)} className="ds-btn ds-btn-secondary !text-rose-500 border-rose-500/10 !py-2 !px-4"><Trash2 className="w-3.5 h-3.5" /></button>
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
      toast.success("Protocolo atualizado.");
      await reload();
    } catch { toast.error("Falha na atualização."); }
  };

  return (
    <div className="space-y-6">
      <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{rows.length} Funções Mapeadas</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row: any, i: number) => (
          <div key={row.id || i} className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="font-display text-xs text-white uppercase italic tracking-widest">{row.label}</div>
                   <div className="font-mono text-[9px] text-white/20">{row.path}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${row.enabled ? 'bg-spectre-pink shadow-[0_0_8px_#ff0055]' : 'bg-white/10'}`} />
             </div>
             <div>
                <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Roles Permitidas (IDs)</label>
                <Input value={csv(row.allowed_role_ids)} onChange={(e) => update(i, { allowed_role_ids: parseCsv(e.target.value) })} className="bg-black/40 border-white/5 text-[10px] font-mono" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="font-display text-[8px] text-white/20 uppercase tracking-widest italic block mb-1">Status</label>
                   <select value={row.enabled ? "1" : "0"} onChange={(e) => update(i, { enabled: e.target.value === "1" })} className="w-full bg-black/40 border-white/5 py-2 px-3 font-display text-[9px] text-white italic outline-none">
                      <option value="1">Online</option>
                      <option value="0">Offline</option>
                   </select>
                </div>
                <div className="flex items-end">
                   <button onClick={() => save(row)} className="ds-btn ds-btn-primary w-full !py-2 !text-[9px]">Salvar</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
