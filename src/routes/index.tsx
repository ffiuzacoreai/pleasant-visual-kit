import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { MetricCard } from "@/components/budget/MetricCard";
import { StatusBadge } from "@/components/budget/StatusBadge";
import { ActionBar } from "@/components/budget/ActionBar";
import { SectionTable, type ServiceSection } from "@/components/budget/SectionTable";
import { ThemeToggle } from "@/components/budget/ThemeToggle";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orçamento inicial · Sistema de Obras" },
      { name: "description", content: "Visualize, edite e aprove orçamentos de obra com clareza e controle financeiro." },
      { property: "og:title", content: "Orçamento inicial · Sistema de Obras" },
      { property: "og:description", content: "Visualize, edite e aprove orçamentos de obra com clareza e controle financeiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sections: ServiceSection[] = [
  {
    id: "implantacao",
    title: "Implantação de Obra",
    items: [
      {
        id: "1",
        description: "Aluguel de Equipamentos",
        subtitle: "Item Obrigatório",
        unit: "unid.",
        quantity: 1,
        unitPrice: 1030,
        total: 1030,
        matUnit: 495,
        matTotal: 495,
        moUnit: 0,
        moTotal: 0,
        nf: 144.2,
        roy: 82.4,
        balance: 308.4,
        profitPercent: 29.94,
      },
      {
        id: "2",
        description: "Equipamentos de Proteção Individual",
        subtitle: "Item Obrigatório",
        unit: "unid.",
        quantity: 1,
        unitPrice: 880,
        total: 880,
        matUnit: 320,
        matTotal: 320,
        moUnit: 100,
        moTotal: 100,
        nf: 123.2,
        roy: 70.4,
        balance: 266.4,
        profitPercent: 30.27,
      },
      {
        id: "3",
        description: "Mobilização e Desmobilização de Obra",
        subtitle: "Item Obrigatório",
        unit: "vb",
        quantity: 1,
        unitPrice: 9800,
        total: 9800,
        matUnit: 2500,
        matTotal: 2500,
        moUnit: 2200,
        moTotal: 2200,
        nf: 1372,
        roy: 784,
        balance: 2944,
        profitPercent: 30.04,
      },
      {
        id: "4",
        description: "Seguro de Obra",
        subtitle: "Item Obrigatório",
        unit: "vb",
        quantity: 1,
        unitPrice: 6800,
        total: 6800,
        matUnit: 2500,
        matTotal: 2500,
        moUnit: 500,
        moTotal: 500,
        nf: 952,
        roy: 544,
        balance: 2304,
        profitPercent: 33.88,
      },
    ],
  },
  {
    id: "alugueis",
    title: "Aluguéis",
    items: [
      {
        id: "5",
        description: "Aluguel de Andaimes",
        subtitle: "Item Obrigatório",
        unit: "unid.",
        quantity: 1,
        unitPrice: 950,
        total: 950,
        matUnit: 550,
        matTotal: 550,
        moUnit: 0,
        moTotal: 0,
        nf: 133,
        roy: 76,
        balance: 191,
        profitPercent: 20.11,
      },
      {
        id: "6",
        description: "Aluguel de Betoneira",
        subtitle: "Item Obrigatório",
        unit: "unid.",
        quantity: 1,
        unitPrice: 950,
        total: 950,
        matUnit: 500,
        matTotal: 500,
        moUnit: 0,
        moTotal: 0,
        nf: 133,
        roy: 76,
        balance: 241,
        profitPercent: 25.37,
      },
      {
        id: "7",
        description: "Aluguel de Caçambas",
        subtitle: "Item Obrigatório",
        unit: "unid.",
        quantity: 1,
        unitPrice: 690,
        total: 690,
        matUnit: 490,
        matTotal: 490,
        moUnit: 0,
        moTotal: 0,
        nf: 96.6,
        roy: 55.2,
        balance: 48.2,
        profitPercent: 6.99,
      },
    ],
  },
  {
    id: "projeto",
    title: "Projeto Executivo (Retrofit Fachada)",
    items: [],
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              to="/"
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Orçamento inicial
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>ID: #4</span>
                <span className="hidden sm:inline">·</span>
                <span>23/07/2026</span>
                <StatusBadge status="aprovado">aprovado</StatusBadge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>


        {/* Metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Valor Total"
            value="R$ 11.057.526,80"
            variant="total"
            className="sm:col-span-2 lg:col-span-1"
          />
          <MetricCard label="Total Material" value="R$ 1.748.859,00" />
          <MetricCard label="Total Mão de Obra" value="R$ 3.225.154,00" />
          <MetricCard label="Saldo Líquido Est." value="R$ 3.650.857,90" variant="positive" />
          <MetricCard label="% Lucro" value="33,02%" variant="positive" />
        </div>

        {/* Actions */}
        <div className="mb-8">
          <ActionBar />
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <SectionTable key={section.id} section={section} />
          ))}
        </div>
      </main>
    </div>
  );
}
