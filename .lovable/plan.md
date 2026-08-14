# Plan - Auditoria e Correção Completa de UI/UX - Spectre Hub

A auditoria e correção total do frontend focará em eliminar problemas estruturais de layout (vazamentos, quebras de responsividade, desalinhamentos) sem recorrer a "gambiarras". O objetivo é padronizar componentes e containers para garantir uma experiência profissional e consistente em todos os dispositivos e resoluções.

## Auditoria e Mapeamento

- **Layout Global**: Revisar `src/routes/__root.tsx` e `src/routes/_app.tsx` para garantir que a hierarquia de containers (`viewport -> page -> container -> content`) seja respeitada.
- **CSS Architecture**: Auditar `src/styles.css` em busca de larguras fixas, `overflow: hidden` excessivo, ou `z-index` mal gerido. Refinar tokens de espaçamento e tipografia.
- **Componentes Core**: Auditar `src/components/ui/` (botões, cards, badges) e componentes de layout como `PageHeader` e `Section`.
- **Páginas Críticas**: 
  - Home (`src/routes/index.tsx`) e seus subcomponentes.
  - Missões (`src/routes/_app.missoes.tsx` e `src/components/Missions.tsx`).
  - Painel Admin (`src/routes/_app.admin.tsx`).
  - Dashboard e demais rotas (`_app.*`).

## Medidas Técnicas

### 1. Sistema de Containers e Grids
- Substituir larguras fixas por `max-w-*` e `w-full`.
- Implementar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` em todos os layouts de grid para garantir fluidez.
- Padronizar paddings laterais (`px-4 sm:px-6 lg:px-8`).

### 2. Tratamento de Conteúdo e Texto
- Aplicar `break-words` e `overflow-wrap: anywhere` em containers que recebem inputs de usuários (nomes, emails, descrições).
- Utilizar `line-clamp` com critério em descrições de cards, garantindo que o layout não quebre mesmo com textos longos.
- Garantir que títulos (H1, H2) tenham tamanhos responsivos (`text-2xl sm:text-3xl lg:text-4xl`).

### 3. Padronização de Componentes
- **Botões**: Garantir que o `ds-btn` e suas variantes tenham `min-width` adequado e lidem corretamente com ícones e textos longos via `flex-wrap` ou `whitespace-nowrap` controlado.
- **Cards**: Unificar altura dos cards em grids usando `h-full` no container interno para que todos os itens da linha se alinhem pelo fundo.
- **Imagens**: Implementar um componente de imagem com fallback automático para evitar o ícone de "imagem quebrada".

### 4. Responsividade e Viewport
- Eliminar qualquer causa de scroll horizontal (`overflow-x`).
- Ajustar a Sidebar para comportamento de "drawer" ou ocultação inteligente em telas menores que 1024px.
- Corrigir posicionamentos absolutos que saem do container pai.

## Detalhes Técnicos
- Uso extensivo de utilitários Tailwind v4 para layouts fluidos.
- Implementação de um `useImageFallback` hook ou componente similar.
- Revisão de `calc()` em layouts de sidebar/header para evitar gaps de 1px ou sobreposições.
- Verificação de `hydration mismatches` no console que podem causar saltos de layout.

## User Review Required
- Nenhuma decisão de design pendente (manteremos Obsidian/Pink), mas confirmarei se o usuário prefere `truncate` ou `line-clamp` para descrições de produtos muito longas.
