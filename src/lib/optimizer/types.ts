import { LucideIcon } from "lucide-react";

export type MetricType = "cpu" | "ram" | "gpu" | "disk" | "fps" | "ping" | "temp_cpu" | "temp_gpu";

export interface SystemMetric {
  id: MetricType;
  label: string;
  value: string | number;
  unit: string;
  trend: number[];
  status: "optimal" | "warning" | "critical";
  icon: LucideIcon;
}

export type OptimizationCategory = "windows" | "gaming" | "network" | "storage";

export interface OptimizationItem {
  id: string;
  category: OptimizationCategory;
  name: string;
  description: string;
  benefit: string;
  status: "optimized" | "recommended" | "available";
  impact: "low" | "medium" | "high";
}

export interface OptimizationHistory {
  id: string;
  date: string;
  name: string;
  category: OptimizationCategory;
  result: "completed" | "failed";
}

export interface ProcessItem {
  pid: number;
  name: string;
  cpu: number;
  ram: number;
  status: "running" | "suspended";
  priority: "low" | "normal" | "high" | "critical";
}

export interface StartupItem {
  id: string;
  name: string;
  publisher: string;
  impact: "low" | "medium" | "high";
  enabled: boolean;
}
