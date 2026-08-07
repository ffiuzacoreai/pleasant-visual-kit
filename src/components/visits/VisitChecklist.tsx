import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  ListChecks,
  Mic,
  Plus,
  Search,
  Trash2,
  X,
  GripVertical,
  Save,
  Calculator,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  catalog,
  evaluateFormula,
  formatNumber,
  UNITS,
  type CatalogService,
  type SelectedItem,
} from "@/lib/checklist";

const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------------------------------- UI bits --------------------------------- */

function UnitSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-12 min-w-20 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    >
      {UNITS.map((u) => (
        <option key={u} value={u}>
          {u}
        </option>
      ))}
      {!UNITS.includes(value as (typeof UNITS)[number]) && <option value={value}>{value}</option>}
    </select>
  );
}

function FormulaField({
  value,
  onChange,
  placeholder = "Ex.: =6+4*2,70",
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const result = evaluateFormula(value);
  const invalid = value.trim().length > 0 && result === null;

  const insert = (token: string) => {
    onChange(value + token);
    ref.current?.focus();
  };

  return (
    <div className="min-w-0">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          value={value}
          inputMode="decimal"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-xl border bg-background pl-3 pr-24 text-base tabular-nums text-foreground",
            "placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring",
            invalid ? "border-budget-negative" : "border-input",
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute right-2 top-1/2 max-w-20 -translate-y-1/2 truncate rounded-lg px-2 py-1 text-sm font-semibold tabular-nums",
            result !== null
              ? "bg-budget-positive-bg text-budget-positive"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {result !== null ? formatNumber(result) : "—"}
        </span>
      </div>

      {/* Teclado auxiliar: evita trocar de teclado no tablet */}
      {focused && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["+", "-", "*", "/", "(", ")", ","].map((t) => (
            <button
              key={t}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(t)}
              className="h-10 w-10 rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground active:scale-95"
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange("")}
            className="h-10 rounded-lg border border-border bg-secondary px-3 text-xs font-semibold text-muted-foreground active:scale-95"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Catálogo -------------------------------- */

function CatalogPane({
  query,
  setQuery,
  selectedIds,
  onAdd,
}: {
  query: string;
  setQuery: (v: string) => void;
  selectedIds: Set<string>;
  onAdd: (service: CatalogService, categoryId: string) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ portaria: true });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog
      .map((c) => ({
        ...c,
        services: c.services.filter(
          (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.services.length > 0);
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-col">
      <div className="sticky top-0 z-10 bg-card/95 pb-3 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por descrição ou código"
            className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((category) => {
          const isOpen = searching || open[category.id];
          const addedCount = category.services.filter((s) => selectedIds.has(s.id)).length;

          return (
            <section
              key={category.id}
              className="overflow-hidden rounded-xl border border-border bg-background"
            >
              <button
                type="button"
                onClick={() => setOpen((p) => ({ ...p, [category.id]: !p[category.id] }))}
                aria-expanded={!!isOpen}
                className="flex min-h-14 w-full items-center gap-3 px-3 text-left transition-colors hover:bg-accent/60"
              >
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold uppercase tracking-wide text-foreground">
                  {category.name}
                </span>
                {addedCount > 0 && (
                  <span className="shrink-0 rounded-md bg-budget-positive-bg px-2 py-0.5 text-xs font-bold tabular-nums text-budget-positive">
                    {addedCount}
                  </span>
                )}
                <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
                  {category.services.length}
                </span>
              </button>

              {isOpen && (
                <ul className="border-t border-border/70 p-2 pt-1">
                  {category.services.map((service) => {
                    const added = selectedIds.has(service.id);
                    return (
                      <li key={service.id}>
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "copy";
                            e.dataTransfer.setData(
                              "application/x-servico",
                              JSON.stringify({ serviceId: service.id, categoryId: category.id }),
                            );
                          }}
                          className={cn(
                            "group mt-1 flex items-center gap-2 rounded-xl border p-2 transition-colors",
                            added
                              ? "border-budget-positive/40 bg-budget-positive-bg/50"
                              : "border-transparent bg-secondary/50 hover:bg-secondary",
                          )}
                        >
                          <GripVertical className="hidden size-4 shrink-0 cursor-grab text-muted-foreground/60 lg:block" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-snug text-foreground">
                              {service.name}
                            </p>
                            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                              {service.code} · unidade base {service.baseUnit}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onAdd(service, category.id)}
                            aria-label={added ? `Adicionar novamente ${service.name}` : `Adicionar ${service.name}`}
                            className={cn(
                              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-transform active:scale-95",
                              added
                                ? "bg-budget-positive-bg text-budget-positive"
                                : "bg-primary text-primary-foreground",
                            )}
                          >
                            {added ? <Check className="size-4" /> : <Plus className="size-4" />}
                            <span className="hidden sm:inline">{added ? "Adicionado" : "Adicionar"}</span>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum serviço encontrado para “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Item selecionado ----------------------------- */

function SelectedItemCard({
  item,
  index,
  onPatch,
  onRemove,
}: {
  item: SelectedItem;
  index: number;
  onPatch: (patch: Partial<SelectedItem>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  const result = evaluateFormula(item.formula);

  const patchExtra = (id: string, patch: Partial<SelectedItem["extras"][number]>) =>
    onPatch({ extras: item.extras.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background">
      <header className="flex items-start gap-2 p-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
        >
          <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-sm font-semibold leading-snug text-foreground">
            <span className="mr-1.5 font-mono text-xs text-muted-foreground">{index + 1}.</span>
            {item.name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono">
              base {item.baseUnit}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 font-semibold tabular-nums",
                result !== null
                  ? "bg-budget-positive-bg text-budget-positive"
                  : "bg-budget-warning-bg text-budget-warning",
              )}
            >
              {result !== null ? `${formatNumber(result)} ${item.unit}` : "quantidade pendente"}
            </span>
            {item.extras.length > 0 && <span>{item.extras.length} campo(s) extra</span>}
            {item.photos > 0 && <span>{item.photos} foto(s)</span>}
          </p>
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${item.name}`}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </header>

      {open && (
        <div className="space-y-4 border-t border-border/70 p-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
            <FormulaField
              label="Qtde / fórmula"
              value={item.formula}
              onChange={(formula) => onPatch({ formula })}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Medida
              </label>
              <UnitSelect value={item.unit} onChange={(unit) => onPatch({ unit })} />
            </div>
          </div>

          {/* Campos extras */}
          <div className="rounded-xl border border-border/70 bg-secondary/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Calculator className="size-3.5" />
                Campos extras de medição
              </h4>
              <button
                type="button"
                onClick={() =>
                  onPatch({
                    extras: [
                      ...item.extras,
                      { id: uid(), label: "", formula: "", unit: item.unit },
                    ],
                  })
                }
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground active:scale-95"
              >
                <Plus className="size-3.5" />
                Adicionar campo
              </button>
            </div>

            {item.extras.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Use para medir trechos separados (ex.: fachada norte, fachada sul).
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {item.extras.map((extra) => (
                  <li key={extra.id} className="rounded-lg border border-border bg-background p-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={extra.label}
                        onChange={(e) => patchExtra(extra.id, { label: e.target.value })}
                        placeholder="Nome do trecho"
                        className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <UnitSelect
                        value={extra.unit}
                        onChange={(unit) => patchExtra(extra.id, { unit })}
                        className="h-11"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onPatch({ extras: item.extras.filter((e) => e.id !== extra.id) })
                        }
                        aria-label="Remover campo extra"
                        className="grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <FormulaField
                        value={extra.formula}
                        onChange={(formula) => patchExtra(extra.id, { formula })}
                        placeholder="Fórmula do trecho"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <textarea
            value={item.notes}
            onChange={(e) => onPatch({ notes: e.target.value })}
            rows={2}
            placeholder="Observações do item"
            className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onPatch({ photos: item.photos + 1 })}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-sm font-semibold text-foreground active:scale-95"
            >
              <Camera className="size-4" />
              Tirar foto
              {item.photos > 0 && (
                <span className="rounded-md bg-primary/15 px-1.5 text-xs tabular-nums text-primary">
                  {item.photos}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onPatch({ photos: item.photos + 1 })}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-sm font-semibold text-foreground active:scale-95"
            >
              <ImageIcon className="size-4" />
              Galeria
            </button>
            <button
              type="button"
              onClick={() => onPatch({ audios: item.audios + 1 })}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-sm font-semibold text-foreground active:scale-95"
            >
              <Mic className="size-4" />
              Áudio
              {item.audios > 0 && (
                <span className="rounded-md bg-primary/15 px-1.5 text-xs tabular-nums text-primary">
                  {item.audios}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* --------------------------------- Tela -------------------------------- */

export function VisitChecklist() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [pane, setPane] = useState<"catalogo" | "selecionados">("catalogo");
  const [dragOver, setDragOver] = useState(false);

  const selectedIds = useMemo(() => new Set(items.map((i) => i.serviceId)), [items]);
  const pending = items.filter((i) => evaluateFormula(i.formula) === null).length;

  const addService = (service: CatalogService, categoryId: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: uid(),
        serviceId: service.id,
        categoryId,
        name: service.name,
        baseUnit: service.baseUnit,
        formula: "",
        unit: service.baseUnit,
        extras: [],
        notes: "",
        photos: 0,
        audios: 0,
      },
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const data = e.dataTransfer.getData("application/x-servico");
    if (!data) return;
    const { serviceId, categoryId } = JSON.parse(data) as {
      serviceId: string;
      categoryId: string;
    };
    const service = catalog
      .find((c) => c.id === categoryId)
      ?.services.find((s) => s.id === serviceId);
    if (service) addService(service, categoryId);
  };

  return (
    <div className="flex h-[calc(100svh-49px)] flex-col bg-background">
      {/* Barra superior */}
      <header className="shrink-0 border-b border-border bg-card px-3 py-3 sm:px-5">
        <div className="mx-auto grid max-w-[1700px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
              Checklist da visita · Condomínio Berlim
            </h1>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">VIS-2041</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 font-semibold tabular-nums text-secondary-foreground">
                <ListChecks className="size-3" />
                {items.length} item(ns)
              </span>
              {pending > 0 && (
                <span className="rounded-md bg-budget-warning-bg px-1.5 py-0.5 font-semibold text-budget-warning">
                  {pending} sem quantidade
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm active:scale-95"
          >
            <Save className="size-4" />
            <span className="hidden sm:inline">Salvar visita</span>
          </button>
        </div>

        {/* Alternador de painel — tablets em retrato e celulares */}
        <div className="mx-auto mt-3 grid max-w-[1700px] grid-cols-2 gap-1 rounded-xl bg-secondary p-1 lg:hidden">
          {(
            [
              ["catalogo", "Catálogo"],
              ["selecionados", `Selecionados (${items.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPane(key)}
              className={cn(
                "h-11 rounded-lg text-sm font-semibold transition-colors",
                pane === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Painéis */}
      <div className="mx-auto grid min-h-0 w-full max-w-[1700px] flex-1 grid-cols-1 gap-3 p-3 sm:px-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section
          className={cn(
            "min-h-0 flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-3",
            pane === "catalogo" ? "flex" : "hidden",
            "lg:flex",
          )}
        >
          <h2 className="sr-only">Catálogo de serviços</h2>
          <CatalogPane
            query={query}
            setQuery={setQuery}
            selectedIds={selectedIds}
            onAdd={addService}
          />
        </section>

        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "min-h-0 flex-col overflow-y-auto overscroll-contain rounded-2xl border bg-card p-3 transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border",
            pane === "selecionados" ? "flex" : "hidden",
            "lg:flex",
          )}
        >
          <div className="sticky top-0 z-10 -mx-3 mb-2 flex items-center justify-between gap-2 bg-card/95 px-3 pb-2 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Itens selecionados
              <span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {items.length}
              </span>
            </h2>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setItems([])}
                className="h-10 rounded-lg px-3 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="grid flex-1 place-items-center rounded-xl border-2 border-dashed border-border p-8 text-center">
              <div className="max-w-xs">
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
                  <ListChecks className="size-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Nenhum serviço selecionado
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toque em <strong className="text-foreground">Adicionar</strong> no catálogo — ou
                  arraste um serviço para cá — para começar a medir.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={item.id}>
                  <SelectedItemCard
                    item={item}
                    index={index}
                    onPatch={(patch) =>
                      setItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)),
                      )
                    }
                    onRemove={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
