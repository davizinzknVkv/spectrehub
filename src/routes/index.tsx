/* 
# CORREÇÃO GERAL DO DESIGN — SPECTRE HUB

O design atual ficou visualmente inconsistente após a última atualização.

Analise TODAS as páginas e corrija os problemas abaixo.

Não quero um novo redesign do zero.

Quero **refinar o design atual**, mantendo a ideia visual premium/futurista, mas eliminando os problemas de proporção, legibilidade, consistência e excesso de efeitos.

---

# 🚨 PROBLEMAS VISUAIS ATUAIS

As screenshots mostram vários problemas que precisam ser corrigidos:

* Títulos gigantes demais.
* Textos se sobrepondo.
* Elementos cortados.
* Seções com muito espaço vazio.
* Cards e blocos desalinhados.
* Contraste extremamente baixo em alguns textos.
* Uso de azul/ciano/verde onde deveria existir a identidade principal do Spectre.
* Muitos textos com `_`.
* Inglês aparecendo desnecessariamente.
* Botões com formatos diferentes sem motivo.
* Elementos decorativos competindo com o conteúdo.
* Alguns componentes parecem ter sido colocados sem relação com a página.
* Imagens/avatares aparecem quebrados ou quase invisíveis.
* Alguns títulos ultrapassam o container.
* Responsividade aparentemente quebrada.
* Hierarquia visual exagerada.
* Alguns elementos ficam muito próximos ou sobrepostos.
* Existem áreas grandes demais sem conteúdo.

---

# 🎨 IDENTIDADE VISUAL

Voltar a utilizar uma identidade consistente para o Spectre Hub.

Paleta principal:

```text
Background: #0A0A0D
Background 2: #101114
Surface: #151515
Surface 2: #191919
Border: #242424

Primary: #FF0050
Primary Hover: #D90045

Text: #FFFFFF
Text Secondary: #A0A0AA
Text Muted: #6F727A
```

## IMPORTANTE

O **NEON PINK é a cor de identidade do Spectre Hub**.

Não utilizar ciano/turquesa como cor principal.

Não transformar os botões em azul.

Não utilizar verde como cor decorativa.

Verde somente quando tiver significado semântico real, por exemplo:

```text
ONLINE
ATIVO
SUCESSO
```

Azul somente quando existir uma necessidade funcional específica.

---

# ❌ REMOVER O EXCESSO DE UNDERSCORES

Nenhum texto visível deve utilizar `_`.

ERRADO:

```text
JOIN_COMMUNITY
CORE_SYSTEM_INITIALIZED
DEPLOYED_MODULES
LIVE_COMMUNITY_FEED
RUN_MODULE
HUB_ACCESS
2026_VERSION_ELITE
```

CORRETO:

```text
Entrar na comunidade
Sistema inicializado
MÓDULOS disponíveis
Comunidade ativa
Abrir módulo
Acessar Spectre
Versão 2026
```

Se fizer sentido manter algum termo técnico, utilizar:

```text
SPECTRE HUB / STATUS
SISTEMA ONLINE
MÓDULOS ATIVOS
```

Os underscores podem continuar existindo internamente no código, mas NUNCA em textos apresentados ao usuário.

---

# 🇧🇷 PADRONIZAÇÃO DE IDIOMA

A interface pública deve estar em português do Brasil.

Não misturar:

```text
JOIN COMMUNITY
RUN MODULE
GENERATE AUTH CODE
ENTER NAME
COMMUNITY
TIMESTAMP
```

com português sem motivo.

Substituir por:

```text
Entrar na comunidade
Abrir módulo
Gerar código
Nome
Comunidade
Data e hora
```

Manter somente nomes próprios e termos realmente necessários em inglês.

---

# 🔠 TIPOGRAFIA

Os títulos atuais estão grandes demais.

Reduza significativamente a escala.

Nunca permitir que títulos:

* saiam da viewport;
* sejam cortados;
* se sobreponham a outros elementos;
* ultrapassem seus containers;
* cubram cards.

Criar uma hierarquia mais realista:

```text
H1 → grande
H2 → médio
H3 → pequeno
Body → confortável
Label → compacto
```

O Hero pode continuar tendo título grande, mas as outras seções NÃO devem ter títulos gigantes do mesmo tamanho.

---

# 📐 REGRA DE CONTAINER

Nenhum conteúdo pode ultrapassar o container.

Usar um sistema consistente semelhante a:

```css
max-width: 1400px;
margin-inline: auto;
padding-inline: 32px;
```

adaptando aos breakpoints.

Todos os títulos, textos, cards e imagens devem respeitar a largura disponível.

---

# 🧱 SEÇÕES

Cada seção deve possuir um ritmo visual natural.

Evitar:

```text
Título enorme

[ 300px de espaço ]

Conteúdo
```

Usar:

```text
Label
↓
Título
↓
Descrição
↓
Conteúdo
```

com espaçamento consistente.

Eliminar áreas vazias sem finalidade.

---

# ⚠️ CORRIGIR SOBREPOSIÇÕES

Revisar especialmente seções semelhantes às mostradas nas screenshots:

## INFRAESTRUTURA

O título:

```text
INFRAESTRUTURA
DE ALTO
PADRÃO.
```

não pode atravessar o conteúdo da direita.

Criar um layout de duas colunas real:

```text
┌──────────────────────┬──────────────────────┐
│ TÍTULO               │ INFORMAÇÃO / CARD    │
│ DESCRIÇÃO            │                      │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

O texto da esquerda deve permanecer dentro de sua coluna.

---

# 🎴 MÓDULOS / CAROUSEL

A seção de módulos está muito escura e os cards quase não aparecem.

Aumentar ligeiramente:

* contraste;
* superfície dos cards;
* visibilidade das imagens;
* bordas;
* título;
* descrição.

Os cards precisam ser claramente identificáveis.

Manter o componente de carousel escolhido anteriormente, mas corrigir:

* posição;
* escala;
* spacing;
* visibilidade;
* clipping;
* responsividade.

---

# 🎯 HERO

O Hero atual ficou exageradamente grande.

Manter:

```text
SPECTRE HUB
DOMINA
O MERCADO.
```

Mas reduzir a escala para que:

* o título não domine a tela inteira;
* descrição fique próxima;
* botões fiquem próximos;
* comunidade apareça naturalmente;
* a seção termine sem excesso de espaço.

O Hero deve parecer premium, não gigantesco.

---

# 🔘 BOTÕES

Todos os botões precisam seguir o mesmo design system.

Usar:

```text
Primary:
Neon Pink

Secondary:
Dark + Border
```

Padronizar:

* altura;
* padding;
* radius;
* tipografia;
* hover;
* active;
* focus.

Não criar um formato diferente para cada botão.

Evitar botões gigantes.

---

# 🟢 STATUS

Indicadores de status podem utilizar verde apenas quando necessário:

```text
ONLINE
ATIVO
SUCESSO
```

O restante da interface deve permanecer na paleta principal.

---

# 🖼️ IMAGENS

Revisar todas as imagens.

Não permitir:

* imagens quebradas;
* thumbnails vazias;
* avatares invisíveis;
* imagens excessivamente escuras;
* assets distorcidos.

Sempre usar:

```text
object-fit: cover;
```

quando apropriado.

Criar fallback visual elegante quando um asset realmente não existir.

Não mostrar ícone de imagem quebrada.

---

# 🧩 ELEMENTOS ESTRANHOS

Verifique o elemento circular flutuante com o ícone azul/ciano que aparece no lado esquerdo das screenshots.

Se ele não fizer parte intencionalmente do design do Spectre Hub, remover.

Não deixar widgets, componentes de terceiros ou elementos experimentais aparecendo sobre o conteúdo sem função clara.

---

# 📱 RESPONSIVIDADE

Testar obrigatoriamente:

```text
1920px
1600px
1440px
1366px
1280px
1024px
768px
480px
390px
```

Nenhum título pode quebrar de maneira absurda.

Nenhum botão pode sair da tela.

Nenhum card pode ficar cortado.

Nenhuma seção pode criar scroll horizontal.

---

# 🎞️ ANIMAÇÕES

Manter as animações premium já adicionadas, mas reduzir a intensidade.

Não animar tudo.

Priorizar:

* Hero;
* entrada das seções;
* hover;
* carousel;
* botões;
* pequenos indicadores.

As animações devem melhorar o design, não competir com ele.

---

# 🧠 REGRA DE HIERARQUIA

Cada seção deve possuir apenas UM elemento dominante.

Exemplo:

```text
Seção
├── Label
├── Título principal ← dominante
├── Descrição
└── Conteúdo
```

Não ter:

```text
Título gigante
+
Card gigante
+
Texto gigante
+
Botão gigante
+
Glow gigante
```

ao mesmo tempo.

---

# ✨ RESULTADO VISUAL

Quero que o site pareça:

**premium**
**profissional**
**autoral**
**tecnológico**
**limpo**
**bem projetado**

e não:

**template experimental**
**site gerado por IA**
**interface cheia de efeitos**
**dashboard cyber genérico**

---

# 🚫 NÃO FAZER

Não trocar toda a identidade do site.

Não transformar tudo em cards.

Não adicionar novas cores aleatoriamente.

Não usar underscores na interface.

Não exagerar no tamanho dos textos.

Não adicionar elementos só para preencher espaço.

Não inventar informações.

Não alterar funcionalidades.

Não remover rotas.

Não remover componentes funcionais.

Não quebrar navegação.

---

# ✅ PROCESSO

Antes de finalizar:

1. Analise todas as páginas.
2. Identifique problemas de proporção.
3. Corrija overlays.
4. Corrija clipping.
5. Corrija spacing.
6. Padronize cores.
7. Padronize botões.
8. Padronize tipografia.
9. Remova underscores visíveis.
10. Padronize português.
11. Corrija imagens.
12. Teste responsividade.
13. Revise todas as animações.
14. Faça uma última revisão visual página por página.

O resultado final deve parecer **um produto real e polido**, e não uma coleção de componentes adicionados ao site.
*/

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
