# UI Text Harmonization Plan - Spectre Hub

Remove underscores and technical variable names from all user-facing interface text, standardizing on natural Brazilian Portuguese where appropriate, while maintaining the "Obsidian Industrial" aesthetic.

## User Review Required

> [!IMPORTANT]
> - Some labels like `NETWORK_LOCAL` or `CORE_SYSTEM_INITIALIZED` are part of the industrial aesthetic. Should these be translated to Portuguese (e.g., `REDE_LOCAL`) or just have underscores removed (e.g., `REDE LOCAL` / `NETWORK LOCAL`)?
> - The prompt mentions keeping "Obsidian Industrial" but removing "IA look". I will prioritize natural but high-impact terms.

## Proposed Changes

### 1. Content Constants & Layout
- **src/routes/index.tsx**:
  - `DEPLOYED_MODULES` -> `MÓDULOS IMPLANTADOS`
- **src/components/home/constants.ts**:
  - Update product statuses: `Estável` (Keep), `Em breve` (Keep), `Beta` (Keep).
  - Ensure descriptions are natural Portuguese.
- **src/components/home/Hero.tsx**:
  - `CORE_SYSTEM_INITIALIZED` -> `SISTEMA INICIALIZADO`
  - `2026_VERSION_ELITE` -> `VERSÃO ELITE 2026`
  - `[SYSTEM_LOADED]`, `[RLS_ENABLED]`, `[CORE_ACTIVE]` -> `[SISTEMA CARREGADO]`, `[RLS ATIVO]`, `[NÚCLEO ATIVO]`
- **src/components/home/ReasonsSection.tsx**:
  - `[ CORE_INFRASTRUCTURE_V4 ]` -> `[ INFRAESTRUTURA CORE V4 ]`
  - `SYS_MODULE_0{i+1}_ACTIVE` -> `MÓDULO 0{i+1} ATIVO`
- **src/components/home/PlansSection.tsx**:
  - `LEVEL_0{i+1}` -> `NÍVEL 0{i+1}`
  - `INITIALIZE_FREE` -> `COMEÇAR AGORA`
- **src/components/home/CommunitySection.tsx**:
  - `JOIN_COMMUNITY` -> `ENTRAR NA COMUNIDADE`
  - `LIVE_COMMUNITY_FEED` -> `FEED DA COMUNIDADE`
- **src/components/home/SiteHeader.tsx**:
  - `HUB_ACCESS` -> `ACESSAR HUB`
  - `NAV_ROOT` -> `NAVEGAÇÃO`

### 2. Dashboard & App Layout
- **src/routes/_app.tsx**:
  - `MENU_ROOT` -> `MENU PRINCIPAL`
  - `OPERATIONS_SUPPORT` -> `SUPORTE TÉCNICO`
  - `NETWORK_LOCAL` -> `REDE LOCAL`
  - `STATUS_IDLE` -> `STATUS OCIOSO`
  - `LINK_ESTABLISHED` -> `CONEXÃO ESTABELECIDA`
  - `LINK_OFFLINE` -> `OFFLINE`
  - `OPERATOR_AUTH` -> `OPERADOR AUTENTICADO`
  - `PROTOCOL_MGMT` -> `GERENCIAR PROTOCOLOS`
  - `DASHBOARD_ROOT` -> `PAINEL PRINCIPAL`
  - `SEC_PROTOCOL` -> `PROTOCOLOS DE SEGURANÇA`
  - `TERMINATE_LINK` -> `ENCERRAR SESSÃO`
  - `INITIALIZE` -> `ENTRAR`
- **src/routes/_app.hub.tsx**:
  - `[IDENTITY_STATE_VERIFIED]` -> `[IDENTIDADE VERIFICADA]`
  - `NODE_UID_` -> `UID DO NODO: `
  - `GUILDS_VAL`, `REL_FRIENDS`, `MSGS_PACKETS` -> `SERVIDORES`, `AMIGOS`, `MENSAGENS`
  - `TERMINATE_GUILDS` -> `SAIR DOS SERVIDORES`
  - `PROPERTIES_CONFIG` -> `CONFIGURAÇÕES`
  - `CPY_AVATAR`, `CPY_BANNER` -> `COPIAR AVATAR`, `COPIAR BANNER`
  - `STOPPING...` -> `PARANDO...`

### 3. Feature Pages
- **src/routes/_app.missoes.tsx**:
  - `NODES_DETECTED` -> `NODES DETECTADOS`
  - `POLLING...`, `SCAN_NODES` -> `ESCANEAR`, `PESQUISAR NODOS`
  - `LOAD_HISTORY` -> `HISTÓRICO`
  - `CLAIMING...`, `AUTO_COLLECT` -> `COLETANDO...`, `COLETA AUTOMÁTICA`
  - `DEPLOY_ALL` -> `EXECUTAR TUDO`
  - `ABORT_PROTOCOL` -> `ABORTAR PROTOCOLO`
  - `OPERATIONAL_HINT` -> `DICA OPERACIONAL`
