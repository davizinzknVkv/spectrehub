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

async function call(endpoint: string, method: "GET" | "POST" = "GET", body?: unknown) {
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

// === Plan / Role gating ===
export const PLAN_GUILD_ID = ""; // TODO: preencher com o ID do servidor Neighborshub
export const PREMIUM_ROLE_ID = "1511469574422401275";
export const BOOST_ROLE_ID = "1511469585704947943";

export type Plan = "free" | "premium" | "boost";

export const PLAN_LIMITS: Record<Plan, { daily: number; cooldownMs: number; label: string }> = {
  free: { daily: 3, cooldownMs: 10 * 60 * 1000, label: "Free" },
  premium: { daily: Infinity, cooldownMs: 3 * 60 * 1000, label: "Premium" },
  boost: { daily: Infinity, cooldownMs: 60 * 1000, label: "Boost" },
};

export async function fetchUserPlan(): Promise<Plan> {
  if (!PLAN_GUILD_ID) return "free";
  const res = await call(`/users/@me/guilds/${PLAN_GUILD_ID}/member`);
  if (res.status !== 200) return "free";
  const roles = (res.data as { roles?: string[] }).roles ?? [];
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
    const imageUrl = asset
      ? asset.startsWith("http")
        ? asset
        : `https://cdn.discordapp.com/quests/${q.id}/${asset}`
      : undefined;
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

export async function runQuest(quest: Quest): Promise<boolean> {
  const s = useQuestStore.getState();
  s.setActive(quest.questId);
  s.setProgress({ current: 0, total: quest.target });
  s.log(`🚀 Iniciando: ${quest.questName} (${TASK_TYPES[quest.taskType] ?? quest.taskType})`);

  try {
    if (!quest.isEnrolled) {
      const enroll = await call(`/quests/${quest.questId}/enroll`, "POST", {
        location: 11,
        is_targeted: false,
        metadata_raw: null,
      });
      if (enroll.status !== 200) {
        s.log(`❌ Falha ao se inscrever (${enroll.status})`, "error");
        logRun(quest, "failed", `enroll ${enroll.status}`);
        return false;
      }
      s.log("✅ Inscrito na missão");
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
    logRun(quest, "completed");
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
    const ok = await runQuest(quests[i]);
    if (ok) done++;
    if (i < quests.length - 1) {
      s.log("⏳ Aguardando antes da próxima...");
      await sleep(jitter(10000, 3000));
    }
  }
  s.log(`🏁 ${done}/${quests.length} concluídas.`, "success");
  s.setActive(null);
  s.setProgress(null);
  s.setRunning(false);
}
