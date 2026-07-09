import { create } from "zustand";

export type LogEntry = { id: number; ts: number; text: string; level: "info" | "success" | "error" };

export type Quest = {
  questId: string;
  questName: string;
  taskType: string;
  target: number;
  rewardText: string;
  isEnrolled: boolean;
};

type Progress = { current: number; total: number };

type State = {
  running: boolean;
  activeQuestId: string | null;
  progress: Progress | null;
  logs: LogEntry[];
  quests: Quest[];
  shouldStop: boolean;
  setQuests: (q: Quest[]) => void;
  setRunning: (r: boolean) => void;
  setActive: (id: string | null) => void;
  setProgress: (p: Progress | null) => void;
  log: (text: string, level?: LogEntry["level"]) => void;
  clearLogs: () => void;
  requestStop: () => void;
  resetStop: () => void;
};

let logId = 0;

export const useQuestStore = create<State>((set) => ({
  running: false,
  activeQuestId: null,
  progress: null,
  logs: [],
  quests: [],
  shouldStop: false,
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
}));
