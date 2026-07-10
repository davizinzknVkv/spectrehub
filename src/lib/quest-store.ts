import { create } from "zustand";

export type LogEntry = { id: number; ts: number; text: string; level: "info" | "success" | "error" };

export type Quest = {
  questId: string;
  questName: string;
  taskType: string;
  target: number;
  rewardText: string;
  isEnrolled: boolean;
  imageUrl?: string;
  publisher?: string;
  expiresAt?: string;
};


export type Credentials = {
  token: string;
  xSuperProperties?: string;
  userAgent?: string;
};

export type RunRecord = {
  id: string;
  quest_id: string;
  quest_name: string;
  task_type: string;
  reward_text: string | null;
  status: "completed" | "failed" | "skipped";
  error_message: string | null;
  started_at: string;
};

type Progress = { current: number; total: number };

const CREDS_KEY = "discordhub.creds";
const RUNS_KEY = "discordhub.runs";
const PLAN_KEY = "discordhub.plan";
const LAST_KEY = "discordhub.lastCompletedAt";

function loadPlan(): Plan {
  if (typeof window === "undefined") return "free";
  const v = window.localStorage.getItem(PLAN_KEY);
  return v === "premium" || v === "boost" ? v : "free";
}
function loadLastCompleted(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(LAST_KEY) ?? 0) || 0;
}

function loadCreds(): Credentials | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CREDS_KEY);
    return raw ? (JSON.parse(raw) as Credentials) : null;
  } catch {
    return null;
  }
}

function loadRuns(): RunRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RUNS_KEY);
    return raw ? (JSON.parse(raw) as RunRecord[]) : [];
  } catch {
    return [];
  }
}

export type Plan = "free" | "premium" | "boost";

type State = {
  running: boolean;
  activeQuestId: string | null;
  progress: Progress | null;
  logs: LogEntry[];
  quests: Quest[];
  loadingQuests: boolean;
  shouldStop: boolean;
  creds: Credentials | null;
  runs: RunRecord[];
  plan: Plan;
  lastCompletedAt: number;
  setQuests: (q: Quest[]) => void;
  setLoadingQuests: (v: boolean) => void;
  setRunning: (r: boolean) => void;
  setActive: (id: string | null) => void;
  setProgress: (p: Progress | null) => void;
  log: (text: string, level?: LogEntry["level"]) => void;
  clearLogs: () => void;
  requestStop: () => void;
  resetStop: () => void;
  setCreds: (c: Credentials | null) => void;
  addRun: (r: RunRecord) => void;
  setPlan: (p: Plan) => void;
  markCompleted: () => void;
  hydrate: () => void;
};

let logId = 0;

export const useQuestStore = create<State>((set, get) => ({
  running: false,
  activeQuestId: null,
  progress: null,
  logs: [],
  quests: [],
  shouldStop: false,
  creds: null,
  runs: [],
  plan: "free",
  lastCompletedAt: 0,
  setQuests: (quests) => set({ quests }),
  setRunning: (running) => set({ running }),
  setActive: (activeQuestId) => set({ activeQuestId, progress: null }),
  setProgress: (progress) => set({ progress }),
  log: (text, level = "info") =>
    set((s) => ({
      logs: [...s.logs.slice(-199), { id: ++logId, ts: Date.now(), text, level }],
    })),
  clearLogs: () => set({ logs: [] }),
  requestStop: () => set({ shouldStop: true }),
  resetStop: () => set({ shouldStop: false }),
  setCreds: (creds) => {
    set({ creds });
    if (typeof window !== "undefined") {
      if (creds) window.localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
      else window.localStorage.removeItem(CREDS_KEY);
    }
  },
  addRun: (r) => {
    const runs = [r, ...get().runs].slice(0, 200);
    set({ runs });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
    }
  },
  setPlan: (plan) => {
    set({ plan });
    if (typeof window !== "undefined") window.localStorage.setItem(PLAN_KEY, plan);
  },
  markCompleted: () => {
    const t = Date.now();
    set({ lastCompletedAt: t });
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_KEY, String(t));
  },
  hydrate: () =>
    set({
      creds: loadCreds(),
      runs: loadRuns(),
      plan: loadPlan(),
      lastCompletedAt: loadLastCompleted(),
    }),
}));
