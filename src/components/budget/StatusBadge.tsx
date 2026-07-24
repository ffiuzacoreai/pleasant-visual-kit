import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      status: {
        aprovado: "bg-budget-positive-bg text-budget-positive",
        pendente: "bg-budget-warning-bg text-budget-warning",
        rejeitado: "bg-budget-negative-bg text-budget-negative",
      },
    },
    defaultVariants: {
      status: "pendente",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <span className={badgeVariants({ status })}>{children}</span>;
}
