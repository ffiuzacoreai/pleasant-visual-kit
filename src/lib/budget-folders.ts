export type BudgetStatus = "aprovado" | "rascunho" | "rejeitado";

export interface BudgetVersion {
  id: string;
  name: string;
  total: number;
  status: BudgetStatus;
  items: number;
  updatedAt: string;
}

export interface BudgetFolder {
  id: string;
  name: string;
  client?: string;
  updatedAt: string;
  budgets: BudgetVersion[];
}

export const budgetFolders: BudgetFolder[] = [
  {
    id: "berlim",
    name: "Condomínio Berlim",
    client: "Retrofit de fachada",
    updatedAt: "2026-08-05T14:20:00",
    budgets: [
      {
        id: "b1",
        name: "Orçamento inicial",
        total: 19528500,
        status: "aprovado",
        items: 9,
        updatedAt: "2026-08-05T14:20:00",
      },
    ],
  },
  {
    id: "edificio-testes",
    name: "Condomínio Edifício testes",
    client: "Pintura externa",
    updatedAt: "2026-08-04T09:10:00",
    budgets: [
      {
        id: "b2",
        name: "Orçamento inicial",
        total: 8420000,
        status: "aprovado",
        items: 7,
        updatedAt: "2026-08-04T09:10:00",
      },
      {
        id: "b3",
        name: "Rascunho 1",
        total: 8890000,
        status: "rascunho",
        items: 7,
        updatedAt: "2026-08-04T18:32:00",
      },
    ],
  },
  {
    id: "teste-novo",
    name: "teste teste novo",
    updatedAt: "2026-08-03T16:00:00",
    budgets: [
      {
        id: "b4",
        name: "Orçamento inicial",
        total: 1250000,
        status: "rascunho",
        items: 4,
        updatedAt: "2026-08-03T16:00:00",
      },
    ],
  },
  {
    id: "villa-lobos",
    name: "Condomínio Edifício Villa Lobos",
    client: "Impermeabilização",
    updatedAt: "2026-08-02T11:45:00",
    budgets: [
      {
        id: "b5",
        name: "Orçamento inicial",
        total: 6320000,
        status: "rejeitado",
        items: 11,
        updatedAt: "2026-08-02T11:45:00",
      },
    ],
  },
  {
    id: "teste-123",
    name: "teste 123",
    client: "Fachada + telhado",
    updatedAt: "2026-07-30T10:05:00",
    budgets: [
      {
        id: "b6",
        name: "Orçamento inicial",
        total: 19528500,
        status: "aprovado",
        items: 9,
        updatedAt: "2026-07-29T10:05:00",
      },
      {
        id: "b7",
        name: "Rascunho 1",
        total: 19528587.1,
        status: "rascunho",
        items: 9,
        updatedAt: "2026-07-30T10:05:00",
      },
      {
        id: "b8",
        name: "Rascunho 2",
        total: 22930671.14,
        status: "rascunho",
        items: 9,
        updatedAt: "2026-07-30T12:41:00",
      },
      {
        id: "b9",
        name: "Rascunho 3",
        total: 19528500,
        status: "rascunho",
        items: 9,
        updatedAt: "2026-07-30T15:03:00",
      },
    ],
  },
  {
    id: "pinheiros",
    name: "Edifício Pinheiros",
    updatedAt: "2026-07-28T08:30:00",
    budgets: [
      {
        id: "b10",
        name: "Orçamento inicial",
        total: 4210000,
        status: "rascunho",
        items: 5,
        updatedAt: "2026-07-28T08:30:00",
      },
    ],
  },
  {
    id: "teste123",
    name: "teste123",
    updatedAt: "2026-07-27T17:12:00",
    budgets: [
      {
        id: "b11",
        name: "Orçamento inicial",
        total: 980000,
        status: "rascunho",
        items: 3,
        updatedAt: "2026-07-27T17:12:00",
      },
    ],
  },
  {
    id: "soberano",
    name: "Condomínio Soberano",
    client: "Retrofit completo",
    updatedAt: "2026-07-26T13:00:00",
    budgets: [
      {
        id: "b12",
        name: "Orçamento inicial",
        total: 15400000,
        status: "aprovado",
        items: 12,
        updatedAt: "2026-07-26T13:00:00",
      },
    ],
  },
];

export function findFolder(id: string) {
  return budgetFolders.find((f) => f.id === id);
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ontem" : `há ${d} dias`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}
