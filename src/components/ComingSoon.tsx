import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Clock, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge, EmptyState, buttonClass } from "@/components/ui/ds";

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

      <EmptyState
        icon={Clock}
        title={`${name} está em desenvolvimento`}
        description="Estamos finalizando essa ferramenta. Assim que estiver pronta, ela aparece aqui automaticamente."
        action={
          <div className="flex flex-col items-center gap-4">
            <Badge variant="warning">em breve</Badge>
            <Link to="/hub" className={buttonClass("secondary", "sm")}>
              <ArrowLeft className="h-3.5 w-3.5" />
              voltar ao dashboard
            </Link>
          </div>
        }
      />
    </div>
  );
}
