import { createFileRoute } from "@tanstack/react-router";

import { VisitChecklist } from "@/components/visits/VisitChecklist";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Checklist da visita · Sistema de Obras" },
      {
        name: "description",
        content:
          "Selecione serviços do catálogo e calcule metragens direto do tablet durante a visita técnica.",
      },
      { property: "og:title", content: "Checklist da visita · Sistema de Obras" },
      {
        property: "og:description",
        content:
          "Selecione serviços do catálogo e calcule metragens direto do tablet durante a visita técnica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisitChecklist,
});
