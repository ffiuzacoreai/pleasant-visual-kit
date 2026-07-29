import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type ScheduledVisit = {
  id: string;
  title: string;
  leadId: string;
  tags: string[];
  pipeline: string;
  stage: string;
  contacts: number;
  scheduledAt: string;
  currentWeek?: boolean;
};

const weekdayFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
const timeFmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

function VisitCard({
  visit,
  onOpen,
}: {
  visit: ScheduledVisit;
  onOpen?: (visit: ScheduledVisit) => void;
}) {
  const date = new Date(visit.scheduledAt);

  return (
    <button
      type="button"
      onClick={() => onOpen?.(visit)}
      className={cn(
        "group relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-left",
        "transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          visit.currentWeek ? "bg-budget-highlight" : "bg-border",
        )}
        aria-hidden
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 pl-1">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{visit.title}</h3>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            Lead #{visit.leadId}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums",
              visit.currentWeek
                ? "bg-budget-highlight-bg text-budget-highlight"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            <CalendarClock className="size-3" />
            {weekdayFmt.format(date).replace(".", "")} {dayFmt.format(date)} ·{" "}
            {timeFmt.format(date)}
          </span>
          {visit.currentWeek && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-budget-highlight">
              Semana atual
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pl-1">
        {visit.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-2.5 pl-1">
        <span className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">
            {visit.pipeline} · {visit.stage}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Users className="size-3" />
            {visit.contacts}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary">
          Abrir checklist
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </button>
  );
}

export function ScheduledVisits({
  visits,
  onOpenVisit,
  onRefresh,
}: {
  visits: ScheduledVisit[];
  onOpenVisit?: (visit: ScheduledVisit) => void;
  onRefresh?: () => void;
}) {
  const [filter, setFilter] = useState<"week" | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visits.filter(
      (v) =>
        (filter === "all" || v.currentWeek) &&
        (!q || v.title.toLowerCase().includes(q) || v.leadId.includes(q)),
    );
  }, [visits, filter, query]);

  const weekCount = visits.filter((v) => v.currentWeek).length;

  return (
    <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
            <span className="truncate">Visitas agendadas na Kommo</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} visitas · clique em um card para abrir o checklist sincronizado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="relative w-full max-w-[200px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar visita..."
              className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
            {(
              [
                { id: "week", label: `Semana atual (${weekCount})` },
                { id: "all", label: `Todas (${visits.length})` },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === opt.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <RefreshCw className="size-3.5" />
            Atualizar
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-12 text-center">
          <CalendarDays className="size-6 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">Nenhuma visita encontrada.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((visit) => (
            <VisitCard key={visit.id} visit={visit} onOpen={onOpenVisit} />
          ))}
        </div>
      )}
    </section>
  );
}
