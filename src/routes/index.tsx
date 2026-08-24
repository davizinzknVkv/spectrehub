# INTEGRAR O PRISMA HERO NO SPECTRE HUB

Quero utilizar o componente **Prisma Hero** fornecido abaixo como referência estrutural e de animação para refazer o **Hero principal da homepage do Spectre Hub**.

O objetivo é aproveitar a qualidade visual, animações e composição do Prisma Hero, mas **adaptar completamente o componente para a identidade do Spectre Hub**.

## REFERÊNCIA DO COMPONENTE

Use como base:

* `framer-motion`
* `lucide-react`
* animação `WordsPullUp`
* entrada progressiva dos elementos
* composição em grid
* background em tela cheia
* navegação sobreposta
* CTA animado

O componente original utiliza:

```text
PrismaHero
WordsPullUp
WordsPullUpMultiStyle
framer-motion
lucide-react
```

Não copiar textos, identidade, logo ou conteúdo do Prisma.

---

# 🎯 OBJETIVO DO NOVO HERO

Criar um Hero para o:

**SPECTRE HUB**

com a mensagem principal:

**SPECTRE HUB**
**DOMINA**
**O MERCADO.**

Manter essa identidade como elemento central.

A composição deve transmitir:

**tecnologia + automação + performance + exclusividade + produto premium**

---

# 🎨 IDENTIDADE VISUAL

Adaptar tudo para o Spectre Hub:

```text
Background: #0A0A0D
Surface: #101114
Pink: #FF0050
White: #FFFFFF
Muted: #9AA0AA
Border: #242424
```

Usar neon pink somente como destaque.

Não utilizar as cores bege/verde do Prisma.

Não copiar o design visual do Prisma literalmente.

Apenas utilizar sua estrutura e linguagem de animação como inspiração.

---

# 🖥️ HERO

Criar uma seção Hero premium ocupando aproximadamente a altura da viewport, mas sem criar espaço extra no final da página.

Estrutura visual:

```text
              [ ALTA TECNOLOGIA ]

          SPECTRE      [LOGO]      HUB
                  DOMINA
              O MERCADO.

       O hub definitivo para automação
       de elite no Discord.

        [ Quero Usar o Spectre ]
        [ Documentação ]
```

A composição deve ser compacta e equilibrada.

Não deixar o Hero exageradamente alto.

---

# ✨ ANIMAÇÃO DO TÍTULO

Utilizar o `WordsPullUp` do componente de referência.

Adaptar para:

```text
SPECTRE
DOMINA
O MERCADO.
```

Cada palavra deve aparecer suavemente:

```text
opacity: 0 → 1
y: 20px → 0
```

com stagger pequeno entre as palavras.

Usar:

```text
duration: ~0.6s
ease: [0.16, 1, 0.3, 1]
```

A animação precisa ser elegante.

Não fazer o texto pular.

---

# 💗 PALAVRA "DOMINA"

A palavra:

**DOMINA**

deve utilizar o Neon Pink como destaque.

As demais palavras permanecem claras.

Criar uma hierarquia semelhante:

```text
SPECTRE HUB
DOMINA
O MERCADO.
```

Não colocar glow exagerado.

---

# 🖼️ LOGO

Utilizar **o logo real do Spectre Hub existente no projeto**.

Não gerar uma logo nova.

O logo pode aparecer entre "SPECTRE" e "HUB", seguindo a composição atual.

Garantir que o asset seja carregado corretamente.

Nunca mostrar imagem quebrada.

---

# 🎥 BACKGROUND

O Prisma Hero utiliza vídeo.

No Spectre Hub, primeiro verificar se o projeto já possui um background/asset apropriado.

Se existir:

* reutilizar o asset existente;
* otimizar;
* aplicar overlay escuro;
* preservar performance.

Se não existir um vídeo adequado, NÃO adicionar um vídeo aleatório.

Nesse caso utilizar:

* grid animado;
* partículas extremamente sutis;
* linhas geométricas;
* spotlight;
* noise;
* glow pink discreto.

A animação do background deve ser quase imperceptível.

---

# 🧩 ELEMENTOS GEOMÉTRICOS

Utilizar elementos gráficos inspirados na homepage atual:

* linhas;
* formas angulares;
* grids;
* pequenos detalhes pink.

Eles devem possuir movimento lento e discreto.

Não exagerar.

---

# 📝 DESCRIÇÃO

Utilizar o texto real já existente no site:

**"O hub definitivo para automação de elite no Discord. Performance absoluta, infraestrutura inabalável e a experiência de usuário mais sofisticada do mercado."**

Não substituir por texto genérico.

A descrição também deve aparecer com `framer-motion` após o título.

---

# 🔘 BOTÕES

Utilizar os botões existentes:

### Primary

**Quero Usar o Spectre**

### Secondary

**Documentação**

Usar animações de entrada semelhantes ao Prisma Hero.

No hover:

* pequeno deslocamento;
* leve alteração de brilho;
* seta podendo se mover;
* transição rápida.

Não aumentar exageradamente o tamanho do botão.

Os botões precisam ser compactos.

---

# 🧭 NAVBAR

Não substituir a navbar atual por uma navbar do Prisma.

Manter a navbar atual do Spectre Hub.

Apenas melhorar suas microinterações usando:

```text
framer-motion
```

Adicionar:

* hover suave;
* underline ou highlight;
* entrada discreta;
* botão "Acessar Spectre" animado.

