import type { Customer, CustomerFilters } from "@/types/customer";

export type CustomerKpis = {
  total: number;
  ativos: number;
  inativos: number;
  vip: number;
  comWhatsapp: number;
};

export function buildCustomerKpis(customers: Customer[]): CustomerKpis {
  return customers.reduce<CustomerKpis>(
    (acc, customer) => {
      acc.total += 1;
      if (customer.status === "ativo") acc.ativos += 1;
      if (customer.status === "inativo") acc.inativos += 1;
      if (customer.status === "vip") acc.vip += 1;
      if (customer.consentimentoWhatsapp) acc.comWhatsapp += 1;
      return acc;
    },
    { total: 0, ativos: 0, inativos: 0, vip: 0, comWhatsapp: 0 }
  );
}

function diasDesde(data: string | undefined, referencia: Date): number {
  if (!data) return Number.POSITIVE_INFINITY;
  const diff = referencia.getTime() - new Date(data).getTime();
  return Math.floor(diff / 86_400_000);
}

const JANELAS_ULTIMA_COMPRA: Record<string, number> = {
  "30-dias": 30,
  "90-dias": 90,
  "180-dias": 180,
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterCustomers(
  customers: Customer[],
  filters: CustomerFilters,
  referencia = new Date()
): Customer[] {
  const busca = normalizar(filters.busca.trim());

  return customers.filter((customer) => {
    if (busca) {
      const alvo = normalizar(
        `${customer.nome} ${customer.whatsapp} ${customer.email ?? ""} ${customer.cidade}`
      );
      if (!alvo.includes(busca)) return false;
    }

    if (filters.status !== "todos" && customer.status !== filters.status) return false;

    if (
      filters.categoria !== "todas" &&
      !customer.preferencias.categorias.includes(filters.categoria)
    ) {
      return false;
    }

    if (filters.tamanho !== "todos" && customer.tamanhos.camiseta !== filters.tamanho) {
      return false;
    }

    if (filters.vendedor !== "todos" && customer.vendedorId !== filters.vendedor) {
      return false;
    }

    if (filters.cidade !== "todas" && customer.cidade !== filters.cidade) return false;

    if (filters.tag !== "todas" && !customer.tags.some((tag) => tag.id === filters.tag)) {
      return false;
    }

    const janela = JANELAS_ULTIMA_COMPRA[filters.ultimaCompra];
    if (janela && diasDesde(customer.ultimaCompra, referencia) > janela) return false;

    if (
      filters.ultimaCompra === "sem-compra" &&
      diasDesde(customer.ultimaCompra, referencia) <= 180
    ) {
      return false;
    }

    return true;
  });
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const inicio = (page - 1) * perPage;
  return items.slice(inicio, inicio + perPage);
}

export function totalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}
