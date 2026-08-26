export function PageHeader({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] lg:text-[28px]">
          {titulo}
        </h1>
        {descricao && (
          <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
        )}
      </div>

      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
