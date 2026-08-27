export function LoginScreen({
  subtitulo,
  children,
}: {
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Alira
            </span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              CRM
            </span>
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Entrar</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
