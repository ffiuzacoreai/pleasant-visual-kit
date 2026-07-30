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

export const NF_RATE = 0.14;
export const ROY_RATE = 0.08;
const TAX_RATE = NF_RATE + ROY_RATE;

export type EditableField = "quantity" | "unitPrice" | "matUnit" | "moUnit";

export function recalcItem(item: ServiceItem): ServiceItem {
  const total = item.quantity * item.unitPrice;
  const matTotal = item.quantity * item.matUnit;
  const moTotal = item.quantity * item.moUnit;
  const nf = total * NF_RATE;
  const roy = total * ROY_RATE;
  const balance = total - matTotal - moTotal - nf - roy;

  return {
    ...item,
    total,
    matTotal,
    moTotal,
    nf,
    roy,
    balance,
    profitPercent: total > 0 ? (balance / total) * 100 : 0,
  };
}

export function updateItemField(
  sections: ServiceSection[],
  itemId: string,
  field: EditableField,
  value: number
): ServiceSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.id === itemId ? recalcItem({ ...item, [field]: value }) : item
    ),
  }));
}

/** Reprecifica todos os itens para atingir a margem de lucro alvo (em %). */
export function applyTargetMargin(
  sections: ServiceSection[],
  targetPercent: number
): ServiceSection[] {
  const margin = targetPercent / 100;
  const denominator = 1 - TAX_RATE - margin;

  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const cost = item.quantity * (item.matUnit + item.moUnit);
      if (denominator <= 0 || item.quantity <= 0 || cost <= 0) return item;
      const total = cost / denominator;
      return recalcItem({ ...item, unitPrice: total / item.quantity });
    }),
  }));
}

export interface BudgetTotals {
  total: number;
  material: number;
  labor: number;
  balance: number;
  profitPercent: number;
}

export function computeTotals(sections: ServiceSection[]): BudgetTotals {
  const flat = sections.flatMap((s) => s.items);
  const total = flat.reduce((acc, i) => acc + i.total, 0);
  const material = flat.reduce((acc, i) => acc + i.matTotal, 0);
  const labor = flat.reduce((acc, i) => acc + i.moTotal, 0);
  const balance = flat.reduce((acc, i) => acc + i.balance, 0);

  return {
    total,
    material,
    labor,
    balance,
    profitPercent: total > 0 ? (balance / total) * 100 : 0,
  };
}

export function cloneSections(sections: ServiceSection[]): ServiceSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }));
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}
