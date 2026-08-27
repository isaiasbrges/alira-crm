import type { Product } from "@/types/product";

const TAMANHOS = ["P", "M", "G", "GG"];
const CORES = ["Preto", "Bege", "Vinho"];

function gerarVariantes(sku: string, estoques: number[]): Product["variantes"] {
  const variantes: Product["variantes"] = [];
  let indice = 0;

  for (const tamanho of TAMANHOS.slice(0, 3)) {
    for (const cor of CORES.slice(0, 2)) {
      variantes.push({
        id: `${sku}-${tamanho}-${cor}`,
        tamanho,
        cor,
        sku: `${sku}-${tamanho.slice(0, 1)}${cor.slice(0, 2).toUpperCase()}`,
        estoque: estoques[indice % estoques.length],
      });
      indice += 1;
    }
  }

  return variantes;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    nome: "Vestido Midi Alfaiataria",
    sku: "VM-MIDI-01",
    categoria: "Vestidos",
    colecao: "Inverno 2026",
    preco: 349,
    status: "ativo",
    variantes: gerarVariantes("VM01", [8, 12, 3, 0, 6, 2]),
  },
  {
    id: "prod-2",
    nome: "Blazer Estruturado",
    sku: "BL-EST-02",
    categoria: "Alfaiataria",
    colecao: "Inverno 2026",
    preco: 489,
    status: "ativo",
    variantes: gerarVariantes("BL02", [4, 1, 9, 5, 0, 7]),
  },
  {
    id: "prod-3",
    nome: "Calça Pantalona",
    sku: "CP-PANT-03",
    categoria: "Alfaiataria",
    colecao: "Inverno 2026",
    preco: 279,
    status: "ativo",
    variantes: gerarVariantes("CP03", [15, 10, 8, 4, 2, 6]),
  },
  {
    id: "prod-4",
    nome: "Tricô Gola Alta",
    sku: "TR-GOLA-04",
    categoria: "Malhas",
    colecao: "Inverno 2026",
    preco: 219,
    status: "ativo",
    variantes: gerarVariantes("TR04", [3, 0, 5, 1, 0, 2]),
  },
  {
    id: "prod-5",
    nome: "Camisa Seda Estampada",
    sku: "CS-SEDA-05",
    categoria: "Camisaria",
    colecao: "Verão 2026",
    preco: 259,
    status: "inativo",
    variantes: gerarVariantes("CS05", [0, 0, 2, 0, 1, 0]),
  },
  {
    id: "prod-6",
    nome: "Jeans Reto Cintura Alta",
    sku: "JN-RETO-06",
    categoria: "Jeans",
    colecao: "Coleção contínua",
    preco: 299,
    status: "ativo",
    variantes: gerarVariantes("JN06", [11, 14, 9, 7, 5, 3]),
  },
  {
    id: "prod-7",
    nome: "Vestido de Festa Bordado",
    sku: "VF-BORD-07",
    categoria: "Festa",
    colecao: "Cápsula Verão",
    preco: 689,
    status: "ativo",
    variantes: gerarVariantes("VF07", [2, 1, 0, 3, 1, 0]),
  },
  {
    id: "prod-8",
    nome: "Saia Midi Plissada",
    sku: "SM-PLIS-08",
    categoria: "Saias",
    colecao: "Verão 2026",
    preco: 229,
    status: "arquivado",
    variantes: gerarVariantes("SM08", [0, 0, 0, 0, 0, 0]),
  },
];

export const PRODUCT_CATEGORIES = Array.from(
  new Set(MOCK_PRODUCTS.map((produto) => produto.categoria))
).sort();