- **src/routes/_app.farms.tsx**:
  - `SYS_STATUS`, `OPERATING`, `STANDBY`, `IDLE_STATE` -> `STATUS`, `OPERANDO`, `EM ESPERA`, `OCIOSO`
  - `UPTIME_CLOCK`, `COOLDOWN_VAL`, `COMPLETED_NODES` -> `TEMPO ATIVO`, `COOLDOWN`, `NODOS CONCLUÍDOS`
  - `MISSION_PHASE_PROGRESS` -> `PROGRESSO DA MISSÃO`
  - `HARVEST_PERFORMANCE_METRICS` -> `MÉTRICAS DE COLHEITA`
  - `TOTAL_ORBS`, `DAILY_YIELD`, `SUCCESS_RATE` -> `ORBS TOTAIS`, `RENDIMENTO DIÁRIO`, `TAXA DE SUCESSO`
  - `EVENT_TERMINAL_STDOUT` -> `TERMINAL DE EVENTOS`
  - `INFRASTRUCTURE_DATA`, `GLOBAL_TELEMETRY` -> `DADOS DA INFRAESTRUTURA`, `TELEMETRIA GLOBAL`
- **src/routes/_app.nicksgun.tsx**:
  - `SNIPER_LENGTH_CFG`, `THROTTLING_LATENCY`, `CHARSET_ENCODING`, `PREFIX_IDENTIFIER` -> `TAMANHO DO NICK`, `LATÊNCIA DE BUSCA`, `TIPO DE CARACTERES`, `PREFIXO`
  - `DEPLOY_SNIPER`, `ABORT_SEQUENCE` -> `INICIAR SNIPER`, `ABORTAR SEQUÊNCIA`
  - `SCAN_MONITOR_ACTIVE` -> `MONITOR DE SCAN ATIVO`
  - `TOTAL_NODES` -> `NODOS TOTAIS`
  - `AVAIL_NODE_IDENTIFIED` -> `NODO DISPONÍVEL IDENTIFICADO`
  - `SESSION_INSIGHTS`, `RISK_PROTOCOL` -> `INSIGHTS DA SESSÃO`, `PROTOCOLO DE RISCO`
- **src/routes/_app.settings.tsx**:
  - `GENERAL_SYS`, `ACCOUNT_LINK`, `SECURITY_AUTH`, `INTERFACE_UI`, `NOTIF_STREAM` -> `GERAL`, `CONTA`, `SEGURANÇA`, `INTERFACE`, `NOTIFICAÇÕES`
  - `AUTH_GATEWAY_CREDENTIALS` -> `CREDENCIAIS DE ACESSO`
  - `TERMINATE_SESSION` -> `ENCERRAR SESSÃO`
  - `EMAIL_ENTRY`, `TOKEN_PIPE` -> `ENTRADA POR E-MAIL`, `ENTRADA POR TOKEN`
  - `CACHED_TERMINALS` -> `TERMINAIS SALVOS`
  - `RESTORE_PROTOCOL_AVAILABLE` -> `PROTOCOLO DE RESTAURAÇÃO DISPONÍVEL`
  - `AUTH_MODULE_01`, `AUTH_MODULE_02` -> `MÓDULO DE AUTENTICAÇÃO 01`, `02`
  - `EXTRACT_STDOUT` -> `EXTRAIR VIA CONSOLE`
- **src/routes/_app.resgatar.tsx**:
  - `INFRASTRUCTURE_MODULES` -> `MÓDULOS DE INFRAESTRUTURA`
  - `ACCESS_TERMINAL` -> `ACESSAR TERMINAL`
- **src/routes/_app.spotify.tsx**:
  - `SPOTIFY_GEN_PROTOCOL` -> `PROTOCOLO SPOTIFY GEN`
  - `SOURCE_LINK_GENERATOR` -> `GERADOR DE LINKS`
  - `LINK_QUANTITY` -> `QUANTIDADE DE LINKS`
  - `MAX_BATCH` -> `LOTE MÁXIMO`
  - `START_GENERATION` -> `INICIAR GERAÇÃO`
  - `TERMINAL_STDOUT_RESULTS` -> `RESULTADOS DO TERMINAL`

### 4. Shared Components
- **src/components/Missions.tsx**:
  - `ACTIVE_LICENSE`, `DAILY_ALLOWANCE`, `COOLING_PROTOCOL`, `TERMINAL_STATUS` -> `LICENÇA ATIVA`, `LIMITE DIÁRIO`, `PROTOCOLO DE RESFRIAMENTO`, `STATUS DO TERMINAL`
  - `READY_TO_DEPLOY` -> `PRONTO PARA EXECUTAR`
  - `NODE_VERIFIED` -> `NODO VERIFICADO`
  - `EXECUTE_NODE` -> `EXECUTAR NODO`
  - `CONFIRM_PROTOCOL`, `ABORT` -> `CONFIRMAR PROTOCOLO`, `ABORTAR`
- **src/components/ui/ds.tsx**:
  - Update any placeholder labels in `EmptyState` or `Modal` to be underscore-free.

## Technical Details

- Use a comprehensive multi-file replace strategy.
- Maintain industrial formatting (uppercase, letter-spacing) but remove the `_` character.
- Ensure `i18n` translations are updated in `src/i18n/locales/` if applicable, though many of these are hardcoded strings in components.
- Avoid changing CSS classes, IDs, or variable names.
