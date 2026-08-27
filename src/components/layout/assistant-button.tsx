import { Sparkles } from "lucide-react";

/**
 * Atalho flutuante para o assistente.
 *
 * Ainda sem destino — entra junto com o Alira Insights.
 */
export function AssistantButton() {
  return (
    <button
      type="button"
      aria-label="Abrir assistente Alira"
      className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-600/25 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <Sparkles className="size-5" />
    </button>
  );
}
