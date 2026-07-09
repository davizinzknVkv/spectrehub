import { createServerFn } from "@tanstack/react-start";
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
  const body_text = await res.text();
  return { status: res.status, body: body_text };
}

const proxyInput = z.object({
  token: z.string().min(10),
  xSuperProperties: z.string().optional(),
  userAgent: z.string().optional(),
  endpoint: z.string().startsWith("/"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
  body: z.unknown().optional(),
});

export const discordProxy = createServerFn({ method: "POST" })
  .inputValidator((input) => proxyInput.parse(input))
  .handler(async ({ data }) => {
    const xsp = data.xSuperProperties?.trim() || DEFAULT_XSP;
    const ua = data.userAgent?.trim() || DEFAULT_UA;
    return await discordCall(data.token, xsp, ua, data.endpoint, data.method, data.body ?? null);
  });
