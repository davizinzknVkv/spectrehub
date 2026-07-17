import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { rateLimit, clientIp } from "./rate-limit.server";

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
  const body_text = await res.text();
  return { status: res.status, body: body_text };
}

const proxyInput = z.object({
  token: z.string().min(10),
  xSuperProperties: z.string().optional(),
  userAgent: z.string().optional(),
  endpoint: z.string().startsWith("/"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).default("GET"),
  body: z.unknown().optional(),
});

export const discordProxy = createServerFn({ method: "POST" })
  .inputValidator((input) => proxyInput.parse(input))
  .handler(async ({ data }) => {
    const ip = clientIp(getRequest());
    const rl = rateLimit(`proxy:${ip}`, 600, 60_000);
    if (!rl.ok) {
      return {
        status: 429,
        body: JSON.stringify({
          message: `Muitas requisições. Aguarde ${Math.ceil(rl.retryAfterMs / 1000)}s.`,
        }),
      };
    }
    const xsp = data.xSuperProperties?.trim() || DEFAULT_XSP;
    const ua = data.userAgent?.trim() || DEFAULT_UA;
    return await discordCall(data.token, xsp, ua, data.endpoint, data.method, data.body ?? null);
  });

const loginInput = z.object({
  login: z.string().min(3).optional(),
  password: z.string().min(1).optional(),
  mfaCode: z.string().optional(),
  ticket: z.string().optional(),
  mfaMethod: z.enum(["totp", "backup", "sms"]).optional(),
  captchaKey: z.string().optional(),
  captchaRqtoken: z.string().optional(),
});


async function discordAuthCall(endpoint: string, body: unknown) {
  const res = await fetch(`https://discord.com/api/v9${endpoint}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-super-properties": DEFAULT_XSP,
      "user-agent": DEFAULT_UA,
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      origin: "https://discord.com",
      referer: "https://discord.com/login",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = text ? (JSON.parse(text) as Record<string, unknown>) : null;
  } catch {
    parsed = null;
  }
  return { status: res.status, data: parsed };
}

type MfaMethod = { type: string };

function extractMfa(d: Record<string, unknown> | null): { ticket: string; methods: string[] } | null {
  if (!d) return null;
  // New shape: { mfa: { ticket, methods: [{ type: "totp" | "backup" | "sms" | "webauthn" }] } }
  const mfaObj = d.mfa;
  if (mfaObj && typeof mfaObj === "object") {
    const m = mfaObj as { ticket?: string; methods?: MfaMethod[] };
    if (m.ticket) {
      const methods = Array.isArray(m.methods) ? m.methods.map((x) => x.type).filter(Boolean) : [];
      return { ticket: m.ticket, methods };
    }
  }
  // Legacy shape: { mfa: true, ticket: "...", sms: bool, totp: bool }
  if (d.mfa === true && typeof d.ticket === "string") {
    const methods: string[] = [];
    if (d.totp) methods.push("totp");
    if (d.sms) methods.push("sms");
    if (d.backup) methods.push("backup");
    if (d.webauthn) methods.push("webauthn");
    return { ticket: d.ticket, methods: methods.length ? methods : ["totp", "backup"] };
  }
  return null;
}

export const discordLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => loginInput.parse(input))
  .handler(async ({ data }) => {
    const ip = clientIp(getRequest());
    const rl = rateLimit(`login:${ip}`, 5, 60_000);
    if (!rl.ok) {
      return {
        ok: false as const,
        error: `Muitas tentativas de login. Aguarde ${Math.ceil(rl.retryAfterMs / 1000)}s.`,
      };
    }

    // MFA verification step
    if (data.mfaCode && data.ticket) {
      const method = data.mfaMethod ?? (data.mfaCode.length === 8 ? "backup" : "totp");
      const endpoint =
        method === "backup"
          ? "/auth/mfa/backup"
          : method === "sms"
            ? "/auth/mfa/sms"
            : "/auth/mfa/totp";
      const res = await discordAuthCall(endpoint, {
        code: data.mfaCode,
        ticket: data.ticket,
        login_source: null,
        gift_code_sku_id: null,
      });
      if (res.status === 200 && res.data?.token) {
        return { ok: true as const, token: res.data.token as string };
      }
      return {
        ok: false as const,
        error:
          (res.data?.message as string) ??
          (res.status === 400
            ? "Código inválido — verifique o autenticador ou tente um backup code (8 dígitos)."
            : `Falha MFA (HTTP ${res.status})`),
      };
    }

    if (!data.login || !data.password) {
      return { ok: false as const, error: "Informe login e senha." };
    }

    const res = await discordAuthCall("/auth/login", {
      login: data.login,
      password: data.password,
      undelete: false,
      captcha_key: null,
      login_source: null,
      gift_code_sku_id: null,
    });

    if (res.status === 200 && res.data?.token) {
      return { ok: true as const, token: res.data.token as string };
    }
    const mfa = extractMfa(res.data);
    if (mfa) {
      return {
        ok: false as const,
        mfa: true as const,
        ticket: mfa.ticket,
        methods: mfa.methods,
      };
    }
    if (res.data?.captcha_key) {
      return {
        ok: false as const,
        captcha: true as const,
        error:
          "O Discord pediu captcha para este login. Use o método por token (F12 → Network → authorization) enquanto isso.",
      };
    }
    return {
      ok: false as const,
      error: (res.data?.message as string) ?? `Falha no login (HTTP ${res.status})`,
    };
  });
