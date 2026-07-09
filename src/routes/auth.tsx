import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — DiscordHub" },
      { name: "description", content: "Acesse o hub para automatizar suas quests do Discord." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/hub", replace: true });
    });
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/hub" },
        });
        if (error) throw error;
        toast.success("Cadastro criado! Confirme o e-mail se pedirmos.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/hub", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/hub", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no login com Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px 400px at 20% 15%, rgba(88,101,242,0.25), transparent 60%)",
        }}
      />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5865F2] font-black text-white shadow-lg shadow-indigo-500/30">
            D
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            Discord<span className="text-[#5865F2]">Hub</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "login" ? "Entre para acessar o hub." : "Crie sua conta para começar."}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
          >
            Continuar com Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-white/10" />
            ou
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#0f1218] px-3 py-2 text-sm placeholder:text-slate-600 focus:border-[#5865F2] focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#0f1218] px-3 py-2 text-sm placeholder:text-slate-600 focus:border-[#5865F2] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#5865F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4752c4] disabled:opacity-50"
            >
              {loading ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-slate-400 hover:text-white"
          >
            {mode === "login"
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
