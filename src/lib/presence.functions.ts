import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { discordProxy } from "./discord.functions";

/**
 * Presence Settings for Discord accounts.
 * Note: Discord Presence (Status, Custom Status, Rich Presence) usually requires 
 * active WebSocket connection (Gateway) for real-time updates.
 * For a REST-based hub, we can trigger profile updates or session-based status if the token allows.
 * These functions simulate/proxies the Discord API calls.
 */

const presenceInput = z.object({
  token: z.string(),
  status: z.enum(["online", "idle", "dnd", "invisible"]).optional(),
  customStatus: z.object({
    text: z.string().max(128).optional(),
    emojiName: z.string().optional(),
    emojiId: z.string().optional(),
    expiresAt: z.string().optional(),
  }).optional(),
  richPresence: z.object({
    enabled: z.boolean(),
    activityType: z.number().default(0), // 0: Playing, 1: Streaming, 2: Listening, 3: Watching, 5: Competing
    name: z.string().optional(),
    details: z.string().optional(),
    state: z.string().optional(),
    applicationId: z.string().optional(),
    largeImage: z.string().optional(),
    largeText: z.string().optional(),
    smallImage: z.string().optional(),
    smallText: z.string().optional(),
    buttons: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  }).optional(),
});

export const updatePresence = createServerFn({ method: "POST" })
  .inputValidator((data) => presenceInput.parse(data))
  .handler(async ({ data }) => {
    // 1. Update Status (REST usually doesn't stick without Gateway, but we try the settings endpoint)
    if (data.status) {
      await discordProxy({
        data: {
          token: data.token,
          endpoint: "/users/@me/settings",
          method: "PATCH",
          body: { status: data.status }
        }
      });
    }

    // 2. Update Custom Status
    if (data.customStatus) {
      await discordProxy({
        data: {
          token: data.token,
          endpoint: "/users/@me/settings",
          method: "PATCH",
          body: {
            custom_status: {
              text: data.customStatus.text || null,
              emoji_name: data.customStatus.emojiName || null,
              emoji_id: data.customStatus.emojiId || null,
              expires_at: data.customStatus.expiresAt || null
            }
          }
        }
      });
    }

    // 3. Rich Presence
    // NOTE: Rich Presence (playing a game) strictly requires a Gateway (WebSocket) connection.
    // In a stateless server function environment, this is often mocked or requires a long-running worker.
    // For Spectre Hub, we'll log the intent. Real implementation would use a persistent bot/worker.
    if (data.richPresence?.enabled) {
      console.log(`[Spectre Presence] Rich Presence requested for ${data.richPresence.name}`);
    }

    return { ok: true, message: "Status atualizado." };
  });
