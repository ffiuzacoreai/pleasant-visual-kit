import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen, Search, Sparkles } from "lucide-react";

import { FolderCard } from "@/components/budget/FolderCard";
import { budgetFolders } from "@/lib/budget-folders";

export const Route = createFileRoute("/orcamentos/")({
  head: () => ({
    meta: [
      { title: "Pastas de orçamentos · Sistema de Obras" },
      {
        name: "description",
        content:
          "Navegue pelas pastas de visitas e checklists para acessar os orçamentos derivados de cada obra.",
      },
      { property: "og:title", content: "Pastas de orçamentos · Sistema de Obras" },
      {
        property: "og:description",
        content: "Pastas de visitas/checklists com os orçamentos derivados de cada obra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrcamentosPage,
});

function OrcamentosPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "name">("recent");

  const folders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return budgetFolders
      .filter((f) => !q || f.name.toLowerCase().includes(q) || f.client?.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name, "pt-BR")
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [query, sort]);

  const totalBudgets = budgetFolders.reduce((acc, f) => acc + f.budgets.length, 0);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Orçamentos
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {budgetFolders.length} pastas de visitas/checklists · {totalBudgets} orçamentos
              derivados. Abra uma pasta para ver as versões.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-[220px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar pasta..."
                className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
              {(
                [
                  { id: "recent", label: "Recentes" },
                  { id: "name", label: "A–Z" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSort(opt.id)}
                  className={
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors " +
                    (sort === opt.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Sparkles className="size-4" />
              Gerar Orçamento com IA
            </button>
          </div>
        </header>

        {folders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-16 text-center">
            <FolderOpen className="size-6 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">Nenhuma pasta encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
