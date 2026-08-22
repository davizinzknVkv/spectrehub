import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const spotifyGenInput = z.object({
  quantity: z.number().min(1).max(100),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export const generateSpotifyLinks = createServerFn({ method: "POST" })
  .inputValidator((data) => spotifyGenInput.parse(data))
  .handler(async ({ data }) => {
    const { quantity, utmSource, utmMedium, utmCampaign } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Busca links ativos e com estoque do banco
    const { data: dbLinks } = await supabaseAdmin
      .from("spotify_links")
      .select("id, url, stock")
      .eq("active", true)
      .gt("stock", 0);

    const defaultBases = [
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoPBqpw",
      "https://open.spotify.com/playlist/37i9dQZF1DX0XUsKG7Pya2",
      "https://open.spotify.com/album/4eLPsYPBmXAB7uSJ6xg1yk",
      "https://open.spotify.com/artist/0TnOYISjUGaRBMTj61lsaW",
    ];

    const bases = dbLinks && dbLinks.length > 0 ? dbLinks.map(l => l.url) : defaultBases;

    const links: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const base = bases[Math.floor(Math.random() * bases.length)];
      try {
        const url = new URL(base);
        
        if (utmSource) url.searchParams.set("utm_source", utmSource);
        if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
        if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
        
        url.searchParams.set("s_id", Math.random().toString(36).substring(7));
        links.push(url.toString());
      } catch (e) {
        // Fallback for malformed URLs in DB
        links.push(base + "?s_id=" + Math.random().toString(36).substring(7));
      }
    }

    // Debita o estoque para os links usados que vieram do banco
    if (usedIds.size > 0) {
      for (const id of usedIds) {
        // Reduzimos 1 por link gerado (simplificado: cada link gerado consome 1 do estoque daquela base)
        // Como o loop pode pegar a mesma base várias vezes, contamos as ocorrências
        const count = links.filter(l => l.includes(bases.find(b => b.id === id)?.url || "---")).length;
        if (count > 0) {
          await supabaseAdmin.rpc("decrement_spotify_stock", { row_id: id, amount: count });
        }
      }
    }

    return { ok: true, links };
  });
