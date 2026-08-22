import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const chatWithDocs = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ message: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['GEMINI_API_KEY'];
    
    if (!apiKey) {
      return { error: "AI Key not configured" };
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Você é o assistente oficial de documentação do Spectre Hub, um ecossistema de automação de elite para Discord.
              
              Contexto do Spectre Hub:
              - Foco em segurança extrema, latência zero e interface Obsidian industrial.
              - Produtos: Auto Quests (missões automáticas), Nicks-Gun Sniper (captura de nicks raros), Spectre Optimizer (performance), Discord Tools e Spotify Gen.
              - Tom de voz: Profissional, tecnológico, direto e levemente futurista.
              
              Pergunta do usuário: ${data.message}` }]
          }]
        })
      });

      const result = await response.json() as any;
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua resposta no momento.";
      
      return { text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { error: "Failed to communicate with AI" };
    }
  });
