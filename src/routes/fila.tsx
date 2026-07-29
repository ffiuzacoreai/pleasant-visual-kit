import { createFileRoute } from "@tanstack/react-router";

import { ReviewQueue, type QueueStage } from "@/components/review/ReviewQueue";
import { ThemeToggle } from "@/components/budget/ThemeToggle";

export const Route = createFileRoute("/fila")({
  head: () => ({
    meta: [
      { title: "Fila de revisão · Sistema de Obras" },
      {
        name: "description",
        content:
          "Acompanhe em que etapa do fluxo cada visita está: rascunho, aguardando revisão, em revisão e finalizada.",
      },
      { property: "og:title", content: "Fila de revisão · Sistema de Obras" },
      {
        property: "og:description",
        content: "Visão rápida do andamento de cada visita no fluxo de geração de orçamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FilaPage,
});

const stages: QueueStage[] = [
  {
    id: "rascunho",
    title: "Rascunho",
    hint: "Checklist em preenchimento",
    tone: "draft",
    items: [
      {
        id: "1",
        title: "Condomínio teste",
        code: "VIS-1042",
        owner: "Ana Souza",
        updatedAt: "2026-07-29T11:50:00",
      },
      {
        id: "2",
        title: "Visita sem identificação",
        code: "VIS-1041",
        owner: "Carlos Lima",
        updatedAt: "2026-07-29T11:47:00",
      },
      {
        id: "3",
        title: "Visita sem identificação",
        code: "VIS-1038",
        owner: "Ana Souza",
        updatedAt: "2026-07-28T20:54:00",
      },
    ],
  },
  {
    id: "aguardando",
    title: "Aguardando revisão",
    hint: "Enviado para o revisor",
    tone: "waiting",
    items: [],
  },
  {
    id: "em-revisao",
    title: "Em revisão",
    hint: "Sendo analisado",
    tone: "review",
    items: [],
  },
  {
    id: "finalizada",
    title: "Revisão finalizada",
    hint: "Pronto para orçamento",
    tone: "done",
    items: [
      {
        id: "4",
        title: "sASA",
        code: "VIS-1039",
        owner: "Marcos Reis",
        updatedAt: "2026-07-29T14:57:00",
      },
      {
        id: "5",
        title: "Visita sem identificação",
        code: "VIS-1035",
        owner: "Ana Souza",
        updatedAt: "2026-07-29T11:16:00",
      },
      {
        id: "6",
        title: "Visita sem identificação",
        code: "VIS-1030",
        owner: "Carlos Lima",
        updatedAt: "2026-07-28T17:41:00",
      },
    ],
  },
];

function FilaPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-foreground sm:text-2xl">
              Fluxo de revisão
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe onde cada visita está antes de virar orçamento.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <ReviewQueue stages={stages} />
      </div>
    </main>
  );
}
