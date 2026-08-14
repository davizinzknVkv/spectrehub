import { Zap, Gauge, Target, Tag, ShieldCheck, Music4, Sparkles, LifeBuoy } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  category: "Automação" | "Discord" | "Economia" | "Utilidades";
  desc: string;
  status: string;
  price?: string;
  to: string;
  icon: any;
  previewUrl?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "quests",
    name: "Auto Quests",
    category: "Automação",
    desc: "Execução massiva de missões oficiais do Discord. Coleta automatizada de Orbs e recompensas com sistema anti-detecção e cooldown inteligente.",
    status: "Estável",
    to: "/missoes",
    icon: Zap,
    previewUrl: "/mnt/documents/auto-quests-preview.png"
  },
  {
    id: "optimizer",
    name: "Optimizer",
    category: "Utilidades",
    desc: "Maximize a performance do seu hardware. Ferramenta elite para limpeza de registros, otimização de CPU/RAM e redução drástica de latência em jogos e aplicações.",
    status: "Em breve",
    to: "/hub",
    icon: Gauge,
    previewUrl: "" // Removido para mostrar "Em breve"
  },
  {
    id: "nicks",
    name: "Nicks-Gun",
    category: "Discord",
    desc: "Domine sua identidade. Sniper avançado para capturar usernames raros de 2 e 3 letras antes de todos.",
    status: "Beta",
    to: "/nicksgun",
    icon: Target,
    previewUrl: "/mnt/documents/nicksgun-preview.png"
  },
  {
    id: "orbs",
    name: "Resgatar Orbs",
    category: "Economia",
    desc: "Transforme esforço em recompensa. Acesso direto ao catálogo oficial com resgate otimizado em um clique.",
    status: "Estável",
    to: "/resgatar",
    icon: Tag,
    previewUrl: "/mnt/documents/login-preview.png"
  },
  {
    id: "farms",
    name: "Farms Automáticas",
    category: "Automação",
    desc: "Produtividade ininterrupta. Sistemas de farm contínuo com algoritmos de proteção anti-detecção.",
    status: "Estável",
    to: "/farms",
    icon: Gauge,
    previewUrl: "/mnt/documents/auto-quests-preview.png"
  },
  {
    id: "control",
    name: "Server Control",
    category: "Utilidades",
    desc: "Poder total sobre sua conta. Gestão profissional de servidores, clonagem e limpeza em massa.",
    status: "Estável",
    to: "/clone",
    icon: ShieldCheck,
    previewUrl: "/mnt/documents/hub-preview.png"
  },
  {
    id: "presence",
    name: "Presence Sync",
    category: "Utilidades",
    desc: "Identidade ativa. Sincronize seu status e música enquanto nossas ferramentas trabalham para você.",
    status: "Estável",
    to: "/spotify",
    icon: Music4,
    previewUrl: "/mnt/documents/hub-preview.png"
  },
];

export type Plan = {
  name: string;
  price: string;
  period: string;
  cta: string;
  highlight: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    cta: "Acessar Gratuitamente",
    highlight: false,
    features: [
      "20 missões diárias",
      "Cooldown de 10 min",
      "Acesso a todas as quests",
      "Estatísticas locais",
    ],
  },
  {
    name: "Premium",
    price: "R$ 9,90",
    period: "acesso 30 dias",
    cta: "Assinar Premium",
    highlight: true,
    features: [
      "Missões ilimitadas",
      "Cooldown reduzido (3 min)",
      "Cargo Premium exclusivo",
      "Suporte prioritário",
    ],
  },
  {
    name: "Lifetime",
    price: "R$ 39,90",
    period: "pagamento único",
    cta: "Garantir Vitalício",
    highlight: false,
    features: [
      "Benefícios Premium vitalícios",
      "Cargo permanente no Discord",
      "Zero mensalidades",
      "Acesso antecipado a betas",
    ],
  },
  {
    name: "Booster",
    price: "Grátis",
    period: "via server boost",
    cta: "Dar Boost",
    highlight: false,
    features: [
      "Missões ilimitadas",
      "Menor cooldown do sistema (1 min)",
      "Cargo Booster automático",
      "Status VIP na comunidade",
    ],
  },
];

export type Reason = {
  n: string;
  icon: any;
  title: string;
  desc: string;
};

export const REASONS: Reason[] = [
  {
    n: "01",
    icon: Gauge,
    title: "Latência Mínima",
    desc: "Execução distribuída que minimiza tempos de resposta e maximiza a taxa de sucesso nas operações.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Segurança de Nível Bancário",
    desc: "Sistemas de proteção que emulam padrões de comportamento humano, mitigando riscos de detecção por heurística.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Omnicanalidade",
    desc: "Centralize o gerenciamento de múltiplas frentes — quests, economia e identidade — em um único dashboard intuitivo.",
  },
  {
    n: "04",
    icon: LifeBuoy,
    title: "SLA Garantido",
    desc: "Suporte especializado e atualizações constantes para garantir que suas automações nunca fiquem obsoletas.",
  },
];
