import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { formatPercent } from "@/lib/budget";

interface MarginSimulatorProps {
  currentPercent: number;
  onApply: (target: number) => void;
  onReset: () => void;
}

export function MarginSimulator({
  currentPercent,
  onApply,
  onReset,
}: MarginSimulatorProps) {
  const [target, setTarget] = useState(40);

  return (
    <div className="rounded-xl border border-budget-warning/40 bg-budget-warning-bg/40 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Simulação de margem
          </p>
          <p className="mt-1 text-sm text-foreground">
            Margem atual do rascunho:{" "}
            <span className="font-semibold tabular-nums text-budget-positive">
              {formatPercent(currentPercent)}
            </span>
          </p>
        </div>

        <div className="flex items-end gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Lucro alvo (%)
            <input
              type="number"
              min={0}
              max={70}
              step={0.5}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="mt-1 block w-24 rounded-md border border-input bg-card px-2 py-1.5 text-sm tabular-nums text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
          <button
            type="button"
            onClick={() => onApply(target)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles size={16} />
            Aplicar a todos os itens
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
          >
            <RotateCcw size={16} />
            Restaurar cópia original
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Os preços de venda são recalculados a partir do custo (material + mão de
        obra) e dos impostos (NF 14% + Roy 8%) para atingir o lucro alvo.
      </p>
    </div>
  );
}
