import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  FileText,
  FolderOpen,
  Sparkles,
  Trash2,
} from "lucide-react";

import { StatusBadge } from "@/components/budget/StatusBadge";
import { cn } from "@/lib/utils";
import {
  findFolder,
  formatDate,
  formatRelative,
  type BudgetVersion,
} from "@/lib/budget-folders";
import { formatCurrency } from "@/lib/budget";

export const Route = createFileRoute("/orcamentos/$folderId")({
  loader: ({ params }) => {
    const folder = findFolder(params.folderId);
    if (!folder) throw notFound();
    return { folder };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.folder.name} · Orçamentos`
      : "Pasta não encontrada · Orçamentos";
    const description = loaderData
      ? `Versões de orçamento da pasta ${loaderData.folder.name}: oficial e rascunhos comparáveis.`
      : "A pasta de orçamentos solicitada não existe.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FolderPage,
});

function BudgetCard({
  budget,
  official,
  delta,
}: {
  budget: BudgetVersion;
  official: boolean;
  delta: number;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card p-4 transition-all duration-150",
        "hover:-translate-y-0.5 hover:shadow-md",
        official ? "border-primary/40" : "border-border hover:border-primary/30",
      )}
    >
      <span
        className={cn("absolute inset-y-0 left-0 w-1", official ? "bg-primary" : "bg-border")}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-2 pl-1">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{budget.name}</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatDate(budget.updatedAt)} · {formatRelative(budget.updatedAt)}
          </p>
        </div>
        <StatusBadge
          status={
            budget.status === "aprovado"
              ? "aprovado"
              : budget.status === "rejeitado"
                ? "rejeitado"
                : "pendente"
          }
        >
          {budget.status}
        </StatusBadge>
      </div>

      <p className="mt-3 pl-1 font-mono text-xl font-semibold tabular-nums text-budget-total">
        {formatCurrency(budget.total)}
      </p>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileText className="size-3" />
          {budget.items} itens
        </span>
        {!official && Math.abs(delta) > 0.005 && (
          <span
            className={cn(
              "font-semibold tabular-nums",
              delta > 0 ? "text-budget-positive" : "text-budget-negative",
            )}
          >
            {delta > 0 ? "+" : ""}
            {formatCurrency(delta)} vs. oficial
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3 pl-1">
        <Link
          to="/"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          Ver detalhes
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          aria-label={`Duplicar ${budget.name}`}
          title="Duplicar como rascunho"
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Excluir ${budget.name}`}
          title="Excluir"
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </article>
  );
}

function FolderPage() {
  const { folder } = Route.useLoaderData();
  const [name, setName] = useState(folder.name);

  const officialTotal = useMemo(
    () => folder.budgets.find((b: BudgetVersion) => b.status === "aprovado")?.total ?? folder.budgets[0]?.total ?? 0,
    [folder.budgets],
  );

  const ordered = useMemo(
    () =>
      [...folder.budgets].sort((a: BudgetVersion, b: BudgetVersion) => {
        const aOff = a.status === "aprovado" ? 0 : 1;
        const bOff = b.status === "aprovado" ? 0 : 1;
        if (aOff !== bOff) return aOff - bOff;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
    [folder.budgets],
  );

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/orcamentos" className="rounded px-1 py-0.5 hover:text-foreground">
            Orçamentos
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{name}</span>
        </nav>

        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              to="/orcamentos"
              aria-label="Voltar para pastas"
              className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="size-5 shrink-0 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nome da pasta"
                  className="w-full min-w-0 max-w-md rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xl font-semibold tracking-tight text-foreground hover:border-border focus:border-input focus:outline-none focus:ring-2 focus:ring-ring sm:text-2xl"
                />
              </div>
              <p className="mt-1 pl-7 text-sm text-muted-foreground">
                {folder.budgets.length} versões · orçamentos derivados desta visita/checklist.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Sparkles className="size-4" />
            Gerar Orçamento com IA
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {ordered.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              official={budget.status === "aprovado"}
              delta={budget.total - officialTotal}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
