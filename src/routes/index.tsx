# REFazer DOCUMENTAÇÃO — SITE PÚBLICO E INDEPENDENTE

Quero refazer completamente a área de **Documentação**.

A documentação criada atualmente está errada porque foi colocada **dentro do Hub**, utilizando a sidebar, navegação e estrutura do painel interno.

## 🚨 MUDANÇA PRINCIPAL

A documentação deve ser uma **página pública e independente do Spectre Hub**.

Ela NÃO deve parecer uma página do dashboard.

Não reutilizar:

* Sidebar do Hub.
* Menu de ferramentas.
* Área administrativa.
* Menu de usuário.
* Status internos.
* Dados do sistema.
* Cards de ferramentas.
* Área de conta.
* Histórico.
* Configurações internas.

A documentação precisa parecer um **site oficial de documentação do Spectre Hub**.

---

# 🌐 ESTRUTURA

Criar uma área separada para documentação, com uma rota própria, por exemplo:

```text
/docs
```

ou uma estrutura equivalente já existente no projeto.

A documentação deve funcionar independentemente do painel.

O usuário não precisa estar logado para acessar.

---

# 🎨 VISUAL

Manter a identidade visual do Spectre Hub:

* Dark premium.
* Preto/cinza extremamente escuro.
* Neon pink como cor principal.
* Branco para títulos.
* Cinza para textos secundários.
* Bordas discretas.
* Tipografia moderna.
* Layout minimalista.
* Aparência tecnológica.
* Excelente espaçamento.
* Responsividade completa.

Por porém, NÃO copiar visualmente a sidebar do Hub.

A experiência deve parecer um verdadeiro **documentation website**.

---

# 🧭 HEADER

Criar um header próprio para a documentação.

Estrutura:

```text
[ LOGO SPECTRE ]     DOCUMENTAÇÃO   PRODUTOS   GUIA   SUPORTE        [ ACESSAR SPECTRE ]
```

O header deve ser independente do painel.

No mobile, utilizar menu responsivo.

---

# 📚 CONTEÚDO

A documentação deve conter **somente informações relacionadas ao próprio site e aos produtos/serviços apresentados publicamente no site**.

Não inventar funcionalidades.

Não inventar APIs.

Não inventar comandos.

Não inventar sistemas.

Não inventar informações técnicas que não existam no projeto.

Use somente informações que realmente existam no site/projeto.

---

# 📄 PÁGINA INICIAL

Criar uma apresentação:

## Bem-vindo ao Spectre Hub

Pequena descrição explicando o que é o Spectre Hub, sua proposta e finalidade.

Depois apresentar de forma organizada as informações públicas disponíveis.

Exemplo de estrutura:

```text
DOCUMENTAÇÃO

Bem-vindo ao Spectre Hub

Conheça nossa plataforma, nossos produtos e
como utilizar os recursos disponíveis.

[ Começar ]

[ Conhecer produtos ]
```

---

# 🧩 PRODUTOS

Criar uma seção apresentando somente os produtos que realmente existem no site.

Cada produto pode possuir:

* Nome.
* Descrição.
* Objetivo.
* Principais características.
* Link para acessar.
* Status, somente se essa informação realmente existir.

Não mostrar informações privadas.

---

# 🚀 GUIA

Criar um guia público explicando:

* Como acessar o Spectre Hub.
* Como navegar pelo site.
* Como conhecer os produtos.
* Como utilizar as funcionalidades públicas.
* Onde encontrar suporte.

Não exibir informações internas do backend.

---

# 📖 TERMOS E INFORMAÇÕES

Adicionar páginas/seções independentes para informações públicas como:

* Termos de Uso.
* Política de Privacidade, caso exista.
* Suporte.
* Perguntas frequentes.
* Informações sobre a plataforma.

Não inventar textos jurídicos como se fossem documentos oficiais se eles não existirem no projeto.

---

# ❌ NÃO MOSTRAR

A documentação NÃO deve exibir:

