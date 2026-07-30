import { Plus, X, Lock, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScenarioTab {
  id: string;
  name: string;
  kind: "official" | "draft";
}

interface ScenarioTabsProps {
  tabs: ScenarioTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
}

export function ScenarioTabs({
  tabs,
  activeId,
  onSelect,
  onAdd,
  onClose,
}: ScenarioTabsProps) {
  return (
    <div className="flex items-end gap-1 overflow-x-auto border-b border-border scrollbar-thin">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 rounded-t-lg border border-b-0 px-3 py-2 text-sm transition-colors",
              isActive
                ? "border-border bg-card font-medium text-foreground"
                : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            {isActive && (
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 rounded-t",
                  tab.kind === "official" ? "bg-primary" : "bg-budget-warning"
                )}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect(tab.id)}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              {tab.kind === "official" ? (
                <Lock size={13} className="text-muted-foreground" />
              ) : (
                <FlaskConical size={13} className="text-budget-warning" />
              )}
              {tab.name}
            </button>
            {tab.kind === "draft" && (
              <button
                type="button"
                aria-label={`Fechar ${tab.name}`}
                onClick={() => onClose(tab.id)}
                className="rounded p-0.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        aria-label="Novo rascunho"
        title="Novo rascunho (cópia do orçamento atual)"
        className="mb-1 ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-foreground"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
