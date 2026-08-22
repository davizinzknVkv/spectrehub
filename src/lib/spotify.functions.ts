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
    
    // Lista de URLs legítimas do Spotify para usar como base (campanhas/playlists)
    const bases = [
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoPBqpw",
      "https://open.spotify.com/playlist/37i9dQZF1DX0XUsKG7Pya2",
      "https://open.spotify.com/album/4eLPsYPBmXAB7uSJ6xg1yk",
      "https://open.spotify.com/artist/0TnOYISjUGaRBMTj61lsaW",
    ];

    const links: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const base = bases[Math.floor(Math.random() * bases.length)];
      const url = new URL(base);
      
      if (utmSource) url.searchParams.set("utm_source", utmSource);
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
      
      // Adiciona um parâmetro aleatório para garantir unicidade visual se necessário, 
      // ou apenas para tracking individual
      url.searchParams.set("s_id", Math.random().toString(36).substring(7));
      
      links.push(url.toString());
    }

    return { ok: true, links };
  });
