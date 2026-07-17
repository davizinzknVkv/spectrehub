// Fetch shop item preview images from Discord and cache them in localStorage.
// Uses the authenticated discord proxy through quest-runner's `call`-equivalent
// by piggybacking on the already-imported functions in quest-runner.ts.

import { discordProxy } from "@/lib/discord-proxy.functions";
import { useQuestStore } from "@/lib/quest-store";

const CACHE_KEY = "nhc.shop.images.v1";
type Cache = Record<string, string | null>; // sku -> image URL (or null when unavailable)

function loadCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cache) : {};
  } catch {
    return {};
  }
}
function saveCache(c: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* ignore quota */ }
}

let memCache: Cache | null = null;
const inflight = new Map<string, Promise<string | null>>();

function creds() {
  return useQuestStore.getState().creds;
}

/** Try to extract a preview image URL from a Discord SKU / listing / bundle blob. */
function extractImageUrl(sku: string, data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  // 1) Store listing shape: { assets: [asset_id, ...], sku: { application_id } }
  const assets = d.assets as unknown[] | undefined;
  const skuInner = (d.sku ?? d) as Record<string, unknown>;
  const applicationId = skuInner.application_id as string | undefined;
  if (Array.isArray(assets) && assets.length > 0 && applicationId) {
    const first = assets[0];
    const assetId = typeof first === "string"
      ? first
      : ((first as Record<string, unknown>)?.id as string | undefined);
    if (assetId) return `https://cdn.discordapp.com/app-assets/${applicationId}/store/${assetId}.png?size=256`;
  }

  // 2) Bundle products (collectibles)
  const bundleProducts =
    (d.bundle as { products?: unknown[] } | undefined)?.products ??
    (skuInner.bundle as { products?: unknown[] } | undefined)?.products;
  if (Array.isArray(bundleProducts) && bundleProducts.length > 0) {
    for (const p of bundleProducts) {
      const url = extractImageUrl(sku, p);
      if (url) return url;
    }
  }

  // 3) Avatar decoration
  const avatarDec =
    (d.avatar_decoration_data as { asset?: string } | undefined) ??
    (skuInner.metadata as { avatar_decoration_data?: { asset?: string } } | undefined)?.avatar_decoration_data;
  if (avatarDec?.asset) {
    return `https://cdn.discordapp.com/avatar-decoration-presets/${avatarDec.asset}.png?size=160&passthrough=false`;
  }

  // 4) Profile effect
  const profileEffectId =
    ((skuInner.metadata as { profile_effect_config?: { id?: string } } | undefined)?.profile_effect_config?.id) ??
    ((d.metadata as { profile_effect_config?: { id?: string } } | undefined)?.profile_effect_config?.id);
  if (profileEffectId) {
    return `https://cdn.discordapp.com/assets/profile_effects/effects/${profileEffectId}/intro.png`;
  }

  // 5) Image hash on product
  const imageHash = d.image_hash as string | undefined;
  if (imageHash && applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/store/${imageHash}.png?size=256`;
  }

  return null;
}

async function proxyGet(endpoint: string) {
  const c = creds();
  if (!c) return { status: 0, data: null };
  const res = await discordProxy({
    data: {
      token: c.token,
      xSuperProperties: c.xSuperProperties,
      userAgent: c.userAgent,
      endpoint,
      method: "GET",
    },
  });
  let parsed: unknown = null;
  try { parsed = res.body ? JSON.parse(res.body) : null; } catch { parsed = null; }
  return { status: res.status, data: parsed };
}

/** Fetch and cache the preview image URL for a shop SKU. */
export async function getShopImage(skuId: string): Promise<string | null> {
  if (!memCache) memCache = loadCache();
  if (skuId in memCache) return memCache[skuId];
  const pending = inflight.get(skuId);
  if (pending) return pending;

  const task = (async () => {
    // Try storefront endpoints in order.
    const endpoints = [
      `/store/published-listings/skus/${skuId}`,
      `/store/skus/${skuId}`,
    ];
    for (const ep of endpoints) {
      const { status, data } = await proxyGet(ep);
      if (status !== 200) continue;
      const url = extractImageUrl(skuId, data);
      if (url) {
        memCache![skuId] = url;
        saveCache(memCache!);
        return url;
      }
    }
    memCache![skuId] = null;
    saveCache(memCache!);
    return null;
  })();

  inflight.set(skuId, task);
  try {
    return await task;
  } finally {
    inflight.delete(skuId);
  }
}

export function getCachedShopImage(skuId: string): string | null | undefined {
  if (!memCache) memCache = loadCache();
  return memCache[skuId];
}
