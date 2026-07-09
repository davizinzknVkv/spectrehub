## Objetivo

Transformar o site DiscordHub num painel web onde o usuário faz login, cadastra seu token do Discord e executa/monitora as quests direto do navegador — sem precisar rodar `node discordhub.js` localmente.

## Aviso importante (leia antes de aprovar)

1. **ToS**: usar o token de conta pessoal via API viola os Termos do Discord (self-bot). Risco real de banimento. O script original já tem esse aviso; o hub online amplifica esse risco.
2. **Limite técnico do backend**: o backend do Lovable roda em Cloudflare Workers, que **não mantém processos longos**. Uma quest de vídeo dura 45s–15min e uma de jogo até 15min de heartbeats a cada ~24s. Solução: o loop de execução roda **no navegador do usuário** (mantendo a aba aberta) e usa o backend só como proxy autenticado para chamar a API do Discord. Assim contornamos CORS e mantemos o token fora do bundle client.
3. **Token guardado no banco**: criptografado em repouso com uma chave secreta do servidor.

## Escopo

### Backend (Lovable Cloud)
- Auth email/senha + Google.
- Tabela `discord_accounts` (por usuário): token criptografado, `x_super_properties`, `user_agent`, última sincronização.
- Tabela `quest_runs`: log de execuções (quest_id, nome, status, orbs, timestamps).
- Server function `discord-proxy`: recebe `{ endpoint, method, body }`, busca o token do usuário logado, chama `https://discord.com/api/v9{endpoint}` com os headers do script, devolve status + body cru. Toda chamada à API do Discord passa por aqui.
- Server function `save-discord-account`: valida token chamando `/users/@me`, criptografa e salva.
- Server function `list-runs` / `log-run`: histórico.

### Frontend (novas rotas)
- `/` — landing atual (mantém), com CTA "Abrir o Hub".
- `/auth` — login/cadastro.
- `/_authenticated/hub` — painel principal:
  - Card do perfil Discord (avatar, username, Orbs atuais — busca via proxy).
  - Botão "Buscar missões disponíveis".
  - Lista de quests com tipo, duração, recompensa, botão "Executar".
  - Botão "Executar todas em sequência".
  - Barra de progresso em tempo real da quest ativa.
  - Log ao vivo (estilo terminal) com as mensagens do script.
- `/_authenticated/settings` — cadastrar/atualizar token, xSuperProperties, userAgent.
- `/_authenticated/history` — tabela com execuções anteriores.

### Lógica de execução (client-side)
Porta do script Node para TS no browser:
- `fetchAvailableQuests()`, `runQuest()`, `getBestTask()`, `createProgressBar()` — tudo em `src/lib/quest-runner.ts`.
- Cada `makeRequest` chama a server function `discord-proxy` (não a API do Discord direto).
- Estado da execução num Zustand store (`quest-store.ts`): quest ativa, progresso, log, fila.
- Enquanto a aba estiver aberta o loop roda; se fechar, pausa. Aviso claro no UI.

## Detalhes técnicos

- **Criptografia do token**: `crypto.subtle` AES-GCM no server, chave em `DISCORD_TOKEN_ENCRYPTION_KEY` (gerada via `generate_secret`).
- **RLS**: `discord_accounts` e `quest_runs` scoped a `auth.uid()`.
- **Rate limiting**: mantém o `jitter()` do script original no loop client.
- **Rotas auth**: `/hub`, `/settings`, `/history` sob `_authenticated/`.
- **Google OAuth**: configurado via `configure_social_auth`.

## Passos de implementação

1. Ativar Lovable Cloud + configurar auth (email/senha + Google).
2. Migration: tabelas `discord_accounts`, `quest_runs` com RLS + grants.
3. Gerar `DISCORD_TOKEN_ENCRYPTION_KEY`.
4. Server functions: `save-discord-account`, `discord-proxy`, `list-runs`, `log-run`.
5. Layout `_authenticated`, páginas `/auth`, `/hub`, `/settings`, `/history`.
6. Portar lógica do script para `src/lib/quest-runner.ts` + store Zustand.
7. Componentes: `QuestCard`, `ProgressBar`, `LiveLog`, `AccountCard`.
8. Manter a landing atual em `/` com CTA para o hub.

## Fora do escopo (posso adicionar depois se pedir)

- Execução via cron externo (rodar sem aba aberta).
- Multi-contas Discord por usuário.
- Notificações push quando terminar.
- Dashboard com gráfico de Orbs ganhos por dia.

## Confirmação

Aprova esse plano? Se sim, começo pela ativação do Cloud + auth + migrations, depois server functions, depois UI.
