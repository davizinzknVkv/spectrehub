import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_app/clone")({
  head: () => ({ meta: [{ title: "Discord Tools — Spectre Hub" }] }),
  component: () => (
    <ComingSoon
      name="Discord Tools"
      icon={Copy}
      eyebrow="identity --control"
      description="Ferramentas avançadas para gestão de servidores, clonagem de estruturas e limpeza em massa estão sendo integradas ao terminal."
    />
  ),
});
