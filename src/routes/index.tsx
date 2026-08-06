/**
 * Antes de realizar qualquer ação, entenda o contexto e instrução recente do usuário, comando mais recente enviado por ele: Melhorar no meu sistema os estados de loading, empty, error e success em todas as telas, mantendo as funcionalidades existentes.
 *
 * Seu objetivo é elevar o nível visual e de experiência do usuário para um padrão moderno, premium e altamente intuitivo, sem alterar funcionalidades existentes.
 *
 * ━━━━━━━━━━━━━━━━━━━
 * ESTADOS DE UI/UX
 * ━━━━━━━━━━━━━━━━━━━
 * 
 * - Loading: Usar skeletons consistentes em vez de indicadores simples quando possível.
 * - Empty: Usar EmptyState com ícones e ações de recuperação.
 * - Error: Usar feedback visual claro (toasts + estados de tela).
 * - Success: Confirmar ações com toasts e estados de feedback visual.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Gauge,
  Instagram,
  LifeBuoy,
  Menu,
  MessageSquare,
  Music4,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import nghcLogo from "@/assets/nghc-logo.png.asset.json";
// ... (rest of the file follows)
import { PageHeader } from "@/components/PageHeader";

const TITLE = "NeighborD Hub — Automação premium de quests do Discord";
const DESCRIPTION =
  "Plataforma para comunidades que levam a experiência a sério: auto quests, farm de Orbs, sniper de nicks e ferramentas de servidor num único hub.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://neighbordhubdc.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://neighbordhubdc.lovable.app/" },
      { rel: "preload", as: "image", href: nghcLogo.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

// ... (copy rest of the file content)
