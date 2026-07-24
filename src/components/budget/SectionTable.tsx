import { useState, useRef, useEffect } from "react";
import { ChevronDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceItem {
  id: string;
  description: string;
  subtitle?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  matUnit: number;
  matTotal: number;
  moUnit: number;
  moTotal: number;
  nf: number;
  roy: number;
  balance: number;
  profitPercent: number;
}

export interface ServiceSection {
  id: string;
  title: string;
  items: ServiceItem[];
}

interface SectionTableProps {
  section: ServiceSection;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function EditableCell({
  value,
  align = "right",
}: {
  value: number;
  align?: "left" | "right";
}) {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <input
      type="text"
      defaultValue={formatted}
      className={cn(
        "box-border w-full rounded border border-transparent bg-transparent px-0.5 py-1 text-xs tabular-nums transition-colors hover:border-input focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-ring",
        align === "right" && "text-right",
        align === "left" && "text-left"
      )}
    />
  );
}

export function SectionTable({ section }: SectionTableProps) {
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 2);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 bg-secondary/50 px-4 py-3 text-left transition-colors hover:bg-secondary"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {section.title}
        </h3>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            !isOpen && "-rotate-90"
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={scrollRef}
          className="relative overflow-x-auto scrollbar-thin"
          data-table-scroll
        >
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-white/5" />
          )}
          <table className="w-full min-w-[1180px] border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 z-10 w-72 bg-muted/50 px-3 py-2.5 backdrop-blur-sm">
                  Descrição
                </th>
                <th className="w-14 min-w-14 px-2 py-2.5 text-center">Unid.</th>
                <th className="w-20 min-w-20 px-1 py-2.5 text-right">Qtde.</th>
                <th className="w-32 min-w-32 px-1 py-2.5 text-right">
                  Unit. Venda
                </th>

                <th className="w-24 min-w-24 px-2 py-2.5 text-right">Total</th>
                <th
                  className="border-l bg-muted/30 px-2 py-2.5 text-center"
                  colSpan={4}
                >
                  Custo
                </th>
                <th
                  className="border-l bg-muted/30 px-2 py-2.5 text-center"
                  colSpan={4}
                >
                  Impostos e Resultado
                </th>
              </tr>
              <tr className="border-b bg-muted/30 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 z-10 bg-muted/30 px-3 py-2 backdrop-blur-sm"></th>
                <th className="px-2 py-2 text-center"></th>
                <th className="px-1 py-2 text-right"></th>
                <th className="px-1 py-2 text-right"></th>
                <th className="px-2 py-2 text-right"></th>
                <th className="w-24 min-w-24 whitespace-nowrap border-l px-1 py-2 text-right">
                  Mat. Unit
                </th>
                <th className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right">
                  Mat. Total
                </th>
                <th className="w-24 min-w-24 whitespace-nowrap px-1 py-2 text-right">
                  MO Unit
                </th>
                <th className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right">
                  MO Total
                </th>
                <th className="w-20 min-w-20 whitespace-nowrap border-l px-2 py-2 text-right">
                  Nf (14%)
                </th>
                <th className="w-20 min-w-20 whitespace-nowrap px-2 py-2 text-right">
                  Roy (8%)
                </th>
                <th className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right text-budget-positive">
                  Saldo
                </th>
                <th className="w-20 min-w-20 whitespace-nowrap px-2 py-2 text-right text-budget-positive">
                  % Lucro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {section.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors hover:bg-accent/50",
                    index % 2 === 1 && "bg-secondary/20"
                  )}
                >
                  <td className="sticky left-0 z-10 w-72 bg-card px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                      <GripVertical
                        size={14}
                        className="mt-0.5 shrink-0 text-muted-foreground/50"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {item.description}
                        </p>
                        {item.subtitle && (
                          <p className="text-[10px] text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="w-14 min-w-14 whitespace-nowrap px-2 py-2 text-center text-muted-foreground">
                    {item.unit}
                  </td>
                  <td className="w-20 min-w-20 px-1 py-2 text-right">
                    <EditableCell value={item.quantity} />
                  </td>
                  <td className="w-28 min-w-28 px-1 py-2 text-right">
                    <EditableCell value={item.unitPrice} />
                  </td>
                  <td className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right font-medium tabular-nums text-foreground">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="w-24 min-w-24 border-l px-1 py-2 text-right">
                    <EditableCell value={item.matUnit} />
                  </td>
                  <td className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(item.matTotal)}
                  </td>
                  <td className="w-24 min-w-24 px-1 py-2 text-right">
                    <EditableCell value={item.moUnit} />
                  </td>
                  <td className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(item.moTotal)}
                  </td>
                  <td className="w-20 min-w-20 whitespace-nowrap border-l px-2 py-2 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(item.nf)}
                  </td>
                  <td className="w-20 min-w-20 whitespace-nowrap px-2 py-2 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(item.roy)}
                  </td>
                  <td className="w-24 min-w-24 whitespace-nowrap px-2 py-2 text-right font-semibold tabular-nums text-budget-positive">
                    {formatCurrency(item.balance)}
                  </td>
                  <td className="w-20 min-w-20 whitespace-nowrap px-2 py-2 text-right font-semibold tabular-nums text-budget-positive">
                    {formatPercent(item.profitPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
