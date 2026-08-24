# Redesign de Qualidade — Spectre Hub

Revisão visual completa para remover a aparência de site gerado por IA, focando em um design autoral, industrial e premium, mantendo a identidade SPECTRE (Teal #4DA09E).

## Mudanças Visuais

### Core Design System (src/styles.css & src/components/ui/ds.tsx)
- Refinar tipografia: Melhorar hierarquia entre Archivo Black e Inter Tight.
- Reduzir redundâncias: Eliminar excesso de bordas, sombras e glows.
- Personalidade Industrial: Adicionar micro-detalhes editoriais (labels, divisores técnicos, indicadores).

### Landing Page (src/routes/index.tsx & components/home/*)
- **Hero**: Composição assimétrica e autoral, removendo a estrutura de "badge-título-descrição-botões" padrão.
- **Seções**: Alternar entre layouts abertos, listas e blocos editoriais em vez de cards repetitivos.
- **Espaçamento**: Aumentar o ritmo visual com espaçamentos intencionais entre seções.

### Dashboard & Painel Interno (src/routes/_app.*)
- **Hierarquia de Dados**: Transformar cards de métricas em layouts de informação direta (números puros, linhas de status).
- **Interações**: Adicionar hovers contextuais e transições sutis.

### Documentação (src/routes/docs.tsx)
- Foco total em legibilidade.
- Layout limpo com navegação lateral técnica e direta.

## Detalhes Técnicos

### UI/UX
- Substituir `backdrop-filter` e `box-shadow` genéricos por contrastes de cores sólidas e profundidade via composição.
- Padronizar ícones Lucide com pesos e tamanhos consistentes.
- Remover animações de fade-in automáticas em favor de entradas de conteúdo com propósito.

### Estrutura
- Limpeza de componentes repetidos em `src/components/ui/ds.tsx`.
- Refatoração de `LenticularCarousel` e `ReasonsSection` para um visual menos "template".

## User Facing Details
- Visual mais profissional e limpo.
- Navegação fluida sem poluição visual.
- Identidade Spectre fortalecida através de detalhes técnicos e minimalismo.
