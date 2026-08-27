import type { Tint } from "@/types/dashboard";

/** Fundo pastel + cor do ícone, na mesma família usada nos indicadores. */
export const TINT_CLASSES: Record<Tint, string> = {
  blue: "bg-tint-blue text-tint-blue-fg",
  violet: "bg-tint-violet text-tint-violet-fg",
  amber: "bg-tint-amber text-tint-amber-fg",
  green: "bg-tint-green text-tint-green-fg",
};
