# Planos: Free, Premium e Boost

## Regras

| Plano   | Missões/dia | Cooldown entre missões | Como ganha |
|---------|-------------|------------------------|------------|
| Free    | 3           | 10 min                 | padrão     |
| Premium | ilimitado   | 3 min                  | cargo `1511469574422401275` |
| Boost   | ilimitado   | 1 min                  | cargo `1511469585704947943` (server booster) |

Se o usuário tiver os dois cargos, vale o **Boost** (menor cooldown).

## Como detectar o cargo

Preciso do **ID do servidor** onde esses cargos existem pra checar via API do Discord:

```
GET /users/@me/guilds/{GUILD_ID}/member  →  { roles: [...] }
```

Isso usa o próprio token do usuário (mesmo já usado no app). Sem o guild ID não dá pra verificar o cargo — me passa o ID do servidor que hospeda esses cargos.

Enquanto isso, deixo `GUILD_ID` como constante no topo de `src/lib/quest-runner.ts` marcada com `// TODO: preencher`.

## Implementação

### 1. `src/lib/quest-runner.ts`
- Adicionar `fetchUserPlan(): Promise<"free" | "premium" | "boost">` que chama `/guilds/{GUILD_ID}/member` e cruza `roles[]` com os IDs.
- Exportar constantes `PLAN_LIMITS = { free: {daily:3, cooldownMs:600_000}, premium:{daily:Infinity, cooldownMs:180_000}, boost:{daily:Infinity, cooldownMs:60_000} }`.

### 2. `src/lib/quest-store.ts`
- Novo campo persistido `plan: "free"|"premium"|"boost"` (default `free`) + `setPlan`.
- Adicionar seletor derivado `getUsageToday()`: conta `runs` com `status==="completed"` e `started_at` do dia atual.
- Adicionar `getNextAllowedAt()`: `lastCompletedAt + cooldownMs`.
- Bloquear `runQuest`/`runAll` se `usageToday >= dailyLimit` OU `Date.now() < nextAllowedAt` — retornar erro amigável.

### 3. `src/routes/_app.hub.tsx`
- Ao logar, chamar `fetchUserPlan()` e salvar no store.
- Novo card "Plano" no grid principal mostrando badge (Free / Premium / Boost) + uso do dia (`2/3` ou `∞`) + countdown pro próximo run quando em cooldown.
- Desabilitar botão "Completar" e "Run all" quando limite/cooldown ativos, com tooltip explicando.
- Se `plan==="free"` e sem missões restantes, mostrar CTA "Faça boost/assine premium no servidor" com link pro Discord.

### 4. UI do plano
- Badge com cores: Free = `ink-mute`, Premium = `cyan`, Boost = `amber`.
- Barra de cooldown animada usando o `pulse-dot`/gradiente já existentes (nada de token novo).

## Fora de escopo
- Sem persistência server-side de uso: a contagem diária vem do próprio `runs` já salvo no localStorage/Cloud. Se quiser reset à meia-noite server-side me avisa.
- Sem pagamento embutido — quem quiser Premium/Boost precisa ter o cargo no servidor Discord.

## Pergunta pra desbloquear
**Qual o ID do servidor Discord onde ficam esses cargos?** Sem ele a verificação de cargo não roda.
