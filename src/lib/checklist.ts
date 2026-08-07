export interface CatalogService {
  id: string;
  code: string;
  name: string;
  baseUnit: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  services: CatalogService[];
}

export interface ExtraField {
  id: string;
  label: string;
  formula: string;
  unit: string;
}

export interface SelectedItem {
  id: string;
  serviceId: string;
  categoryId: string;
  name: string;
  baseUnit: string;
  formula: string;
  unit: string;
  extras: ExtraField[];
  notes: string;
  photos: number;
  audios: number;
}

export const UNITS = ["un", "m", "m²", "m³", "vb", "kg", "h"] as const;

/** Avalia fórmulas simples: números, + - * / ( ) e vírgula decimal. */
export function evaluateFormula(input: string): number | null {
  const raw = input.trim().replace(/^=/, "").replace(/,/g, ".");
  if (!raw) return null;
  if (!/^[0-9+\-*/().\s]+$/.test(raw)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${raw})`)() as unknown;
    return typeof result === "number" && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

export function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export const catalog: CatalogCategory[] = [
  {
    id: "retrofit",
    name: "Projeto executivo (retrofit fachada)",
    services: [
      { id: "rf-1", code: "PE-101", name: "Levantamento cadastral da fachada", baseUnit: "m²" },
      { id: "rf-2", code: "PE-102", name: "Projeto executivo de revestimento", baseUnit: "m²" },
      { id: "rf-3", code: "PE-103", name: "Detalhamento de juntas e rufos", baseUnit: "m" },
    ],
  },
  {
    id: "portaria",
    name: "Projeto executivo (portaria)",
    services: [
      { id: "pt-1", code: "PE-201", name: "Aprovação junto à prefeitura (se necessário)", baseUnit: "vb" },
      { id: "pt-2", code: "PE-202", name: "Maquete eletrônica (3D para esclarecimento de dúvidas)", baseUnit: "vb" },
      { id: "pt-3", code: "PE-203", name: "Projeto executivo (plantas baixas, cortes, fachadas, materiais, cotas)", baseUnit: "vb" },
    ],
  },
  {
    id: "eletrica",
    name: "Projeto executivo (revisão elétrica)",
    services: [
      { id: "el-1", code: "EL-301", name: "Diagnóstico de quadros de distribuição", baseUnit: "un" },
      { id: "el-2", code: "EL-302", name: "Projeto de reestruturação de prumadas", baseUnit: "m" },
      { id: "el-3", code: "EL-303", name: "Laudo de SPDA", baseUnit: "vb" },
      { id: "el-4", code: "EL-304", name: "Adequação de iluminação de emergência", baseUnit: "un" },
    ],
  },
  {
    id: "solar",
    name: "Projeto executivo (energia solar)",
    services: [
      { id: "so-1", code: "SO-401", name: "Dimensionamento de geração fotovoltaica", baseUnit: "kWp" },
      { id: "so-2", code: "SO-402", name: "Projeto de fixação em laje", baseUnit: "m²" },
      { id: "so-3", code: "SO-403", name: "Homologação junto à concessionária", baseUnit: "vb" },
    ],
  },
  {
    id: "pintura",
    name: "Pintura",
    services: [
      { id: "pi-1", code: "PI-501", name: "Pintura acrílica de fachada", baseUnit: "m²" },
      { id: "pi-2", code: "PI-502", name: "Textura acrílica projetada", baseUnit: "m²" },
      { id: "pi-3", code: "PI-503", name: "Pintura de esquadrias metálicas", baseUnit: "m²" },
      { id: "pi-4", code: "PI-504", name: "Pintura epóxi de garagem", baseUnit: "m²" },
    ],
  },
  {
    id: "lambril",
    name: "Lambril sacadas",
    services: [
      { id: "la-1", code: "LA-601", name: "Instalação de lambril em ACM", baseUnit: "m²" },
      { id: "la-2", code: "LA-602", name: "Remoção de lambril existente", baseUnit: "m²" },
    ],
  },
  {
    id: "quadra",
    name: "Quadra poliesportiva",
    services: [
      { id: "qu-1", code: "QU-701", name: "Recuperação de piso esportivo", baseUnit: "m²" },
      { id: "qu-2", code: "QU-702", name: "Pintura de demarcação", baseUnit: "m²" },
      { id: "qu-3", code: "QU-703", name: "Instalação de alambrado", baseUnit: "m" },
    ],
  },
  {
    id: "fachadas",
    name: "Fachadas",
    services: [
      { id: "fa-1", code: "FA-801", name: "Tratamento de trincas e fissuras", baseUnit: "m" },
      { id: "fa-2", code: "FA-802", name: "Recuperação estrutural de sacadas", baseUnit: "m²" },
      { id: "fa-3", code: "FA-803", name: "Impermeabilização de platibanda", baseUnit: "m²" },
      { id: "fa-4", code: "FA-804", name: "Lavagem de fachada com hidrojato", baseUnit: "m²" },
    ],
  },
  {
    id: "protecoes",
    name: "Proteções",
    services: [
      { id: "pr-1", code: "PR-901", name: "Tela de proteção em sacadas", baseUnit: "m²" },
      { id: "pr-2", code: "PR-902", name: "Bandeja de proteção primária", baseUnit: "m" },
    ],
  },
];

export const categoryById = new Map(catalog.map((c) => [c.id, c]));
