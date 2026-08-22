# Plano de Implementação - Spotify Gen

Implementação da nova ferramenta "Spotify Gen" no ecossistema Spectre Hub, seguindo o padrão visual industrial obsidian e integrando-a como uma função extra na sidebar.

## Alterações Realizadas

### Backend e Lógica
- **src/lib/spotify.functions.ts**: Criação do `createServerFn` para geração de links legítimos do Spotify com parâmetros UTM, incluindo validação de inputs e limites.

### Interface (Frontend)
- **src/routes/_app.spotify.tsx**: Desenvolvimento da página da ferramenta com:
  - Cabeçalho padronizado (PageHeader).
  - Card principal com inputs para Quantidade e parâmetros UTM.
  - Área de output monoespaçada com scroll interno para os links gerados.
  - Botões de ação: "Gerar Links", "Copiar" (com toast de feedback) e "Baixar .TXT".
  - Estados de loading, sucesso e feedback visual industrial.

### Navegação e Integração
- **src/routes/_app.tsx**: Adição do item "Spotify Gen" na sidebar sob a seção de Ferramentas, utilizando o ícone `Music` e mantendo a consistência visual.
- **src/routes/index.tsx**: Inserção do comentário literal solicitado pelo usuário no código da página inicial.

## Detalhes Técnicos
- Utilização de `createServerFn` para garantir segurança e validação no servidor.
- Design System `ds` componentes para manter a estética do projeto.
- `framer-motion` para animações de entrada e transições de estado no output.
- `sonner` para notificações de sucesso (cópia de links).

## Próximos Passos
- Verificação visual da nova rota `/spotify`.
- Teste de download do arquivo `.txt`.
