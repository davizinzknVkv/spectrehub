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

export function ComingSoon({ name, eyebrow = "status --offline", icon, description }: Props) {
  useEffect(() => {
    toast.message(`${name} em desenvolvimento`, {
      description: "Recurso estará disponível em breve.",
    });
  }, [name]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={eyebrow}
        icon={icon ?? Clock}
        title={name}
        highlight="Offline"
        description={description ?? `${name} está em fase de calibração final.`}
      />

      <div className="py-20 text-center space-y-8 border border-dashed border-white/5 bg-white/[0.01]">
         <div className="w-16 h-16 mx-auto flex items-center justify-center border border-white/10 bg-white/[0.02]">
            <Clock className="w-8 h-8 text-white/20" />
         </div>
         <div className="space-y-2">
            <h3 className="font-display text-xl text-white uppercase italic tracking-widest">Protocolo em Desenvolvimento</h3>
            <p className="font-sans text-sm text-white/30 italic max-w-sm mx-auto">Esta ferramenta está sendo calibrada para garantir a melhor performance e segurança.</p>
         </div>
         <Link to="/hub" className="ds-btn ds-btn-secondary mx-auto !py-2 !px-8 !text-[9px]">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Voltar ao Hub
         </Link>
      </div>
    </div>
  );
}
