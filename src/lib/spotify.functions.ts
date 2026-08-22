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
      { url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoPBqpw", id: null, stock: 999 },
      { url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsKG7Pya2", id: null, stock: 999 },
      { url: "https://open.spotify.com/album/4eLPsYPBmXAB7uSJ6xg1yk", id: null, stock: 999 },
      { url: "https://open.spotify.com/artist/0TnOYISjUGaRBMTj61lsaW", id: null, stock: 999 },
    ];

    const bases = dbLinks && dbLinks.length > 0 
      ? dbLinks.map(l => ({ id: l.id, url: l.url, stock: l.stock })) 
      : defaultBases;

    const links: string[] = [];
    const usedCounts: Record<string, number> = {};

    for (let i = 0; i < quantity; i++) {
      const entry = bases[Math.floor(Math.random() * bases.length)];
      const base = entry.url;
      
      try {
        const url = new URL(base);
        if (utmSource) url.searchParams.set("utm_source", utmSource);
        if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
        if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
        
        url.searchParams.set("s_id", Math.random().toString(36).substring(7));
        links.push(url.toString());
        
        if (entry.id) {
          usedCounts[entry.id] = (usedCounts[entry.id] || 0) + 1;
        }
      } catch (e) {
        const fullUrl = base + (base.includes("?") ? "&" : "?") + "s_id=" + Math.random().toString(36).substring(7);
        links.push(fullUrl);
        if (entry.id) {
          usedCounts[entry.id] = (usedCounts[entry.id] || 0) + 1;
        }
      }
    }

    // Debita o estoque para os links usados que vieram do banco
    const idsToUpdate = Object.keys(usedCounts);
    if (idsToUpdate.length > 0) {
      for (const id of idsToUpdate) {
        await supabaseAdmin.rpc("decrement_spotify_stock", { 
          row_id: id, 
          amount: usedCounts[id] 
        });
      }
    }

    return { ok: true, links };
  });
