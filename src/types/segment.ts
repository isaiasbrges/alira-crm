export type SegmentField =
  | "status"
  | "cidade"
  | "categoria"
  | "tamanho"
  | "ticketMedio"
  | "diasSemComprar"
  | "vendedor"
  | "tag"
  | "whatsappAutorizado";

export type SegmentOperator = "igual" | "diferente" | "contem" | "maior" | "menor";

export type SegmentRule = {
  id: string;
  campo: SegmentField;
  operador: SegmentOperator;
  valor: string;
};

/** Regra plana com AND/OR único — o construtor por grupos aninhados fica para depois. */
export type SegmentLogic = "AND" | "OR";

export type Segment = {
  id: string;
  nome: string;
  descricao?: string;
  logica: SegmentLogic;
  regras: SegmentRule[];
  createdAt: string;
};

type FieldConfig = {
  label: string;
  tipo: "selecao" | "texto" | "numero" | "booleano";
  operadores: SegmentOperator[];
  /** Só para campos de seleção — as opções vêm de fora (categorias, vendedores, tags). */
  opcoesDinamicas?: boolean;
};

export const SEGMENT_FIELDS: Record<SegmentField, FieldConfig> = {
  status: { label: "Status", tipo: "selecao", operadores: ["igual", "diferente"] },
  cidade: { label: "Cidade", tipo: "texto", operadores: ["igual", "diferente"] },
  categoria: {
    label: "Categoria comprada",
    tipo: "selecao",
    operadores: ["contem"],
    opcoesDinamicas: true,
  },
  tamanho: { label: "Tamanho (camiseta)", tipo: "texto", operadores: ["igual"] },
  ticketMedio: { label: "Ticket médio (R$)", tipo: "numero", operadores: ["maior", "menor"] },
  diasSemComprar: { label: "Dias sem comprar", tipo: "numero", operadores: ["maior", "menor"] },
  vendedor: {
    label: "Vendedor responsável",
    tipo: "selecao",
    operadores: ["igual"],
    opcoesDinamicas: true,
  },
  tag: { label: "Tag", tipo: "selecao", operadores: ["contem"], opcoesDinamicas: true },
  whatsappAutorizado: {
    label: "WhatsApp autorizado",
    tipo: "booleano",
    operadores: ["igual"],
  },
};

export const OPERATOR_LABEL: Record<SegmentOperator, string> = {
  igual: "é igual a",
  diferente: "é diferente de",
  contem: "contém",
  maior: "maior que",
  menor: "menor que",
};
