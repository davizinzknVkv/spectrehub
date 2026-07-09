import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuestStore } from "@/lib/quest-store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const hydrate = useQuestStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(600px 400px at 15% 10%, rgba(88,101,242,0.25), transparent 60%), radial-gradient(500px 350px at 85% 20%, rgba(235,69,158,0.12), transparent 60%)",
        }}
      />
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#5865F2] font-black text-white">
                D
              </div>
              <span className="font-semibold">
                Discord<span className="text-[#5865F2]">Hub</span>
              </span>
            </Link>
            <nav className="flex gap-4 text-sm text-slate-400">
              <Link to="/hub" activeProps={{ className: "text-white" }} className="hover:text-white">
                Hub
              </Link>
              <Link
                to="/history"
                activeProps={{ className: "text-white" }}
                className="hover:text-white"
              >
                Histórico
              </Link>
              <Link
                to="/settings"
                activeProps={{ className: "text-white" }}
                className="hover:text-white"
              >
                Token
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
