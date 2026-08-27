import type { Customer } from "@/types/customer";
import type { Segment, SegmentRule } from "@/types/segment";

function diasDesde(data: string | undefined, referencia: Date): number {
  if (!data) return Number.POSITIVE_INFINITY;
  const diff = referencia.getTime() - new Date(data).getTime();
  return Math.floor(diff / 86_400_000);
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Avalia uma regra contra um cliente.
 *
 * É a mesma função usada no preview do construtor e, futuramente, na
 * resolução real de destinatários de campanha — o preview não é decorativo,
 * é a própria lógica de segmentação rodando contra os clientes carregados.
 */
export function avaliarRegra(cliente: Customer, regra: SegmentRule, referencia = new Date()): boolean {
  const valor = normalizar(regra.valor);
  if (!valor) return true;

  switch (regra.campo) {
    case "status":
      return regra.operador === "diferente"
        ? cliente.status !== regra.valor
        : cliente.status === regra.valor;

    case "cidade": {
      const igual = normalizar(cliente.cidade) === valor;
      return regra.operador === "diferente" ? !igual : igual;
    }

    case "categoria":
      return cliente.preferencias.categorias.some((categoria) => normalizar(categoria) === valor);

    case "tamanho":
      return normalizar(cliente.tamanhos.camiseta ?? "") === valor;

    case "ticketMedio": {
      const alvo = Number(regra.valor);
      if (Number.isNaN(alvo)) return true;
      return regra.operador === "maior" ? cliente.ticketMedio > alvo : cliente.ticketMedio < alvo;
    }

    case "diasSemComprar": {
      const alvo = Number(regra.valor);
      if (Number.isNaN(alvo)) return true;
      const dias = diasDesde(cliente.ultimaCompra, referencia);
      return regra.operador === "maior" ? dias > alvo : dias < alvo;
    }

    case "vendedor":
      return cliente.vendedorId === regra.valor;

    case "tag":
      return cliente.tags.some((tag) => tag.id === regra.valor);

    case "whatsappAutorizado":
      return cliente.consentimentoWhatsapp === (regra.valor === "sim");

    default:
      return true;
  }
}

export function resolverSegmento(
  clientes: Customer[],
  regras: SegmentRule[],
  logica: "AND" | "OR",
  referencia = new Date()
): Customer[] {
  if (regras.length === 0) return clientes;

  return clientes.filter((cliente) => {
    const avaliacoes = regras.map((regra) => avaliarRegra(cliente, regra, referencia));
    return logica === "AND" ? avaliacoes.every(Boolean) : avaliacoes.some(Boolean);
  });
}

export function contarClientesDoSegmento(clientes: Customer[], segmento: Pick<Segment, "regras" | "logica">): number {
  return resolverSegmento(clientes, segmento.regras, segmento.logica).length;
}
