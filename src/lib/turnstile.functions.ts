import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { rateLimit, clientIp } from "./rate-limit.server";

const input = z.object({ token: z.string().min(10) });

export const verifyTurnstile = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
    const ip = clientIp(getRequest());
    const rl = rateLimit(`captcha:${ip}`, 20, 60_000);
    if (!rl.ok) {
      return {
        ok: false as const,
        error: `Muitas tentativas. Aguarde ${Math.ceil(rl.retryAfterMs / 1000)}s.`,
      };
    }
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return { ok: false as const, error: "Captcha não configurado" };
    const body = new URLSearchParams({ secret, response: data.token });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!json.success) {
      return { ok: false as const, error: json["error-codes"]?.join(", ") ?? "Captcha inválido" };
    }
    return { ok: true as const };
  });
