import { discordProxy } from "./discord.functions";
import { useQuestStore, type Quest, type RunRecord } from "./quest-store";

export function countCompletedToday(): number {
  const runs = useQuestStore.getState().runs;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const t = start.getTime();
  return runs.filter(
    (r) => r.status === "completed" && new Date(r.started_at).getTime() >= t,
  ).length;
}

export function getGateStatus() {
  const plan = useQuestStore.getState().plan;
  const limits = PLAN_LIMITS[plan];
  const used = countCompletedToday();
  const remaining = limits.daily === Infinity ? Infinity : Math.max(0, limits.daily - used);
  const nextAt = useQuestStore.getState().lastCompletedAt + limits.cooldownMs;
  const cooldownLeft = Math.max(0, nextAt - Date.now());
  return { plan, limits, used, remaining, cooldownLeft, nextAt };
}


const TASK_TYPES: Record<string, string> = {
  WATCH_VIDEO: "🎬 Vídeo",
  WATCH_VIDEO_ON_MOBILE: "🎬 Vídeo",
  PLAY_ON_DESKTOP: "🎮 Jogar",
  PLAY_ON_XBOX: "🎮 Jogar",
  PLAY_ON_PLAYSTATION: "🎮 Jogar",
};

const TASK_PRIORITY = [
  "PLAY_ON_DESKTOP",
  "PLAY_ON_XBOX",
  "PLAY_ON_PLAYSTATION",
  "WATCH_VIDEO",
  "WATCH_VIDEO_ON_MOBILE",
];

