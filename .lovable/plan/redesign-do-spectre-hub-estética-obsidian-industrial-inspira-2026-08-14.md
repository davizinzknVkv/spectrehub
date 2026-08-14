# Redesign do Spectre Hub - Estética Obsidian Industrial (Inspirado em CoreNetwork)

Este plano detalha a reformulação visual e estrutural do Spectre Hub para atingir um nível "Premium/Tech", mantendo a identidade original da marca e as funcionalidades existentes, enquanto adota a sofisticação visual do site de referência.

## Alterações Visuais e Estruturais

### 1. Sistema de Design e Estilo Global
- **Paleta Obsidian Industrial**: Padronização do uso de `#030303` (Fundo), `#080808` (Superfícies/Cards) e `#ff0055` (Rosa Spectre para acentos).
- **Tipografia**: Reforço do uso de `Archivo Black` para títulos de alto impacto e `Inter Tight` para o corpo de texto, garantindo hierarquia e espaçamento premium.
- **Glassmorphism**: Aplicação de efeitos de desfoque (`backdrop-blur`), bordas finas semi-transparentes e sombras suaves em todos os containers.
- **Botões Industriais**: Manutenção e refinamento dos botões hexagonais (`ds-btn`) com animações de glow e microinterações de escala.

### 2. Homepage (Landing Page)
- **Hero Section**: Redesenho para uma composição centralizada e impactante. Títulos massivos, gradientes radiais sutis e CTAs destacados.
- **Navbar Flutuante**: Refinamento da barra de navegação "pílula", garantindo transparência no topo e fundo preto fosco com blur ao rolar.
- **Seções de Produto e Social Proof**: Reorganização em grids táticos e minimalistas, utilizando cards com profundidade visual e animações de revelação escalonadas.
- **Live Stats**: Estilização da linha de estatísticas em tempo real com tipografia técnica e animações de contagem fluidas.

### 3. Animações e Microinterações
- **Entradas Fluídas**: Implementação de `fade-in`, `slide-up` e `reveal` suaves em todas as seções para uma experiência de carregamento progressiva.
- **Feedback Visual**: Adição de efeitos de iluminação que seguem o mouse (spotlight) em seções estratégicas como a de membros e cards de produtos.
- **Transições de Estado**: Suavização de todas as mudanças de hover, abertura de modais e navegação entre abas.

### 4. Otimização e Responsividade
- **Audit UI/UX**: Correção de overflows horizontais, ajuste de tamanhos de fonte para dispositivos móveis e garantia de que o layout se adapte perfeitamente de 320px a 4k.
- **Performance**: Manutenção do carregamento rápido através do uso eficiente de CSS moderno e preloading de ativos críticos.

## Detalhes Técnicos
- Atualização das variáveis `@theme` no `src/styles.css`.
- Refatoração de componentes em `src/components/home/` para alinhar com a nova hierarquia visual.
- Uso de `clip-path` para elementos industriais e `framer-motion` (ou CSS transitions) para as animações solicitadas.
- Garantia de que nenhum nome de marca externa (Core, Rebirth, etc.) seja utilizado, focando exclusivamente na identidade **Spectre Hub**.
