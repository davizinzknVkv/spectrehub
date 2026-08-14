# Plan: Spectre Optimizer Implementation

Add a comprehensive performance optimization module to the Spectre Hub platform, featuring a cyberpunk-themed dashboard, real-time monitoring, and system optimization tools.

## User Review Required

> [!IMPORTANT]
> Since this is a web-based application, direct access to Windows system APIs (like clearing system cache or ending OS processes) is restricted by browser security sandboxes. The implementation will provide a professional UI and architecture ready for a local agent/bridge, and will use browser-available metrics (Memory, CPU cores, Network latency) for real-time data.

## Proposed Changes

### 1. Design System & Branding
- Define neon purple (`#a855f7`), neon blue (`#3b82f6`), and cyan (`#06b6d4`) tokens in `src/styles.css`.
- Create glassmorphism card variants and "cyber-border" utilities.
- Add `Zap` or `Cpu` icon to the sidebar navigation.

### 2. Navigation & Routing
- **Layout**: Update `src/routes/_app.tsx` to include "Spectre Optimizer" in a new "Performance" navigation group.
- **New Routes**:
    - `src/routes/_app.optimizer.tsx`: Main dashboard with stats, scan, and overview.
    - `src/routes/_app.optimizer_.optimizations.tsx`: Detailed category-based optimization settings.
    - `src/routes/_app.optimizer_.history.tsx`: Log of applied changes.

### 3. Core Components (`src/components/optimizer/`)
- **MetricCard**: Real-time display for CPU, RAM, etc., with small sparkline charts.
- **SystemScan**: An animated multi-step scan interface (Scanning -> Analyzing -> Optimizing -> Completed).
- **OptimizationItem**: Toggleable items for Windows, Gaming, and Network tweaks.
- **PerformanceScore**: A large gauge component displaying the 0-100 score.
- **LiveMonitor**: Real-time charts for system resources.

### 4. Logic & State Management
- **Store**: Create `src/lib/optimizer/optimizer-store.ts` using Zustand to manage scan states, applied optimizations, and history.
- **Service Layer**: Implement `src/lib/optimizer/optimizer-service.ts` to handle the "Scan" logic and mock the system bridge communication.

### 5. Features Implementation
- **Process & Startup Manager**: Professional table layouts with priority management (UI-only for OS processes, functional for app-specific state).
- **Game Boost**: Game selection UI with resource allocation visualization.
- **Restore Point**: UI for managing "snapshots" of settings before optimization.

## Technical Details

- **Visuals**: Tailwind v4 with CSS variables for dynamic neon glows. Framer Motion for smooth "scanning" transitions.
- **Charts**: Use `recharts` (if available) or lightweight custom SVG charts for resource monitoring.
- **Architecture**: Modular folder structure under `src/lib/optimizer` to keep logic separate from presentation.

## Constraints & Assumptions
- All "System" actions will trigger a professional "Administrator Permission Required" or "Agent Not Detected" modal if they require native privileges, as per the user's "Architecture for a local agent" requirement.
- No existing routes or authentication flows will be modified.
- The theme will strictly follow the Obsidian + Neon Pink/Purple/Blue palette.
