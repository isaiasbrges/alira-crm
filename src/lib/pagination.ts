/** Paginação client-side genérica, usada por toda tela em lista do CRM. */
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const inicio = (page - 1) * perPage;
  return items.slice(inicio, inicio + perPage);
}

export function totalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}
