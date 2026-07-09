import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const DEFAULT_XSP =
  "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6InB0LUJSIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIwLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OTk5LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==";
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9217 Chrome/138.0.7204.251 Electron/37.6.0 Safari/537.36";

async function discordCall(
  token: string,
  xsp: string,
  ua: string,
  endpoint: string,
  method: string,
  body: unknown,
) {
  const headers: Record<string, string> = {
    authorization: token,
    "x-super-properties": xsp,
    "user-agent": ua,
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Chromium";v="138", "Not=A?Brand";v="8"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    origin: "https://discord.com",
    referer: "https://discord.com/channels/@me",
  };
  if (body !== undefined && body !== null) headers["content-type"] = "application/json";
  const res = await fetch(`https://discord.com/api/v9${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  return { status: res.status, data: parsed };
}

export const saveDiscordAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        token: z.string().min(10),
        xSuperProperties: z.string().optional(),
        userAgent: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const xsp = data.xSuperProperties?.trim() || DEFAULT_XSP;
    const ua = data.userAgent?.trim() || DEFAULT_UA;
    const me = await discordCall(data.token, xsp, ua, "/users/@me", "GET", null);
    if (me.status !== 200) {
      throw new Error(`Token inválido (status ${me.status})`);
    }
    const user = me.data as {
      id: string;
      username: string;
      global_name?: string | null;
    };
    const { encryptToken } = await import("./discord-crypto.server");
    const { ciphertext, iv } = await encryptToken(data.token);
    const { error } = await context.supabase.from("discord_accounts").upsert(
      {
        user_id: context.userId,
        token_ciphertext: ciphertext,
        token_iv: iv,
        x_super_properties: xsp,
        user_agent: ua,
        discord_user_id: user.id,
        discord_username: user.username,
        discord_global_name: user.global_name ?? null,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true, user };
  });

export const getDiscordAccountStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("discord_accounts")
      .select(
        "discord_user_id, discord_username, discord_global_name, last_orbs, last_synced_at, updated_at",
      )
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteDiscordAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("discord_accounts")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const discordProxy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        endpoint: z.string().startsWith("/"),
        method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
        body: z.unknown().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: acc, error } = await context.supabase
      .from("discord_accounts")
      .select("token_ciphertext, token_iv, x_super_properties, user_agent")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!acc) throw new Error("Conta Discord não conectada");
    const { decryptToken } = await import("./discord-crypto.server");
    const token = await decryptToken(acc.token_ciphertext, acc.token_iv);
    const result = await discordCall(
      token,
      acc.x_super_properties,
      acc.user_agent,
      data.endpoint,
      data.method,
      data.body ?? null,
    );
    // Cache orbs if this was the balance endpoint
    if (data.endpoint === "/users/@me/virtual-currency/balance" && result.status === 200) {
      const balance = (result.data as { balance?: number })?.balance;
      if (typeof balance === "number") {
        await context.supabase
          .from("discord_accounts")
          .update({ last_orbs: balance, last_synced_at: new Date().toISOString() })
          .eq("user_id", context.userId);
      }
    }
    return result;
  });

export const logQuestRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        quest_id: z.string(),
        quest_name: z.string(),
        task_type: z.string(),
        reward_text: z.string().nullable().optional(),
        status: z.enum(["completed", "failed", "skipped"]),
        error_message: z.string().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("quest_runs").insert({
      user_id: context.userId,
      quest_id: data.quest_id,
      quest_name: data.quest_name,
      task_type: data.task_type,
      reward_text: data.reward_text ?? null,
      status: data.status,
      completed_at: data.status === "completed" ? new Date().toISOString() : null,
      error_message: data.error_message ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listQuestRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("quest_runs")
      .select("*")
      .eq("user_id", context.userId)
      .order("started_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
