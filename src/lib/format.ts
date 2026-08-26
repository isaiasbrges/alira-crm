const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const BRL_CENTS = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const NUMBER = new Intl.NumberFormat("pt-BR");

const DATE = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatCurrency(value: number, comCentavos = false): string {
  return (comCentavos ? BRL_CENTS : BRL).format(value);
}

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export function formatPercent(value: number, casas = 1): string {
  return `${value.toFixed(casas).replace(".", ",")}%`;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return DATE.format(date);
}

export function formatDelta(value: number): string {
  const sinal = value > 0 ? "+" : "";
  return `${sinal}${value.toFixed(1).replace(".", ",")}%`;
}

export function initials(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}
