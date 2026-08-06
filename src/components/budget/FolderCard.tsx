import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Folder, Layers, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatRelative, type BudgetFolder } from "@/lib/budget-folders";

export function FolderCard({ folder }: { folder: BudgetFolder }) {
  const [name, setName] = useState(folder.name);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(folder.name);

  const count = folder.budgets.length;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4",
        "transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-border transition-colors group-hover:bg-primary" aria-hidden />

      <div className="flex items-start gap-3 pl-1">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Folder className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setName(draft.trim() || name);
                    setEditing(false);
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                aria-label="Salvar nome"
                onClick={() => {
                  setName(draft.trim() || name);
                  setEditing(false);
                }}
                className="rounded-md p-1.5 text-budget-positive hover:bg-accent"
              >
                <Check className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Cancelar"
                onClick={() => setEditing(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
              <button
                type="button"
                aria-label={`Renomear ${name}`}
                onClick={() => {
                  setDraft(name);
                  setEditing(true);
                }}
                className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          )}
          {folder.client && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{folder.client}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/70 pt-3 pl-1">
        <span className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-semibold tabular-nums text-secondary-foreground">
            <Layers className="size-3" />
            {count} {count === 1 ? "orçamento" : "orçamentos"}
          </span>
          <span className="truncate">{formatRelative(folder.updatedAt)}</span>
        </span>

        <Link
          to="/orcamentos/$folderId"
          params={{ folderId: folder.id }}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent"
        >
          Abrir
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
