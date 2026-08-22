import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { PlansSection } from "@/components/home/PlansSection";
import { FreeSignup } from "@/components/home/FreeSignup";
import { CommunitySection } from "@/components/home/CommunitySection";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/home/SiteFooter";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

const TITLE = "Spectre Hub — Elite Discord Automation";
const DESCRIPTION =
  "Domine o Discord com o Spectre Hub. Automação de quests, sniper de nicks raros e ferramentas de elite em uma infraestrutura obsidian premium.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://spectrehub.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://spectrehub.lovable.app/" },
      { rel: "preload", as: "image", href: logoAsset.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1324600310286516255";
const GUILD_INVITE = "https://discord.gg/vbYK559Jnb";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const FALLBACK_MEMBERS = [
  "davizinzkn",
  "rd9m",
  "fuam",
  "felipe",
  "biell",
  "lilith",
  "neo",
  "kaz",
  "mira",
  "juno",
  "hex",
];

function Index() {
  const { t } = useTranslation();
  
  /* na parte inicial onde tem SPECTRE HUB DOMINA O MERCADO MUDA ESSE TEXTO PRA ALGO MENOR E TIRA A LOGO DO MEIO */

Antes de implementar qualquer animação, analise completamente o design atual do meu site e entenda a identidade visual.

Meu site possui uma estética:

- Dark / preto
- Neon pink
- Futurista
- Tecnológica
- Premium
- Minimalista
- Inspirada em plataformas de tecnologia/automação
- Visual agressivo e moderno
- SPECTRE HUB como identidade principal

REFERÊNCIA:
https://21st.dev/

Use o 21st.dev como fonte para encontrar componentes e animações que façam sentido para esse estilo.

IMPORTANTE:
NÃO quero simplesmente colocar animações aleatórias.

Quero que você escolha SOMENTE animações que combinem visualmente e funcionalmente com o site.

==================================================
1. HERO
==================================================

Adicionar uma animação elegante no Hero.

Priorizar:

- entrada suave do título;
- reveal das palavras;
- pequena animação no texto "DOMINA";
- efeito de iluminação/glow extremamente sutil;
- movimento muito leve no background;
- elementos geométricos com movimento lento;
- parallax discreto.

O Hero deve continuar sendo o foco principal.

NÃO exagerar nos efeitos.

==================================================
2. BACKGROUND
==================================================

Pesquisar no 21st.dev por backgrounds/shaders que combinem com:

dark futuristic
neon pink
technology
cyber
minimal
premium

Pode utilizar algo semelhante a:

- Animated Grid
- Shader Background
- Particle Background
- Background Paths
- Dotted Surface
- Animated Gradient

PORÉM:

A animação precisa ser extremamente sutil.

Não quero um background cheio de partículas ou efeitos chamativos.

O conteúdo deve continuar sendo perfeitamente legível.

==================================================
3. TÍTULOS E TEXTOS
==================================================

Adicionar animações de entrada usando componentes do 21st.dev quando fizer sentido.

Exemplo:

Título:

SPECTRE HUB
DOMINA
O MERCADO.

Pode utilizar:

- Text Reveal
- Letter Reveal
- Blur Reveal
- Scramble
- Text Shimmer

Mas usar apenas uma técnica principal.

Não misturar vários efeitos no mesmo título.

==================================================
4. BOTÕES
==================================================

Adicionar microinterações nos botões:

"Quero Usar o Spectre"
"Documentação"
"Accessar Spectre"

Usar componentes do 21st.dev como referência para:

- hover animation;
- glow;
- border animation;
- arrow movement;
- subtle scale;
- shine effect.

O botão não deve ficar pulando ou aumentando demais.

A animação deve acontecer principalmente no hover.

==================================================
5. CARDS / ESTATÍSTICAS
==================================================

Nas estatísticas:

100+
7
0.89ms
99.9%

Adicionar:

- contador animado quando entrar na viewport;
- pequeno fade-in;
- stagger animation;
- hover extremamente sutil.

O número deve aparecer de maneira elegante.

==================================================
6. SCROLL ANIMATIONS
==================================================

Pesquisar no 21st.dev by componentes de:

Scroll Animation
Scroll Reveal
Scroll Trigger
Container Scroll Animation
Animated Cards

Usar animações para revelar as seções conforme o usuário rolar.

Exemplo:

Seção entra na tela:

opacity 0 → 1
translateY 20px → 0

Duração curta e suave.

Não fazer cada elemento se mover de forma exagerada.

==================================================
7. NAVBAR
==================================================

Adicionar microinterações na navbar:

- links com hover;
- underline animado;
- botão de login com interação;
- ícones com hover;
- menu mobile animado.

A navbar deve continuar extremamente limpa.

==================================================
8. COMUNIDADE ATIVA
==================================================

Na área:

COMUNIDADE ATIVA

Adicionar uma animação sutil:

- avatar entrando suavemente;
- pequeno pulse no indicador verde;
- hover nos avatars;
- leve scale.

O indicador online pode possuir um pequeno pulse contínuo.

==================================================
9. CARDS E ELEMENTOS INTERATIVOS
==================================================

Pesquisar componentes no 21st.dev que possam melhorar:

- Cards
- Buttons
- Stats
- Navigation
- Hover effects
- Borders
- Tooltips

Usar apenas componentes que mantenham a identidade visual do SPECTRE HUB.

==================================================
10. PERFORMANCE
==================================================

MUITO IMPORTANTE:

As animações não podem deixar o site pesado.

Priorizar:

CSS
Motion
Framer Motion / Motion
SVG
Canvas somente quando realmente necessário

Evitar WebGL pesado quando não houver necessidade.

Não adicionar dezenas de bibliotecas.

Se o projeto já possuir uma biblioteca de animação, reutilizá-la.

==================================================
11. REDUCED MOTION
==================================================

Implementar suporte para:

prefers-reduced-motion

Usuários que preferirem reduzir animações devem receber uma versão mais simples da interface.

==================================================
12. REGRAS VISUAIS
==================================================

Manter:

#000000 / dark background
#FF0050 / neon pink
#FFFFFF / white
cinzas escuros

As animações devem utilizar principalmente:

- neon pink;
- branco;
- transparência;
- glow muito discreto.

NÃO adicionar:

- azul aleatório;
- verde;
- roxo;
- arco-íris;
- gradientes exagerados;
- efeitos 3D desnecessários.

==================================================
13. PESQUISA NO 21ST.DEV
==================================================

Antes de implementar, procure no 21st.dev por componentes relevantes.

Pesquise categorias como:

- Animated Hero
- Scroll Animation
- Text Reveal
- Background Paths
- Spotlight
- Glowing Effect
- Animated Button
- Animated Cards
- Number Ticker
- Animated Gradient
- Dotted Surface
- Hover Effects

Escolha os componentes que melhor combinarem com o projeto.

Não copie componentes apenas porque são populares.

A escolha deve ser baseada no DESIGN do SPECTRE HUB.

==================================================
14. IMPLEMENTAÇÃO
==================================================

Ao encontrar um componente adequado no 21st.dev:

1. Analise o código.
2. Adapte para o projeto atual.
3. Adapte as cores.
4. Adapte tamanho.
5. Adapte velocidade.
6. Adapte responsividade.
7. Preserve os componentes existentes.
8. Não substitua páginas inteiras desnecessariamente.

Não quero que o site pareça uma coleção de componentes do 21st.dev.

Quero que pareça UM ÚNICO DESIGN SYSTEM.

==================================================
15. RESULTADO FINAL
==================================================

O usuário deve perceber:

"Esse site é vivo e tecnológico."

Mas não:

"Esse site está cheio de animações."

As animações devem ser:

PREMIUM
SUTIS
RÁPIDAS
FLUIDAS
TECNOLÓGICAS
COERENTES

A prioridade é:

DESIGN > USABILIDADE > PERFORMANCE > ANIMAÇÃO.

Depois da implementação, revise TODAS as páginas e garanta que as animações tenham a mesma linguagem visual. */

  


  return (
    <div
      id="topo"
      className="relative min-h-screen bg-obsidian font-sans text-foreground antialiased selection:bg-primary/30 flex flex-col"
    >
      <AnimatedBackground />

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main className="relative z-10 flex-1">
        <Hero guildInvite={GUILD_INVITE} fallbackMembers={FALLBACK_MEMBERS} />
        
        <SocialProof widgetUrl={WIDGET_URL} products={PRODUCTS} />
        <div id="produtos">
          <ProductsSection products={PRODUCTS} />
        </div>
        <div id="como-funciona">
          <ReasonsSection reasons={REASONS} />
        </div>
        <div id="planos">
          <PlansSection plans={PLANS} />
        </div>
        <FreeSignup guildInvite={GUILD_INVITE} />
        <div id="comunidade">
          <CommunitySection 
            widgetUrl={WIDGET_URL} 
            guildId={GUILD_ID} 
            guildInvite={GUILD_INVITE} 
            fallbackMembers={FALLBACK_MEMBERS} 
          />
        </div>
        <FinalCta guildInvite={GUILD_INVITE} />
      </main>

      <SiteFooter guildInvite={GUILD_INVITE} />
    </div>
  );
}
