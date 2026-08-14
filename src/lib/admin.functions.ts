import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Única conta autorizada a administrar o Spectre Hub. */
const ADMIN_DISCORD_ID = "1217795750407442473";

/**
 * Valida o token Discord informado e garante que ele pertence ao dono do site.
 * A checagem acontece sempre no servidor — o cliente nunca decide se é admin.
 */
async function assertAdmin(token: string) {
  const res = await fetch("https://discord.com/api/v9/users/@me", {
    headers: { authorization: token },
  });
  if (res.status !== 200) throw new Error("Token inválido ou expirado.");
  const me = (await res.json()) as { id: string; username?: string; global_name?: string };
  if (me.id !== ADMIN_DISCORD_ID) throw new Error("Acesso negado.");
  return me;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const tokenInput = z.object({ token: z.string().min(10) });

export const checkAdmin = createServerFn({ method: "POST" })
  .validator((raw) => tokenInput.parse(raw))
  .handler(async ({ data }) => {
    try {
      const me = await assertAdmin(data.token);
      return { ok: true as const, id: me.id, username: me.global_name ?? me.username ?? "admin" };
    } catch {
      return { ok: false as const };
    }
  });

export const adminLoadAll = createServerFn({ method: "POST" })
  .validator((raw) => tokenInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const [plans, previews, features] = await Promise.all([
      db.from("site_plans").select("*").order("sort"),
      db.from("site_previews").select("*").order("sort"),
      db.from("site_features").select("*").order("sort"),
    ]);
    return {
      plans: plans.data ?? [],
      previews: previews.data ?? [],
      features: features.data ?? [],
    };
  });

/* ── Planos ─────────────────────────────────────────────── */
const planInput = tokenInput.extend({
  plan: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(40),
    price: z.string().max(20),
    period: z.string().max(40),
    cta: z.string().max(40),
    highlight: z.boolean(),
    features: z.array(z.string().max(120)).max(12),
    role_ids: z.array(z.string().max(30)).max(12),
    sort: z.number().int().min(0).max(99),
    active: z.boolean(),
  }),
});

export const adminSavePlan = createServerFn({ method: "POST" })
  .validator((raw) => planInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("site_plans").upsert(data.plan);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ── Prévias ────────────────────────────────────────────── */
const previewInput = tokenInput.extend({
  preview: z.object({
    id: z.string().uuid().optional(),
    product_id: z.string().min(1).max(40),
    title: z.string().max(80),
    description: z.string().max(280),
    image_url: z.string().url().max(600),
    sort: z.number().int().min(0).max(99),
    active: z.boolean(),
  }),
});

export const adminSavePreview = createServerFn({ method: "POST" })
  .validator((raw) => previewInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("site_previews").upsert(data.preview);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ── Ferramentas / cargos / valores ─────────────────────── */
const featureInput = tokenInput.extend({
  feature: z.object({
    id: z.string().uuid().optional(),
    key: z.string().min(1).max(40),
    label: z.string().min(1).max(60),
    path: z.string().max(80),
    enabled: z.boolean(),
    allowed_role_ids: z.array(z.string().max(30)).max(20),
    price: z.string().max(20),
    sort: z.number().int().min(0).max(99),
  }),
});

export const adminSaveFeature = createServerFn({ method: "POST" })
  .validator((raw) => featureInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("site_features").upsert(data.feature, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ── Remoção genérica ───────────────────────────────────── */
const deleteInput = tokenInput.extend({
  table: z.enum(["site_plans", "site_previews", "site_features", "optimizer_features", "optimizer_previews"]),
  id: z.string().uuid(),
});

/* ── Spectre Optimizer ───────────────────────────────────── */
const optimizerSettingsInput = tokenInput.extend({
  settings: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(60),
    badge: z.string().max(30),
    title: z.string().max(120),
    description: z.string().max(500),
    button_text: z.string().max(40),
    button_link: z.string().url().max(600),
    status: z.string().max(40),
    active: z.boolean(),
  }),
});

export const adminSaveOptimizerSettings = createServerFn({ method: "POST" })
  .validator((raw) => optimizerSettingsInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("optimizer_settings").upsert(data.settings);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const optimizerFeatureInput = tokenInput.extend({
  feature: z.object({
    id: z.string().uuid().optional(),
    icon: z.string().min(1).max(40),
    title: z.string().min(1).max(60),
    description: z.string().max(280),
    sort: z.number().int().min(0).max(99),
    active: z.boolean(),
  }),
});

export const adminSaveOptimizerFeature = createServerFn({ method: "POST" })
  .validator((raw) => optimizerFeatureInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("optimizer_features").upsert(data.feature);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const optimizerPreviewInput = tokenInput.extend({
  preview: z.object({
    id: z.string().uuid().optional(),
    image_url: z.string().url().max(600),
    title: z.string().max(80),
    description: z.string().max(280),
    sort: z.number().int().min(0).max(99),
    active: z.boolean(),
  }),
});

export const adminSaveOptimizerPreview = createServerFn({ method: "POST" })
  .validator((raw) => optimizerPreviewInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("optimizer_previews").upsert(data.preview);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminLoadOptimizer = createServerFn({ method: "POST" })
  .validator((raw) => tokenInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const [settings, features, previews] = await Promise.all([
      db.from("optimizer_settings").select("*").single(),
      db.from("optimizer_features").select("*").order("sort"),
      db.from("optimizer_previews").select("*").order("sort"),
    ]);
    return {
      settings: settings.data,
      features: features.data ?? [],
      previews: previews.data ?? [],
    };
  });


export const adminDeleteRow = createServerFn({ method: "POST" })
  .validator((raw) => deleteInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