Não alterar as rotas existentes.

---

# 👥 COMUNIDADE

Manter a área:

**COMUNIDADE ATIVA**

na parte inferior do Hero.

Utilizar os avatars reais disponíveis no projeto.

Corrigir qualquer imagem quebrada.

Adicionar somente:

* entrada suave;
* pequeno pulse no indicador verde;
* hover nos avatars.

---

# 📊 PARTE INFERIOR DO HERO

Manter a informação existente:

```text
SPECTRE HUB // AGO-2026
```

e a seção de comunidade.

Logo abaixo deve começar naturalmente a seção de estatísticas.

Não criar espaço vazio entre o Hero e a próxima seção.

---

# 📱 RESPONSIVIDADE

Adaptar o Prisma Hero para:

* Desktop
* Notebook
* Tablet
* Mobile

No mobile:

* reduzir escala do título;
* manter boa leitura;
* reorganizar SPECTRE / LOGO / HUB;
* empilhar botões;
* simplificar efeitos 3D;
* reduzir elementos decorativos.

---

# ⚡ PERFORMANCE

Usar `framer-motion` somente onde realmente necessário.

Evitar:

* dezenas de animações simultâneas;
* WebGL pesado;
* vídeos grandes sem necessidade;
* loops excessivos;
* re-renderizações desnecessárias.

Implementar também:

```text
prefers-reduced-motion
```

para usuários que preferirem menos animações.

---

# 🚫 NÃO FAZER

Não copiar:

* nome Prisma;
* textos Prisma;
* cores Prisma;
* logo Prisma;
* navegação Prisma;
* assets Prisma;
* identidade visual Prisma.

Não utilizar o vídeo original do Prisma como background definitivo.

Não substituir funcionalidades atuais.

Não alterar rotas.

Não criar uma homepage completamente diferente.

O objetivo é **aproveitar a estrutura e a qualidade das animações do Prisma Hero**, adaptando tudo ao Spectre Hub.

---

# 🔧 IMPLEMENTAÇÃO

Primeiro verificar se o projeto possui:

```text
/components/ui
```

Se não existir, criar essa estrutura conforme o padrão do projeto.

Instalar somente se necessário:

```bash
npm install framer-motion lucide-react
```

Criar o componente em:

```text
/components/ui/spectre-hero.tsx
```

e integrar na homepage atual.

Se o projeto já utiliza `framer-motion` ou `lucide-react`, reutilizar as dependências existentes.

Não duplicar bibliotecas.

---

# ✅ RESULTADO FINAL

Quero um Hero que tenha a qualidade de animação do **Prisma Hero**, mas que pareça ter sido criado exclusivamente para o **Spectre Hub**.

A sensação final deve ser:

**SPECTRE HUB + ANIMAÇÕES PREMIUM + DESIGN AUTORAL + PERFORMANCE**

e não:

**PRISMA HERO COPIADO.**

Antes de finalizar, testar o Hero em diferentes resoluções e verificar principalmente:

* animação do título;
* logo;
* botões;
* comunidade;
* background;
* responsividade;
* performance;
* ausência de espaço extra no final do Hero.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { PlansSection } from "@/components/home/PlansSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { LenticularCarousel } from "@/components/ui/LenticularCarousel";
import { FreeSignup } from "@/components/home/FreeSignup";
import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";

const DISCORD_INVITE = "https://discord.gg/vbYK559Jnb";
const GUILD_ID = "1511467436543709184"; // Updated from history
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPECTRE — A Elite do Discord" },
      { name: "description", content: "O ecossistema mais avançado para automação e gestão de Discord." },
      { property: "og:title", content: "SPECTRE — A Elite do Discord" },
      { property: "og:description", content: "O ecossistema mais avançado para automação e gestão de Discord." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    // Add smooth scroll for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-primary/30 selection:text-white">
      <SiteHeader guildInvite={DISCORD_INVITE} />
      
      <main className="relative">
        <Hero 
          guildInvite={DISCORD_INVITE}
          fallbackMembers={["Spectre", "Elite", "User", "Member"]}
        />
        
        <ReasonsSection reasons={REASONS} />
        
        <div id="produtos" className="py-32 overflow-hidden bg-background relative border-y border-white/5">
          <div className="mx-auto px-6 md:px-12 mb-16">
            <div className="max-w-xl">
              <div className="font-display text-[9px] tracking-[0.5em] text-white/20 uppercase mb-6 flex items-center gap-4">
                 <div className="w-12 h-px bg-white/5" />
                 MÓDULOS IMPLANTADOS
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase leading-tight tracking-tighter">
                Explore a <br/><span className="text-primary italic">Infraestrutura.</span>
              </h2>
            </div>
          </div>
          <LenticularCarousel items={PRODUCTS} />
        </div>

        <div id="como-funciona" className="relative">
          <FreeSignup guildInvite={DISCORD_INVITE} />
        </div>

        <CommunitySection 
          widgetUrl={WIDGET_URL}
          guildId={GUILD_ID}
          guildInvite={DISCORD_INVITE}
          fallbackMembers={["Spectre", "Elite", "Admin", "Mod"]}
        />
        
        <div className="relative border-y border-border/5">
           <PlansSection plans={PLANS} />
        </div>

        <FinalCta guildInvite={DISCORD_INVITE} />
      </main>

      <SiteFooter guildInvite={DISCORD_INVITE} />
    </div>
  );
}
