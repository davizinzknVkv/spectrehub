import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useQuestStore } from "@/lib/quest-store";

export const ADMIN_DISCORD_ID = "1217795750407442473";

/** Verifica se a conta conectada é a conta administradora. */
export function useIsAdmin() {
  const creds = useQuestStore((s) => s.creds);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!creds) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    import("@/lib/quest-runner")
      .then(({ fetchUserInfo }) => fetchUserInfo())
      .then((u) => {
        if (!cancelled) setIsAdmin((u as { id?: string } | null)?.id === ADMIN_DISCORD_ID);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [creds]);

  return isAdmin;
}

/** Atalho do painel admin — visível apenas para o dono do SPECTRE. */
export function AdminNavLink() {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white transition-all group">
      <ShieldCheck className="h-4 w-4 shrink-0 text-primary group-hover:text-primary transition-colors" />
      <span className="font-display text-[11px] uppercase tracking-widest italic">Terminal Admin</span>
    </Link>
  );
}
