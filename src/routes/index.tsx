import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";

import { MetricCard } from "@/components/budget/MetricCard";
import { StatusBadge } from "@/components/budget/StatusBadge";
import { ActionBar } from "@/components/budget/ActionBar";
import { SectionTable } from "@/components/budget/SectionTable";
import { ScenarioTabs, type ScenarioTab } from "@/components/budget/ScenarioTabs";
import { MarginSimulator } from "@/components/budget/MarginSimulator";
import {
  applyTargetMargin,
  cloneSections,
  computeTotals,
  formatCurrency,
  formatPercent,
  updateItemField,
  type EditableField,
  type ServiceSection,
} from "@/lib/budget";

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

const initialSections: ServiceSection[] = [
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

interface Scenario extends ScenarioTab {
  sections: ServiceSection[];
  /** Cópia do estado no momento da criação do rascunho. */
  origin: ServiceSection[];
}

const OFFICIAL_ID = "oficial";

function Index() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: OFFICIAL_ID,
      name: "Orçamento oficial",
      kind: "official",
      sections: initialSections,
      origin: cloneSections(initialSections),
    },
  ]);
  const [activeId, setActiveId] = useState(OFFICIAL_ID);

  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0];
  const isDraft = active.kind === "draft";
  const totals = useMemo(() => computeTotals(active.sections), [active.sections]);
  const originTotals = useMemo(() => computeTotals(active.origin), [active.origin]);

  const patchActive = (sections: ServiceSection[]) =>
    setScenarios((prev) =>
      prev.map((s) => (s.id === active.id ? { ...s, sections } : s))
    );

  const handleAddDraft = () => {
    const draftCount = scenarios.filter((s) => s.kind === "draft").length + 1;
    const id = `rascunho-${Date.now()}`;
    setScenarios((prev) => [
      ...prev,
      {
        id,
        name: `Rascunho ${draftCount}`,
        kind: "draft",
        sections: cloneSections(active.sections),
        origin: cloneSections(active.sections),
      },
    ]);
    setActiveId(id);
  };

  const handleClose = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) setActiveId(OFFICIAL_ID);
  };

  const handleOfficialize = () => {
    const sections = cloneSections(active.sections);
    setScenarios((prev) =>
      prev
        .filter((s) => s.id !== active.id)
        .map((s) =>
          s.id === OFFICIAL_ID ? { ...s, sections, origin: cloneSections(sections) } : s
        )
    );
    setActiveId(OFFICIAL_ID);
  };

  const handleChangeField = (
    itemId: string,
    field: EditableField,
    value: number
  ) => patchActive(updateItemField(active.sections, itemId, field, value));

  const tabs: ScenarioTab[] = scenarios.map(({ id, name, kind }) => ({
    id,
    name,
    kind,
  }));

  const deltaTotal = totals.total - originTotals.total;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                {isDraft ? (
                  <StatusBadge status="pendente">rascunho</StatusBadge>
                ) : (
                  <StatusBadge status="aprovado">aprovado</StatusBadge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cenários (abas) */}
        <div className="mb-6">
          <ScenarioTabs
            tabs={tabs}
            activeId={active.id}
            onSelect={setActiveId}
            onAdd={handleAddDraft}
            onClose={handleClose}
          />
        </div>

        {isDraft && (
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>
                Você está em um <strong className="text-foreground">rascunho</strong>. As
                alterações não afetam o orçamento oficial até você clicar em{" "}
                <strong className="text-foreground">Oficializar rascunho</strong>. Células
                destacadas em amarelo mudaram em relação à cópia original.
              </p>
            </div>
            <MarginSimulator
              currentPercent={totals.profitPercent}
              onApply={(target) => patchActive(applyTargetMargin(active.sections, target))}
              onReset={() => patchActive(cloneSections(active.origin))}
            />
          </div>
        )}

        {/* Metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Valor Total"
            value={formatCurrency(totals.total)}
            variant="total"
            className="sm:col-span-2 lg:col-span-1"
          />
          <MetricCard label="Total Material" value={formatCurrency(totals.material)} />
          <MetricCard label="Total Mão de Obra" value={formatCurrency(totals.labor)} />
          <MetricCard
            label="Saldo Líquido Est."
            value={formatCurrency(totals.balance)}
            variant="positive"
          />
          <MetricCard
            label="% Lucro"
            value={formatPercent(totals.profitPercent)}
            variant="positive"
          />
        </div>

        {isDraft && Math.abs(deltaTotal) > 0.005 && (
          <p className="mb-6 text-sm text-muted-foreground">
            Diferença em relação à cópia original:{" "}
            <span className="font-semibold tabular-nums text-budget-warning">
              {deltaTotal > 0 ? "+" : ""}
              {formatCurrency(deltaTotal)}
            </span>{" "}
            no valor total ·{" "}
            <span className="font-semibold tabular-nums text-budget-warning">
              {formatPercent(totals.profitPercent - originTotals.profitPercent)}
            </span>{" "}
            de lucro
          </p>
        )}

        {/* Actions */}
        <div className="mb-8">
          <ActionBar
            mode={isDraft ? "draft" : "official"}
            onOfficialize={handleOfficialize}
            onDelete={isDraft ? () => handleClose(active.id) : undefined}
          />
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {active.sections.map((section) => (
            <SectionTable
              key={section.id}
              section={section}
              baseline={
                isDraft ? active.origin.find((s) => s.id === section.id) : undefined
              }
              onChangeField={handleChangeField}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