```text
API Keys
.env
Tokens
Secrets
Banco de dados
Endpoints privados
Informações administrativas
Dados de usuários
Logs internos
Credenciais
Configurações internas
Rotas administrativas
Informações de infraestrutura privada
```

Também não deve mostrar informações técnicas internas apenas porque estão disponíveis no código.

---

# 🔗 NAVEGAÇÃO

Criar uma navegação própria para a documentação:

```text
Introdução
Produtos
Como começar
Guias
FAQ
Termos de Uso
Suporte
```

A navegação deve permanecer fixa ou sticky de maneira discreta no desktop.

No mobile, transformar em menu/drawer.

---

# 🖥️ LAYOUT

Desktop:

```text
┌──────────────────────────────────────────────┐
│ LOGO     DOCUMENTAÇÃO   PRODUTOS   SUPORTE  │
├──────────────────────────────────────────────┤
│                                              │
│ SIDEBAR DOCS        CONTEÚDO PRINCIPAL      │
│                                              │
│ Introdução          Bem-vindo ao Spectre    │
│ Produtos            ...                     │
│ Guias                                       │
│ FAQ                                         │
│ Termos                                      │
│                                              │
└──────────────────────────────────────────────┘
```

Essa sidebar é uma **sidebar exclusiva da documentação**, não a sidebar do Hub.

---

# ✨ EXPERIÊNCIA

Adicionar pequenas animações:

* Fade-in.
* Scroll reveal.
* Hover nos links.
* Highlight da seção atual.
* Transições suaves.

Não exagerar nas animações.

A documentação deve priorizar leitura e clareza.

---

# 🔍 PESQUISA

Adicionar campo de busca para encontrar informações dentro da documentação.

A busca deve pesquisar somente o conteúdo público da documentação.

---

# 📱 RESPONSIVIDADE

Garantir funcionamento perfeito em:

* Desktop.
* Notebook.
* Tablet.
* Celular.

No mobile:

* Header compacto.
* Sidebar transformada em menu.
* Conteúdo ocupa toda a largura.
* Tipografia adaptada.
* Sem scroll horizontal.

---

# 🔐 SEGURANÇA

A documentação pública nunca deve expor informações sensíveis do projeto.

Não renderizar variáveis de ambiente, arquivos internos ou configurações privadas automaticamente.

Mesmo que essas informações existam no código-fonte, elas não fazem parte da documentação.

---

# 🎯 RESULTADO FINAL

Quero que `/docs` pareça um **site oficial de documentação do Spectre Hub**, separado visual e estruturalmente do dashboard.

A sensação deve ser:

**SPECTRE HUB → SITE OFICIAL → DOCUMENTAÇÃO**

e não:

**SPECTRE HUB → DASHBOARD → DOCUMENTAÇÃO**

Use somente informações reais disponíveis no site/projeto.

Não invente conteúdo.

Não reutilize a sidebar administrativa.

Não coloque ferramentas internas dentro da documentação.

Não misture dados do painel com documentação pública.

Faça a documentação parecer um produto oficial independente, mantendo a mesma identidade visual do Spectre Hub.

import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

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
  const [liveMembers, setLiveMembers] = useState<{ id: string; name: string; avatar: string | null }[]>([]);
  
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(WIDGET_URL, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (j?.members && Array.isArray(j.members)) {
          setLiveMembers(j.members.map((m: any) => ({
            id: m.id,
            name: m.username,
            avatar: m.avatar_url
          })));
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  
  /* REDESIGN DA DOCUMENTAÇÃO — SITE PÚBLICO E INDEPENDENTE */

  return (
    <div
      id="topo"
      className="relative min-h-screen bg-obsidian font-sans text-foreground antialiased selection:bg-primary/30 flex flex-col"
    >
      <AnimatedBackground />

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main className="relative z-10 flex-1">
        <Hero 
          guildInvite={GUILD_INVITE} 
          fallbackMembers={FALLBACK_MEMBERS} 
          liveMembers={liveMembers}
        />
        
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