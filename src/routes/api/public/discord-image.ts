import { createFileRoute } from "@tanstack/react-router";

// Proxy pra imagens de missões do Discord (evita CORS/hotlink e serve fallback).
export const Route = createFileRoute("/api/public/discord-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const questId = url.searchParams.get("q");
        const asset = url.searchParams.get("a");
        const raw = url.searchParams.get("u");
        
        // Strict SSRF protection: only allow Discord CDN URLs
        const DISCORD_CDN = "https://cdn.discordapp.com/quests/";

        const candidates: string[] = [];
        if (questId && asset) {
          // Sanitize questId and asset to prevent path traversal
          const cleanQuestId = questId.replace(/[^0-9]/g, "");
          const cleanAsset = asset.replace(/[^a-zA-Z0-9_.-]/g, "").replace(/^\.+/, "");
          
          if (cleanQuestId && cleanAsset) {
            const hasExt = /\.(png|jpe?g|webp|gif)$/i.test(cleanAsset);
            const file = hasExt ? cleanAsset : `${cleanAsset}.png`;
            candidates.push(`${DISCORD_CDN}${cleanQuestId}/${file}?size=1024`);
          }
        }
        
        if (raw && raw.startsWith(DISCORD_CDN)) {
          // Verify it's a valid Discord CDN URL structure
          try {
            const rawUrl = new URL(raw);
            if (rawUrl.hostname === "cdn.discordapp.com" && rawUrl.pathname.startsWith("/quests/")) {
               candidates.push(raw);
            }
          } catch { /* ignore invalid URL */ }
        }

        for (const target of candidates) {
          try {
            const res = await fetch(target, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
                Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
                Referer: "https://discord.com/",
              },
            });
            if (!res.ok || !res.body) continue;
            const ct = res.headers.get("content-type") ?? "image/png";
            return new Response(res.body, {
              status: 200,
              headers: {
                "Content-Type": ct,
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                "Access-Control-Allow-Origin": "*",
              },
            });
          } catch {
            /* tenta próximo */
          }
        }

        // Fallback: 1x1 transparente pra não quebrar layout
        const png = Uint8Array.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
          0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
          0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00,
          0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
          0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
        ]);
        return new Response(png, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
