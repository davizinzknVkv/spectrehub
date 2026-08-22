import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Única conta autorizada a administrar o Spectre Hub. */
const ADMIN_DISCORD_ID = "1217795750407442473";

/**
 * Valida o token Discord informado e garante que ele pertence ao dono do site.
 * A checagem acontece sempre no servidor — o cliente nunca decide se é admin.
 */
async function assertAdmin(token: string) {
  // Input validation for token format
  if (!/^[a-zA-Z0-9._-]{50,100}$/.test(token)) {
    throw new Error("Formato de token inválido.");
  }

  const res = await fetch("https://discord.com/api/v9/users/@me", {
    headers: { 
      authorization: token,
      "User-Agent": "SpectreHub-Security-Scanner/1.0"
    },
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
    } catch (err) {
      const { logSecurityEvent } = await import("./security.server");
      logSecurityEvent("failed_admin_auth_attempt", { 
        error: err instanceof Error ? err.message : "Unknown error" 
      });
      return { ok: false as const };
    }
  });

export const adminLoadAll = createServerFn({ method: "POST" })
  .validator((raw) => tokenInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const [plans, previews, features, spotifyLinks] = await Promise.all([
      db.from("site_plans").select("*").order("sort"),
      db.from("site_previews").select("*").order("sort"),
      db.from("site_features").select("*").order("sort"),
      db.from("spotify_links").select("*").order("stock", { ascending: false }).order("created_at", { ascending: false }),
    ]);
    return {
      plans: plans.data ?? [],
      previews: previews.data ?? [],
      features: features.data ?? [],
      spotifyLinks: spotifyLinks.data ?? [],
    };
  });

/* ── Spotify Links ─────────────────────────────────────── */
const spotifyLinkInput = tokenInput.extend({
  link: z.object({
    id: z.string().uuid().optional(),
    url: z.string().url().max(600),
    label: z.string().max(100).optional(),
    stock: z.number().int().min(0).default(100),
    active: z.boolean().default(true),
  }),
});

export const adminSaveSpotifyLink = createServerFn({ method: "POST" })
  .validator((raw) => spotifyLinkInput.parse(raw))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const db = await admin();
    const { error } = await db.from("spotify_links").upsert(data.link);
    if (error) throw new Error(error.message);
    return { ok: true as const };
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
  table: z.enum(["site_plans", "site_previews", "site_features", "spotify_links"]),
  id: z.string().uuid(),
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
