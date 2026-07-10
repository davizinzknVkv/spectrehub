import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({ token: z.string().min(10) });

export const verifyTurnstile = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
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
