import { createFileRoute } from "@tanstack/react-router";

import { ScheduledVisits, type ScheduledVisit } from "@/components/visits/ScheduledVisits";
import { ThemeToggle } from "@/components/budget/ThemeToggle";

export const Route = createFileRoute("/visitas")({
  head: () => ({
    meta: [
      { title: "Visitas agendadas na Kommo · Sistema de Obras" },
      {
        name: "description",
        content:
          "Veja as visitas técnicas agendadas na Kommo e abra o checklist sincronizado de cada obra em um clique.",
      },
      { property: "og:title", content: "Visitas agendadas na Kommo · Sistema de Obras" },
      {
        property: "og:description",
        content: "Visitas técnicas sincronizadas da Kommo com acesso rápido ao checklist de vistoria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisitasPage,
});

const visits: ScheduledVisit[] = [
  {
    id: "1",
    title: "Cond. Rosalina",
    leadId: "26777617",
    tags: ["Reformas Gerais", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-07-22T23:59:00",
  },
  {
    id: "2",
    title: "Condomínio Edifício Icaraí",
    leadId: "26812403",
    tags: ["Impermeabilização", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-07-29T15:00:00",
    currentWeek: true,
  },
  {
    id: "3",
    title: "Condomínio Azuli",
    leadId: "27211999",
    tags: ["Orgânico", "Impermeabilização", "Reformas Gerais", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-07-29T09:00:00",
    currentWeek: true,
  },
  {
    id: "4",
    title: "Cond. Ed. Centro Empresarial Paulista",
    leadId: "27236109",
    tags: ["Google ADS", "Reforma Fachada", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-07-30T14:00:00",
    currentWeek: true,
  },
  {
    id: "5",
    title: "Condomínio Edifício Villa Lobos",
    leadId: "27237739",
    tags: ["Google ADS", "Reforma Fachada", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-08-04T14:00:00",
  },
  {
    id: "6",
    title: "Condomínio Edif. Curitiba e Porto Alegre",
    leadId: "27237433",
    tags: ["Google ADS", "Reforma Fachada", "Pipefy"],
    pipeline: "Vendas Ativas",
    stage: "Visita Técnica Agendada",
    contacts: 1,
    scheduledAt: "2026-08-04T11:00:00",
  },
];

function VisitasPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-foreground sm:text-2xl">
              Agenda de vistorias
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Visitas sincronizadas da Kommo, prontas para virar checklist.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <ScheduledVisits visits={visits} />
      </div>
    </main>
  );
}
