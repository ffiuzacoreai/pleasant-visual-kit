import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  variant?: "default" | "total" | "positive";
  className?: string;
}

export function MetricCard({ label, value, variant = "default", className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        variant === "total" && "border-l-4 border-l-primary bg-gradient-to-br from-card to-secondary/50",
        variant === "positive" && "border-l-4 border-l-budget-positive",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          variant === "total" && "text-budget-total",
          variant === "positive" && "text-budget-positive",
          variant === "default" && "text-card-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
