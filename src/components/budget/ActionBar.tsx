import {
  Trash2,
  Plus,
  FileDown,
  XCircle,
  CheckCircle2,
  Settings2,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface ActionBarProps {
  mode?: "official" | "draft";
  onOfficialize?: () => void;
  onDelete?: () => void;
}

export function ActionBar({
  mode = "official",
  onOfficialize,
  onDelete,
}: ActionBarProps) {
  const isDraft = mode === "draft";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          <Trash2 size={16} />
          {isDraft ? "Excluir rascunho" : "Excluir orçamento"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
        >
          <Plus size={16} />
          Adicionar serviço
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
        >
          <FileDown size={16} />
          Exportar CSV
        </button>

        {isDraft ? (
          <button
            type="button"
            onClick={onOfficialize}
            className="inline-flex items-center gap-2 rounded-md bg-budget-positive px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <BadgeCheck size={16} />
            Oficializar rascunho
          </button>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <XCircle size={16} />
              Rejeitar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-budget-positive/30 bg-card px-3 py-2 text-sm font-medium text-budget-positive transition-colors hover:bg-budget-positive/10"
            >
              <CheckCircle2 size={16} />
              Aprovar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
            >
              <Settings2 size={16} />
              Configurar proposta
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <FileText size={16} />
              Gerar proposta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
