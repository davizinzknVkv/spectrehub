import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Clock, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type Props = {
  name: string;
  eyebrow?: string;
  icon?: LucideIcon;
  description?: string;
};

export function ComingSoon({ name, eyebrow = "status --soon", icon, description }: Props) {
  useEffect(() => {
    toast.message(`${name} está em desenvolvimento`, {
      description: "Estará disponível em breve.",
    });
  }, [name]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={eyebrow}
        icon={icon ?? Clock}
        title={name}
        highlight="em breve"
        description={description ?? `${name} está em desenvolvimento e estará disponível em breve.`}
      />

      <section
        className="fade-up relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0a]/80 px-6 py-14 text-center backdrop-blur-xl sm:px-10"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400">
          <Clock className="h-5 w-5" />
        </div>
        <span className="mt-5 inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
          em breve
        </span>
        <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
          {name} está em desenvolvimento
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-slate-400">
          Estamos finalizando essa ferramenta. Assim que estiver pronta, ela aparece aqui
          automaticamente.
        </p>
        <Link
          to="/hub"
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          voltar ao dashboard
        </Link>
      </section>
    </div>
  );
}
