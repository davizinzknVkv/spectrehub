import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuestStore } from "@/lib/quest-store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/hub", label: "Hub", hint: "01" },
  { to: "/history", label: "Histórico", hint: "02" },
  { to: "/settings", label: "Token", hint: "03" },
] as const;

function AppLayout() {
  const hydrate = useQuestStore((s) => s.hydrate);
  const creds = useQuestStore((s) => s.creds);
  const running = useQuestStore((s) => s.running);
  const runsCount = useQuestStore((s) => s.runs.length);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(700px 500px at 8% -5%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 60%), radial-gradient(600px 400px at 100% 100%, color-mix(in oklab, var(--mint) 12%, transparent), transparent 60%)",
        }}
      />

      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-line/60 bg-surface/40 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
              <div className="relative grid h-9 w-9 place-items-center rounded-md border border-cyan/40 bg-cyan/10 font-mono text-sm font-bold text-cyan">
                D
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-mint pulse-dot" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-ink">
                  neighbors<span className="text-cyan">hub</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                  v1.0 · terminal
                </div>
              </div>
            </Link>

            <div className="mx-5 h-px bg-line" />

            <nav className="flex flex-col gap-0.5 p-3 lg:flex-1">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-cyan/10 text-ink glow-cyan"
                        : "text-ink-dim hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-widest ${
                        active ? "text-cyan" : "text-ink-mute group-hover:text-cyan-dim"
                      }`}
                    >
                      {item.hint}
                    </span>
                    <span>{item.label}</span>
                    <span
                      className={`ml-auto h-1.5 w-1.5 rounded-full transition ${
                        active ? "bg-cyan pulse-dot" : "bg-transparent"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-2 border-t border-line/60 p-4">
              <StatusRow
                label="Token"
                value={creds ? "conectado" : "ausente"}
                tone={creds ? "mint" : "amber"}
              />
              <StatusRow
                label="Runner"
                value={running ? "executando" : "ocioso"}
                tone={running ? "cyan" : "mute"}
              />
              <StatusRow label="Runs" value={String(runsCount)} tone="mute" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <TopBar />
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "mint" | "amber" | "mute";
}) {
  const dot =
    tone === "cyan"
      ? "bg-cyan"
      : tone === "mint"
        ? "bg-mint"
        : tone === "amber"
          ? "bg-amber"
          : "bg-ink-mute";
  return (
    <div className="flex items-center justify-between rounded-md border border-line/60 bg-surface/60 px-2.5 py-1.5 font-mono text-[11px]">
      <span className="text-ink-mute uppercase tracking-widest">{label}</span>
      <span className="flex items-center gap-2 text-ink">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {value}
      </span>
    </div>
  );
}

function TopBar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const current = NAV.find((n) => n.to === pathname);
  const now = new Date();
  const clock = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return (
    <div className="sticky top-0 z-10 border-b border-line/60 bg-background/70 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:px-8">
        <div className="min-w-0 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
          <span className="text-cyan">~/neighborshub</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-ink">{current?.label.toLowerCase() ?? "home"}</span>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          <span className="hidden sm:inline">sistema</span>
          <span className="inline-flex items-center gap-1.5 text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" />
            online
          </span>
          <span className="hidden text-ink md:inline">{clock}</span>
        </div>
      </div>
    </div>
  );
}
