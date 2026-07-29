import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Clock,
  FileEdit,
  Inbox,
  Search,
  CheckCircle2,
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type QueueItem = {
  id: string;
  title: string;
  updatedAt: string;
  owner?: string;
  code?: string;
};

export type QueueStage = {
  id: string;
  title: string;
  hint: string;
  tone: "draft" | "waiting" | "review" | "done";
  items: QueueItem[];
};

const toneStyles: Record<
  QueueStage["tone"],
  { accent: string; text: string; chip: string; dot: string }
> = {
  draft: {
    accent: "bg-muted-foreground/40",
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
  waiting: {
    accent: "bg-budget-warning",
    text: "text-budget-warning",
    chip: "bg-budget-warning-bg text-budget-warning",
    dot: "bg-budget-warning",
  },
  review: {
    accent: "bg-budget-highlight",
    text: "text-budget-highlight",
    chip: "bg-budget-highlight-bg text-budget-highlight",
    dot: "bg-budget-highlight",
  },
  done: {
    accent: "bg-budget-positive",
    text: "text-budget-positive",
    chip: "bg-budget-positive-bg text-budget-positive",
    dot: "bg-budget-positive",
  },
};

const stageIcon = {
  draft: FileEdit,
  waiting: Clock,
  review: Eye,
  done: CheckCircle2,
} as const;

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function ItemCard({
  item,
  tone,
  onOpen,
}: {
  item: QueueItem;
  tone: QueueStage["tone"];
  onOpen?: (item: QueueItem) => void;
}) {
  const styles = toneStyles[tone];
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg border border-border bg-card p-3 pl-4 text-left",
        "transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", styles.accent)} aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
          {item.code && (
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{item.code}</p>
          )}
        </div>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="size-3 shrink-0" />
          <span className="truncate" title={formatDate(item.updatedAt)}>
            {relativeTime(item.updatedAt)}
          </span>
        </span>
        {item.owner && (
          <span
            className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground"
            title={item.owner}
          >
            {initials(item.owner)}
          </span>
        )}
      </div>
    </button>
  );
}

function StageColumn({
  stage,
  index,
  total,
  query,
  onOpen,
}: {
  stage: QueueStage;
  index: number;
  total: number;
  query: string;
  onOpen?: (item: QueueItem) => void;
}) {
  const [open, setOpen] = useState(true);
  const styles = toneStyles[stage.tone];
  const Icon = stageIcon[stage.tone];

  const items = useMemo(
    () =>
      stage.items.filter((i) =>
        query ? i.title.toLowerCase().includes(query.toLowerCase()) : true,
      ),
    [stage.items, query],
  );

  return (
    <section className="flex min-w-[260px] flex-1 flex-col rounded-xl border border-border bg-secondary/30">
      <span className={cn("h-1 rounded-t-xl", styles.accent)} aria-hidden />
      <header className="flex items-center gap-2 px-3 py-3">
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-md", styles.chip)}>
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{stage.title}</h3>
          <p className="truncate text-[11px] text-muted-foreground">
            Etapa {index + 1} de {total}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
            styles.chip,
          )}
        >
          {items.length}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Recolher etapa" : "Expandir etapa"}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
        </button>
      </header>

      {open && (
        <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-8 text-center">
              <CircleDashed className="size-5 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">
                {query ? "Nenhum resultado nesta etapa." : "Nenhum checklist aqui."}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <ItemCard key={item.id} item={item} tone={stage.tone} onOpen={onOpen} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

export function ReviewQueue({
  stages,
  onOpenItem,
}: {
  stages: QueueStage[];
  onOpenItem?: (item: QueueItem) => void;
}) {
  const [query, setQuery] = useState("");
  const totalItems = stages.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Inbox className="size-5 shrink-0 text-muted-foreground" />
            <span className="truncate">Fila de revisão</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalItems} checklists ativos organizados por etapa do fluxo.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar visita..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Trilho de progresso do fluxo */}
      <div className="mt-5 flex items-center gap-1" aria-hidden>
        {stages.map((stage) => (
          <div key={stage.id} className="flex flex-1 items-center gap-1">
            <span className={cn("h-1.5 flex-1 rounded-full", toneStyles[stage.tone].accent)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        {stages.map((stage, i) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            index={i}
            total={stages.length}
            query={query}
            onOpen={onOpenItem}
          />
        ))}
      </div>
    </div>
  );
}