export function jitter(base: number, range = 1500) {
  return base + Math.floor(Math.random() * range);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseReward(r: unknown): string {
  if (!r || typeof r !== "object") return "Recompensa desconhecida";
  const rw = r as { type?: number; orb_quantity?: number; messages?: { name?: string } };
  if (rw.type === 4) return `${rw.orb_quantity ?? 0} Orbs`;
  if (rw.type === 3) return rw.messages?.name ?? "Decoração de Avatar";
  if (rw.type === 1) return rw.messages?.name ?? "Item no jogo";
  return "Recompensa desconhecida";
}

function getBestTask(tasks: Record<string, { target?: number }>) {
  let best: { taskType: string; taskData: { target?: number } } | null = null;
  let bestP = 999;
  for (const [type, data] of Object.entries(tasks)) {
    if (!TASK_TYPES[type]) continue;
    const p = TASK_PRIORITY.indexOf(type);
    if (p !== -1 && p < bestP) {
      bestP = p;
      best = { taskType: type, taskData: data };
    }
  }
  return best;
}

function requireCreds() {
  const creds = useQuestStore.getState().creds;
  if (!creds?.token) throw new Error("Token não configurado");
  return creds;
}

async function call(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET", body?: unknown) {
  const creds = requireCreds();
  const res = await discordProxy({
    data: {
      token: creds.token,
      xSuperProperties: creds.xSuperProperties,
      userAgent: creds.userAgent,
      endpoint,
      method,
      body,
    },
  });
  let parsed: unknown = null;
  try {
    parsed = res.body ? JSON.parse(res.body) : null;
  } catch {
    parsed = res.body;
  }
  return { status: res.status, data: parsed };
}

export async function fetchUserInfo() {
  const res = await call("/users/@me");
  return res.status === 200 ? (res.data as Record<string, unknown>) : null;
}

export async function fetchUserInfoDetailed(): Promise<
  { ok: true; data: Record<string, unknown> } | { ok: false; status: number; message: string }
> {
  const res = await call("/users/@me");
  if (res.status === 200) return { ok: true, data: res.data as Record<string, unknown> };
  const msg =
    (res.data as { message?: string } | null)?.message ??
    (res.status === 401
      ? "Token inválido ou expirado"
      : res.status === 429
        ? "Muitas requisições — aguarde alguns segundos"
        : `Falha ao carregar perfil (HTTP ${res.status})`);
  return { ok: false, status: res.status, message: msg };
}

export async function fetchOrbs(): Promise<number | null> {
  const res = await call("/users/@me/virtual-currency/balance");
  if (res.status !== 200) return null;
  return (res.data as { balance?: number }).balance ?? 0;
}

export type Guild = { id: string; name: string; icon: string | null; owner: boolean };

export async function fetchGuilds(): Promise<Guild[]> {
  const res = await call("/users/@me/guilds");
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return (res.data as Guild[]).map((g) => ({
    id: g.id,
    name: g.name,
    icon: g.icon,
    owner: !!g.owner,
  }));
}

export async function fetchRelationshipsCount(): Promise<{ total: number; friends: number } | null> {
  const res = await call("/users/@me/relationships");
  if (res.status !== 200 || !Array.isArray(res.data)) return null;
  const list = res.data as Array<{ type: number }>;
  return {
    total: list.length,
    friends: list.filter((r) => r.type === 1).length,
  };
}

export async function fetchDMsCount(): Promise<number | null> {
  const res = await call("/users/@me/channels");
  if (res.status !== 200 || !Array.isArray(res.data)) return null;
  return (res.data as unknown[]).length;
}

export async function fetchProfile(userId: string): Promise<any> {
  const res = await call(`/users/${userId}/profile?with_mutual_guilds=false`);
  return res.status === 200 ? res.data : null;
}

export async function fetchProfileBio(userId: string): Promise<string | null> {
  const d = await fetchProfile(userId);
  if (!d) return null;
  
  // A bio pode vir em vários lugares dependendo do nível de detalhe do endpoint
  return d.user_profile?.bio || d.user?.bio || d.bio || null;
}

export type ProfileBadge = { id: string; description: string; icon: string; link?: string };

export async function fetchProfileBadges(userId: string): Promise<ProfileBadge[]> {
  const res = await call(`/users/${userId}/profile?with_mutual_guilds=false`);
  if (res.status !== 200) return [];
  const d = res.data as { badges?: ProfileBadge[] };
  return Array.isArray(d.badges) ? d.badges : [];
}

export async function fetchUserSettings(): Promise<any> {
  const res = await call("/users/@me/settings");
  return res.status === 200 ? res.data : null;
}



export async function fetchUserById(userId: string): Promise<Record<string, unknown> | null> {
  if (!/^[0-9]+$/.test(userId)) return null;
  const res = await call(`/users/${userId}`);
  return res.status === 200 ? (res.data as Record<string, unknown>) : null;
}

export async function purchaseWithOrbs(
  skuId: string,
  quantity = 1,
): Promise<{ ok: true; data: unknown; entitlements?: unknown } | { ok: false; status: number; message: string }> {
  // 1) Cria a ordem paga com Orbs (payment_gateway: 8)
  const res = await call("/billing/orders", "POST", {
    order_line_items: [{ sku_id: skuId, quantity, purchase_type: 1 }],
    billing_facet: { payment_gateway: 8 },
  });
  if (res.status < 200 || res.status >= 300) {
    const msg =
      (res.data as { message?: string } | null)?.message ??
      (res.status === 401
        ? "Token inválido ou expirado"
        : res.status === 400
          ? "Saldo insuficiente ou item indisponível"
          : res.status === 429
            ? "Muitas requisições — aguarde alguns segundos"
            : `Falha na compra (HTTP ${res.status})`);
    return { ok: false, status: res.status, message: msg };
  }

  // 2) Busca as entitlements da ordem — é este GET que efetiva a entrega
  //    do item na conta (Discord dispara a criação real ao consultar).
  const order = res.data as { id?: string; order?: { id?: string } } | null;
  const orderId = order?.id ?? order?.order?.id;
  let entitlements: unknown = null;
  if (orderId) {
    // pequeno delay pra dar tempo do Discord processar a ordem
    await sleep(1200);
    const ent = await call(`/billing/orders/${orderId}/entitlements`, "GET");
    if (ent.status >= 200 && ent.status < 300) entitlements = ent.data;
  }
  return { ok: true, data: res.data, entitlements };
}

export type DMChannel = {
  id: string;
  type: number;
  recipients?: Array<{ id: string; username: string; global_name?: string | null; avatar: string | null }>;
  name?: string | null;
  icon?: string | null;
};

export async function fetchDMChannels(): Promise<DMChannel[]> {
  const res = await call("/users/@me/channels");
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data as DMChannel[];
}

export async function leaveGuild(guildId: string): Promise<boolean> {
  const res = await call(`/users/@me/guilds/${guildId}`, "DELETE");
  return res.status >= 200 && res.status < 300;
}

export type Relationship = {
  id: string;
  type: number; // 1 = amigo, 2 = bloqueado, 3 = pendente recebido, 4 = pendente enviado
  user?: { id: string; username: string; global_name?: string | null; avatar: string | null };
};

export async function fetchRelationships(): Promise<Relationship[]> {
  const res = await call("/users/@me/relationships");
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data as Relationship[];
}

export async function removeRelationship(userId: string): Promise<boolean> {
  const res = await call(`/users/@me/relationships/${userId}`, "DELETE");
  return res.status >= 200 && res.status < 300;
}

export async function closeDMChannel(channelId: string): Promise<boolean> {
  const res = await call(`/channels/${channelId}`, "DELETE");
  return res.status >= 200 && res.status < 300;
}



// === Plan / Role gating ===
export const PLAN_GUILD_ID = "1324600310286516255";
export const FREE_ROLE_ID = "1537292153007640636";
export const BOOST_ROLE_ID = "1537292154001432627";
export const PREMIUM_ROLE_ID = "1537292155633139762";
export const LIFETIME_ROLE_ID = "1537292156622868525";
export const BETA_TESTER_ROLE_ID = "1537292158585937931";

export type Plan = "free" | "premium" | "boost" | "lifetime" | "beta";

export const PLAN_LIMITS: Record<Plan, { daily: number; cooldownMs: number; label: string }> = {
  free: { daily: 20, cooldownMs: 10 * 60 * 1000, label: "Free" },
  premium: { daily: Infinity, cooldownMs: 3 * 60 * 1000, label: "Premium" },
  boost: { daily: Infinity, cooldownMs: 60 * 1000, label: "Boost" },
  lifetime: { daily: Infinity, cooldownMs: 0, label: "Lifetime" },
  beta: { daily: Infinity, cooldownMs: 0, label: "Beta Tester" },
};

export async function fetchUserPlan(): Promise<Plan | null> {
  const creds = useQuestStore.getState().creds;
  if (!creds?.token) return "free";
  
  if (!PLAN_GUILD_ID) return "free";
  const res = await call(`/users/@me/guilds/${PLAN_GUILD_ID}/member`);
  
  // Se 404, o usuário não está no servidor
  if (res.status === 404) return "free";
  
  // Outros erros (401, 429, 5xx) retornam null para manter o estado atual ou tentar novamente
  if (res.status !== 200) return null;
  
  const roles = (res.data as { roles?: string[] }).roles ?? [];
  if (roles.includes(BETA_TESTER_ROLE_ID)) return "beta";
  if (roles.includes(LIFETIME_ROLE_ID)) return "lifetime";
  if (roles.includes(BOOST_ROLE_ID)) return "boost";
  if (roles.includes(PREMIUM_ROLE_ID)) return "premium";
  return "free";
}


export async function fetchAvailableQuests(): Promise<Quest[]> {
  const res = await call("/quests/@me");
  if (res.status !== 200) return [];
  const payload = res.data as { quests?: Array<Record<string, unknown>> };
  if (!payload.quests) return [];
  const now = new Date();
  const result: Quest[] = [];
  for (const quest of payload.quests) {
    const q = quest as {
      id: string;
      config: {
        expires_at: string;
        messages: { quest_name: string; publisher_name?: string };
        task_config_v2?: { tasks?: Record<string, { target?: number }> };
        rewards_config?: { rewards?: unknown[] };
        assets?: { hero?: string; quest_bar_hero?: string; logotype?: string };
      };
      user_status?: { completed_at?: string; enrolled_at?: string };
    };
    if (new Date(q.config.expires_at) < now) continue;
    if (q.user_status?.completed_at) continue;
    const tasks = q.config.task_config_v2?.tasks ?? {};
    const best = getBestTask(tasks);
    if (!best) continue;
    const asset = q.config.assets?.hero || q.config.assets?.quest_bar_hero || q.config.assets?.logotype;
    // Carrega direto do CDN do Discord (sem proxy) — <img> não sofre CORS
    const assetFile = asset ? asset.split("/").pop()! : undefined;
    const imageUrl = assetFile
      ? `https://cdn.discordapp.com/quests/${q.id}/${/\.(png|jpe?g|webp|gif)$/i.test(assetFile) ? assetFile : `${assetFile}.png`}?size=1024`
      : undefined;
    // 🔎 intercept: log raw assets + resolved URL to inspect Discord's payload
    console.groupCollapsed(
      `%c[quest-img] ${q.config.messages.quest_name}`,
      "color:#22d3ee;font-weight:bold",
    );
    console.log("questId:", q.id);
    console.log("assets:", q.config.assets);
    console.log("picked asset:", asset);
    console.log("resolved URL:", imageUrl);
    console.log("full config keys:", Object.keys(q.config));
    console.groupEnd();
    if (typeof window !== "undefined") {
      const w = window as unknown as { __questImgs?: Array<Record<string, unknown>> };
      w.__questImgs = w.__questImgs ?? [];
      w.__questImgs.push({
        id: q.id,
        name: q.config.messages.quest_name,
        assets: q.config.assets,
        picked: asset,
        url: imageUrl,
      });
    }
    result.push({
      questId: q.id,
      questName: q.config.messages.quest_name,
      taskType: best.taskType,
      target: best.taskData.target ?? 0,
      rewardText: parseReward(q.config.rewards_config?.rewards?.[0]),
      isEnrolled: !!q.user_status?.enrolled_at,
      imageUrl,
      publisher: q.config.messages.publisher_name,
      expiresAt: q.config.expires_at,
    });
  }
  result.sort((a, b) => {
    const aO = a.rewardText.includes("Orbs");
    const bO = b.rewardText.includes("Orbs");
    if (aO && !bO) return -1;
    if (!aO && bO) return 1;
    return a.target - b.target;
  });
  return result;
}

function logRun(quest: Quest, status: RunRecord["status"], error_message: string | null = null) {
  useQuestStore.getState().addRun({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    quest_id: quest.questId,
    quest_name: quest.questName,
    task_type: quest.taskType,
    reward_text: quest.rewardText,
    status,
    error_message,
    started_at: new Date().toISOString(),
  });
}

/** Resgata a recompensa de uma missão direto pelo site (sem abrir o Discord). */
export async function claimQuestReward(questId: string, questName = "missão"): Promise<boolean> {
  const s = useQuestStore.getState();
  // V1 e V2 do endpoint de claim do Discord, com e sem plataforma especificada
  const attempts: Array<{ path: string; body: Record<string, unknown> }> = [
    { path: `/quests/${questId}/claim`, body: {} },
    { path: `/quests/${questId}/claim-reward`, body: { platform: 0 } }, // 0 = Desktop
    { path: `/quests/${questId}/claim-reward`, body: { platform: 3, location: 18 } }, // 3 = Web
  ];

  for (const attempt of attempts) {
    try {
      const res = await call(attempt.path, "POST", attempt.body);
      
      // 200 OK ou 204 No Content indicam sucesso no resgate
      if (res.status >= 200 && res.status < 300) {
        s.log(`🎁 Recompensa resgatada: ${questName}`, "success");
        return true;
      }
      
      // Se já foi resgatado, consideramos sucesso para a UI
      const data = res.data as { message?: string; code?: number } | null;
      if (res.status === 400 && (data?.message?.includes("already") || data?.code === 40003)) {
        s.log(`ℹ️ Recompensa já estava resgatada: ${questName}`, "info");
        return true;
      }

      if (res.status === 429) {
        await sleep(jitter(3000));
        continue;
      }
    } catch (e) {
      console.error(`Erro ao tentar resgatar ${questId} via ${attempt.path}`, e);
    }
  }

  s.log(`⚠️ Falha no resgate automático: ${questName}`, "error");
  return false;
}

/** Tenta resgatar as recompensas de todas as missões concluídas/listadas. */
export async function claimAllRewards(quests: Quest[]): Promise<number> {
  const s = useQuestStore.getState();
  s.log(`🎁 Resgatando recompensas de ${quests.length} missão(ões)...`);
  let ok = 0;
  for (const q of quests) {
    if (await claimQuestReward(q.questId, q.questName)) ok++;
    await sleep(jitter(1500, 1000));
  }
  s.log(`✅ ${ok} recompensa(s) resgatada(s).`, ok > 0 ? "success" : "error");
  return ok;
}


export async function runQuest(quest: Quest): Promise<boolean> {
  const s = useQuestStore.getState();

  const gate = getGateStatus();
  if (gate.remaining <= 0) {
    s.log(`⛔ Limite diário do plano ${gate.limits.label} atingido (${gate.used}/${gate.limits.daily}).`, "error");
    return false;
  }
  if (gate.cooldownLeft > 0) {
    const secs = Math.ceil(gate.cooldownLeft / 1000);
    s.log(`⛔ Aguarde ${Math.floor(secs / 60)}m${(secs % 60).toString().padStart(2, "0")} pra próxima missão (plano ${gate.limits.label}).`, "error");
    return false;
  }

  s.setActive(quest.questId);
  s.setProgress({ current: 0, total: quest.target });
  s.log(`🚀 Iniciando: ${quest.questName} (${TASK_TYPES[quest.taskType] ?? quest.taskType})`);


  try {
    // Força a inscrição (enroll) em todas as missões para garantir que o progresso seja contado
    const enroll = await call(`/quests/${quest.questId}/enroll`, "POST", {
      location: 11,
      is_targeted: false,
      metadata_raw: null,
    });
    
    if (enroll.status === 200) {
      s.log("✅ Missão aceita com sucesso");
    } else if (enroll.status === 403) {
      s.log("ℹ️ Missão já aceita ou requer ação manual");
    } else if (enroll.status !== 200) {
      s.log(`⚠️ Alerta na inscrição (${enroll.status})`, "error");
    }

    let current = 0;
    if (quest.taskType.startsWith("WATCH_")) {
      let timestamp = 0;
      while (current < quest.target) {
        if (useQuestStore.getState().shouldStop) throw new Error("Interrompido");
        const res = await call(`/quests/${quest.questId}/video-progress`, "POST", { timestamp });
        if (res.status === 400 || res.status === 429) {
          timestamp = Math.max(0, timestamp - 10);
          await sleep(jitter(8000));
          continue;
        }
        if (res.status === 200) {
          const d = res.data as { completed_at?: string };
          if (d.completed_at) {
            current = quest.target;
            break;
          }
          current = timestamp;
          timestamp += 10;
          s.setProgress({ current, total: quest.target });
          if (current >= quest.target) break;
        }
        await sleep(jitter(2500, 2500));
      }
    } else if (quest.taskType.startsWith("PLAY_")) {
      const streamKey = `call:${quest.questId}:1`;
      let stuck = 0;
      const MAX_STUCK = 8;
      while (current < quest.target) {
        if (useQuestStore.getState().shouldStop) throw new Error("Interrompido");
        const res = await call(`/quests/${quest.questId}/heartbeat`, "POST", {
          stream_key: streamKey,
          terminal: false,
        });
        if (res.status === 429) {
          await sleep(jitter(8000));
          continue;
        }
        if (res.status === 200) {
          const d = res.data as {
            completed_at?: string;
            user_status?: { completed_at?: string };
            progress?: Record<string, { value?: number }>;
          };
          if (d.completed_at || d.user_status?.completed_at) {
            current = quest.target;
            break;
          }
          const newP = d.progress?.[quest.taskType]?.value ?? current;
          if (newP > current) {
            current = newP;
            stuck = 0;
            s.setProgress({ current, total: quest.target });
            if (current >= quest.target) {
              await call(`/quests/${quest.questId}/heartbeat`, "POST", {
                stream_key: streamKey,
                terminal: true,
              });
              break;
            }
          } else {
            stuck++;
            if (stuck >= MAX_STUCK) {
              await call(`/quests/${quest.questId}/heartbeat`, "POST", {
                stream_key: streamKey,
                terminal: true,
              });
              current = quest.target;
              break;
            }
          }
        }
        await sleep(jitter(24000, 3000));
      }
    }

    s.setProgress({ current: quest.target, total: quest.target });
    s.log(`✅ Concluída: ${quest.questName} — ${quest.rewardText}`, "success");
    await claimQuestReward(quest.questId, quest.questName);

    logRun(quest, "completed");
    s.markCompleted();
    return true;

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    s.log(`❌ Erro: ${msg}`, "error");
    logRun(quest, msg === "Interrompido" ? "skipped" : "failed", msg);
    return false;
  }
}

export async function runAll(quests: Quest[]) {
  const s = useQuestStore.getState();
  s.resetStop();
  s.setRunning(true);
  s.log(`▶️ Executando ${quests.length} missão(ões)...`);
  let done = 0;
  for (let i = 0; i < quests.length; i++) {
    if (useQuestStore.getState().shouldStop) {
      s.log("⏹ Interrompido pelo usuário", "error");
      break;
    }
    const g = getGateStatus();
    if (g.remaining <= 0) {
      s.log(`⛔ Limite diário do plano ${g.limits.label} atingido.`, "error");
      break;
    }
    if (g.cooldownLeft > 0) {
      const secs = Math.ceil(g.cooldownLeft / 1000);
      s.log(`⏳ Cooldown do plano ${g.limits.label}: ${Math.floor(secs / 60)}m${(secs % 60).toString().padStart(2, "0")}...`);
      await sleep(g.cooldownLeft);
    }
    const ok = await runQuest(quests[i]);
    if (ok) done++;
    if (i < quests.length - 1) {
      const next = PLAN_LIMITS[useQuestStore.getState().plan].cooldownMs;
      s.log(`⏳ Aguardando ${Math.floor(next / 60000)}m antes da próxima...`);
      await sleep(next);
    }
  }
  s.log(`🏁 ${done}/${quests.length} concluídas.`, "success");
  s.setActive(null);
  s.setProgress(null);
  s.setRunning(false);
}

// ============================================================
// Nicks-Gun: guild members search + nickname change
// ============================================================

export type GuildMember = {
  user: {
    id: string;
    username: string;
    global_name?: string | null;
    discriminator?: string;
    avatar?: string | null;
  };
  nick: string | null;
};

export async function searchGuildMembers(
  guildId: string,
  query = "",
  limit = 100,
): Promise<GuildMember[]> {
  const q = encodeURIComponent(query);
  const res = await call(
    `/guilds/${guildId}/members/search?query=${q}&limit=${Math.min(limit, 1000)}`,
  );
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data as GuildMember[];
}

export async function listGuildMembers(
  guildId: string,
  after = "0",
  limit = 1000,
): Promise<GuildMember[]> {
  const res = await call(
    `/guilds/${guildId}/members?limit=${limit}&after=${after}`,
  );
  if (res.status !== 200 || !Array.isArray(res.data)) return [];
  return res.data as GuildMember[];
}

export async function changeMemberNick(
  guildId: string,
  userId: string,
  nick: string,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const res = await call(`/guilds/${guildId}/members/${userId}`, "PATCH", { nick });
  if (res.status >= 200 && res.status < 300) return { ok: true };
  const msg =
    (res.data as { message?: string } | null)?.message ??
    (res.status === 403
      ? "Sem permissão para alterar este nick"
      : res.status === 401
        ? "Token inválido"
        : `Falha (HTTP ${res.status})`);
  return { ok: false, status: res.status, message: msg };
}
