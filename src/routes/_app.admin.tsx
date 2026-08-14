import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plus, Trash2, Save, RefreshCw, Lock } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Button, Input, Field, Card, EmptyState } from "@/components/ui/ds";
import { useQuestStore } from "@/lib/quest-store";
import {
  checkAdmin,
  adminLoadAll,
  adminSavePlan,
  adminSavePreview,
  adminSaveFeature,
  adminDeleteRow,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_app/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Painel Admin · Spectre Hub" },
      { name: "description", content: "Gerencie planos, prévias, cargos e valores do Spectre Hub." },
      { property: "og:title", content: "Painel Admin · Spectre Hub" },
      { property: "og:description", content: "Controle total sobre os produtos e permissões do Spectre Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  planos: "Planos & Valores",
  funcoes: "Funções & Cargos",
};

const csv = (a: string[]) => a.join(", ");
const parseCsv = (v: string) =>
  v.split(",").map((s) => s.trim()).filter(Boolean);

function AdminPage() {
  const creds = useQuestStore((s) => s.creds);
  const hydrate = useQuestStore((s) => s.hydrate);
  const token = creds?.token ?? "";

  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [tab, setTab] = useState<Tab>("previas");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminLoadAll({ data: { token } });
      setPlans(data.plans as Plan[]);
      setPreviews(data.previews as Preview[]);
      setFeatures(data.features as Feature[]);
    } catch {
      toast.error("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let alive = true;
    if (!token) {
      setStatus("denied");
      return;
    }
    checkAdmin({ data: { token } }).then((r) => {
      if (!alive) return;
      if (r.ok) {
        setStatus("ok");
        void load();
      } else {
        setStatus("denied");
      }
    });
    return () => {
      alive = false;
    };
  }, [token, load]);

  if (status === "checking") {
    return (
      <div className="page-stack">
        <PageHeader eyebrow="// admin" title="Verificando" highlight="acesso" icon={ShieldCheck} />
        <Card>
          <p className="ds-body">Validando sua conta…</p>
        </Card>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="page-stack">
        <PageHeader eyebrow="// admin" title="Área" highlight="restrita" icon={Lock} />
        <EmptyState
          icon={Lock}
          title="Acesso negado"
          description="Este painel é exclusivo da conta administradora do Spectre Hub. Conecte a conta correta em Configurações."
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="// admin"
        title="Painel"
        highlight="administrativo"
        icon={ShieldCheck}
        description="Controle total: prévias dos produtos, planos, valores, cargos e ferramentas liberadas."
        actions={
          <Button variant="secondary" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Recarregar
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
              tab === t
                ? "bg-[#ff0055] border-[#ff0055] text-white"
                : "bg-white/5 border-white/10 text-[#8a8a8a] hover:bg-white/10"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === "previas" && (
        <PreviewsTab token={token} rows={previews} setRows={setPreviews} reload={load} />
      )}
      {tab === "planos" && <PlansTab token={token} rows={plans} setRows={setPlans} reload={load} />}
      {tab === "funcoes" && (
        <FeaturesTab token={token} rows={features} setRows={setFeatures} reload={load} />
      )}
    </div>
  );
}

/* ── Prévias ─────────────────────────────────────────────── */
function PreviewsTab({
  token,
  rows,
  setRows,
  reload,
}: {
  token: string;
  rows: Preview[];
  setRows: (r: Preview[]) => void;
  reload: () => Promise<void>;
}) {
  const update = (i: number, patch: Partial<Preview>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const save = async (row: Preview) => {
    if (!row.image_url) return toast.error("Informe a URL da imagem.");
    try {
      await adminSavePreview({ data: { token, preview: row } });
      toast.success("Prévia salva.");
      await reload();
    } catch {
      toast.error("Erro ao salvar a prévia.");
    }
  };

  const remove = async (row: Preview) => {
    if (!row.id) return setRows(rows.filter((r) => r !== row));
    await adminDeleteRow({ data: { token, table: "site_previews", id: row.id } });
    toast.success("Prévia removida.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        onClick={() =>
          setRows([
            ...rows,
            {
              product_id: "quests",
              title: "",
              description: "",
              image_url: "",
              sort: rows.length,
              active: true,
            },
          ])
        }
      >
        <Plus className="h-3.5 w-3.5" /> Nova prévia
      </Button>

      {rows.length === 0 && (
        <EmptyState
          icon={Plus}
          title="Nenhuma prévia"
          description="Adicione imagens de prévia para exibir na vitrine de produtos da home."
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`} className="space-y-3">
            {row.image_url && (
              <img
                src={row.image_url}
                alt={row.title || "Prévia"}
                loading="lazy"
                className="aspect-video w-full border border-white/10 object-cover"
              />
            )}
            <Field label="Produto (id)">
              <Input
                value={row.product_id}
                onChange={(e) => update(i, { product_id: e.target.value })}
                placeholder="quests, nicks, orbs, farms, control, presence"
              />
            </Field>
            <Field label="Título">
              <Input value={row.title} onChange={(e) => update(i, { title: e.target.value })} />
            </Field>
            <Field label="Descrição">
              <Input
                value={row.description}
                onChange={(e) => update(i, { description: e.target.value })}
              />
            </Field>
            <Field label="URL da imagem">
              <Input
                value={row.image_url}
                onChange={(e) => update(i, { image_url: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ordem">
                <Input
                  type="number"
                  value={row.sort}
                  onChange={(e) => update(i, { sort: Number(e.target.value) })}
                />
              </Field>
              <Field label="Ativa">
                <select
                  className="ds-input"
                  value={row.active ? "1" : "0"}
                  onChange={(e) => update(i, { active: e.target.value === "1" })}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => void save(row)}>
                <Save className="h-3.5 w-3.5" /> Salvar
              </Button>
              <Button variant="danger" onClick={() => void remove(row)}>
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Planos ──────────────────────────────────────────────── */
function PlansTab({
  token,
  rows,
  setRows,
  reload,
}: {
  token: string;
  rows: Plan[];
  setRows: (r: Plan[]) => void;
  reload: () => Promise<void>;
}) {
  const update = (i: number, patch: Partial<Plan>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const save = async (row: Plan) => {
    try {
      await adminSavePlan({ data: { token, plan: row } });
      toast.success("Plano salvo.");
      await reload();
    } catch {
      toast.error("Erro ao salvar o plano.");
    }
  };

  const remove = async (row: Plan) => {
    if (!row.id) return setRows(rows.filter((r) => r !== row));
    await adminDeleteRow({ data: { token, table: "site_plans", id: row.id } });
    toast.success("Plano removido.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        onClick={() =>
          setRows([
            ...rows,
            {
              name: "Novo plano",
              price: "R$ 0",
              period: "mensal",
              cta: "Assinar",
              highlight: false,
              features: [],
              role_ids: [],
              sort: rows.length,
              active: true,
            },
          ])
        }
      >
        <Plus className="h-3.5 w-3.5" /> Novo plano
      </Button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome">
                <Input value={row.name} onChange={(e) => update(i, { name: e.target.value })} />
              </Field>
              <Field label="Valor">
                <Input value={row.price} onChange={(e) => update(i, { price: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Período">
                <Input value={row.period} onChange={(e) => update(i, { period: e.target.value })} />
              </Field>
              <Field label="Texto do botão">
                <Input value={row.cta} onChange={(e) => update(i, { cta: e.target.value })} />
              </Field>
            </div>
            <Field label="Benefícios (separados por vírgula)">
              <Input
                value={csv(row.features)}
                onChange={(e) => update(i, { features: parseCsv(e.target.value) })}
              />
            </Field>
            <Field label="Cargos do Discord vinculados (IDs, vírgula)">
              <Input
                value={csv(row.role_ids)}
                onChange={(e) => update(i, { role_ids: parseCsv(e.target.value) })}
              />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Ordem">
                <Input
                  type="number"
                  value={row.sort}
                  onChange={(e) => update(i, { sort: Number(e.target.value) })}
                />
              </Field>
              <Field label="Destaque">
                <select
                  className="ds-input"
                  value={row.highlight ? "1" : "0"}
                  onChange={(e) => update(i, { highlight: e.target.value === "1" })}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </Field>
              <Field label="Ativo">
                <select
                  className="ds-input"
                  value={row.active ? "1" : "0"}
                  onChange={(e) => update(i, { active: e.target.value === "1" })}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => void save(row)}>
                <Save className="h-3.5 w-3.5" /> Salvar
              </Button>
              <Button variant="danger" onClick={() => void remove(row)}>
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Funções e cargos ────────────────────────────────────── */
function FeaturesTab({
  token,
  rows,
  setRows,
  reload,
}: {
  token: string;
  rows: Feature[];
  setRows: (r: Feature[]) => void;
  reload: () => Promise<void>;
}) {
  const update = (i: number, patch: Partial<Feature>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const save = async (row: Feature) => {
    try {
      await adminSaveFeature({ data: { token, feature: row } });
      toast.success("Função atualizada.");
      await reload();
    } catch {
      toast.error("Erro ao salvar a função.");
    }
  };

  const remove = async (row: Feature) => {
    if (!row.id) return setRows(rows.filter((r) => r !== row));
    await adminDeleteRow({ data: { token, table: "site_features", id: row.id } });
    toast.success("Função removida.");
    await reload();
  };

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        onClick={() =>
          setRows([
            ...rows,
            {
              key: "",
              label: "",
              path: "/",
              enabled: true,
              allowed_role_ids: [],
              price: "",
              sort: rows.length,
            },
          ])
        }
      >
        <Plus className="h-3.5 w-3.5" /> Nova função
      </Button>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Chave">
                <Input value={row.key} onChange={(e) => update(i, { key: e.target.value })} />
              </Field>
              <Field label="Nome exibido">
                <Input value={row.label} onChange={(e) => update(i, { label: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Rota">
                <Input value={row.path} onChange={(e) => update(i, { path: e.target.value })} />
              </Field>
              <Field label="Valor (opcional)">
                <Input
                  value={row.price}
                  onChange={(e) => update(i, { price: e.target.value })}
                  placeholder="R$ 9,90"
                />
              </Field>
            </div>
            <Field
              label="Cargos que podem usar (IDs, vírgula)"
              hint="Vazio = liberado para todos."
            >
              <Input
                value={csv(row.allowed_role_ids)}
                onChange={(e) => update(i, { allowed_role_ids: parseCsv(e.target.value) })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ordem">
                <Input
                  type="number"
                  value={row.sort}
                  onChange={(e) => update(i, { sort: Number(e.target.value) })}
                />
              </Field>
              <Field label="Ativa">
                <select
                  className="ds-input"
                  value={row.enabled ? "1" : "0"}
                  onChange={(e) => update(i, { enabled: e.target.value === "1" })}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => void save(row)}>
                <Save className="h-3.5 w-3.5" /> Salvar
              </Button>
              <Button variant="danger" onClick={() => void remove(row)}>
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
