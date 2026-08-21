import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useInView } from "@/components/home/hooks";
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
  const [ref] = useInView<HTMLDivElement>();
  
  /*
    # CORREÇÃO DO SCROLL E ESPAÇO VAZIO

    Analise o layout completo da aplicação e corrija o problema visual mostrado na imagem de referência.

    ## PROBLEMA

    Ao fazer scroll vertical na página, aparece um **grande espaço vazio na parte inferior da interface**, exatamente como destacado na imagem.

    Esse espaço não deveria existir.

    Quero que o conteúdo termine naturalmente no final da página, sem criar uma área vazia adicional.

    ## OBJETIVO

    Corrigir completamente o comportamento do scroll sem alterar nenhuma funcionalidade existente.

    Investigue principalmente:

    * `height: 100vh`
    * `min-height: 100vh`
    * `height: 100%`
    * `min-height`
    * `padding-bottom`
    * `margin-bottom`
    * `padding` excessivo
    * containers com altura fixa
    * `position: absolute`
    * `position: fixed`
    * `overflow`
    * `overflow-y`
    * `calc(100vh - ...)`
    * elementos com `bottom`
    * wrappers internos da aplicação
    * sidebar
    * main content
    * footer
    * containers de dashboard
    * grids e flex containers

    ## CORREÇÃO

    O layout deve seguir uma estrutura semelhante a:

    ```css
    html,
    body {
        min-height: 100%;
        margin: 0;
    }

    body {
        overflow-x: hidden;
    }

    #root,
    .app {
        min-height: 100vh;
    }

    .main-content {
        min-height: 100vh;
        height: auto;
    }
    ```

    Não aplique exatamente esse código sem antes verificar a estrutura atual do projeto.

    O objetivo é **corrigir a causa real**, não mascarar o problema.

    ## SIDEBAR

    A sidebar deve continuar ocupando toda a altura da tela, porém sem aumentar a altura total do documento.

    Ela pode utilizar:

    ```css
    position: fixed;
    height: 100vh;
    ```

    quando essa for a estrutura atual do projeto.

    O conteúdo principal deve possuir o espaçamento lateral correspondente à sidebar sem gerar altura vertical adicional.

    ## ÁREA PRINCIPAL

    A área principal deve crescer conforme o conteúdo real.

    Não criar uma altura artificial maior que o necessário.

    Evitar estruturas como:

    ```css
    height: 200vh;
    ```

    ou:

    ```css
    min-height: calc(100vh + algum-valor);
    ```

    sem necessidade real.

    ## SCROLL

    O scroll vertical deve pertencer ao container correto.

    Não permitir que:

    * `body`
    * `#root`
    * `.app`
    * `.main`
    * sidebar
    * content wrapper

    criem scrolls duplicados sem necessidade.

    Eliminar qualquer `overflow-y: scroll` ou `overflow: auto` que esteja causando espaço extra ou scroll duplicado.

    ## RESPONSIVIDADE

    Depois da correção, testar:

    * Desktop
    * Notebook
    * Tablet
    * Mobile

    Em todas as resoluções, o conteúdo deve terminar exatamente onde termina a última seção real da página.

    ## IMPORTANTE

    Não remover conteúdo para esconder o espaço.

    Não diminuir artificialmente o viewport.

    Não utilizar hacks como:

    ```css
    margin-bottom: -100px;
    ```

    ```css
    transform: translateY(...);
    ```

    ```css
    position: relative;
    bottom: ...;
    ```

    somente para esconder o problema.

    Encontrar e corrigir a origem do overflow.

    ## RESULTADO ESPERADO

    Antes:

    ```text
    [ conteúdo ]
    [ conteúdo ]
    [ conteúdo ]
    [ espaço vazio enorme ]
    ```

    Depois:

    ```text
    [ conteúdo ]
    [ conteúdo ]
    [ conteúdo ]
    [ fim da página ]
    ```

    O scroll deve terminar exatamente no final do conteúdo existente, sem a faixa/espaço vazio mostrado na imagem.

    Depois da implementação, revise todas as páginas do sistema porque o mesmo problema pode estar presente em outros layouts.
  */

  


  return (
    <div
      id="topo"
      className="relative min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/30 flex flex-col"
    >
      {/* Global Background Grid & Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main ref={ref} className="relative z-10">
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
