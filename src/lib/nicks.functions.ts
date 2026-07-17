import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { rateLimit, clientIp } from "./rate-limit.server";

const usernameSchema = z
  .string()
  .min(2)
  .max(32)
  .regex(/^[a-z0-9_.]+$/, "Apenas a-z, 0-9, _ e .");

const input = z.object({
  username: usernameSchema,
});

/**
 * Verifica se um username único do Discord está disponível.
 * Usa o endpoint público não autenticado que a própria tela de cadastro consulta.
 */
export const checkDiscordUsername = createServerFn({ method: "POST" })
  .validator((raw) => input.parse(raw))
  .handler(async ({ data }) => {
    const ip = clientIp(getRequest());
    // 120 checks / 10s por IP — o próprio Discord segura o resto.
    const rl = rateLimit(`nicks:${ip}`, 120, 10_000);
    if (!rl.ok) {
      return {
        ok: false as const,
        rateLimited: true as const,
        retryAfterMs: rl.retryAfterMs,
        error: `Rate limit local. Aguarde ${Math.ceil(rl.retryAfterMs / 1000)}s.`,
      };
    }

    try {
      const res = await fetch(
        "https://discord.com/api/v9/unique-username/username-attempt-unauthed",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            origin: "https://discord.com",
            referer: "https://discord.com/register",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          },
          body: JSON.stringify({ username: data.username }),
        },
      );

      if (res.status === 429) {
        const retry = Number(res.headers.get("retry-after") ?? "1");
        return {
          ok: false as const,
          rateLimited: true as const,
          retryAfterMs: Math.max(1000, retry * 1000),
          error: "Discord aplicou rate limit. Reduzindo velocidade.",
        };
      }

      const text = await res.text();
      let parsed: Record<string, unknown> | null = null;
      try {
        parsed = text ? (JSON.parse(text) as Record<string, unknown>) : null;
      } catch {
        parsed = null;
      }

      if (res.status !== 200 || !parsed) {
        return {
          ok: false as const,
          error: (parsed?.message as string) ?? `HTTP ${res.status}`,
        };
      }

      const taken = Boolean(parsed.taken);
      return {
        ok: true as const,
        username: data.username,
        available: !taken,
      };
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : "Falha de rede",
      };
    }
  });
