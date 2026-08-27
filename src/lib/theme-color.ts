/**
 * Deriva as variáveis CSS de destaque (botões, links, item ativo da sidebar)
 * a partir da cor de marca de uma loja. Sem cor definida, não gera nada — o
 * azul padrão do tema (`globals.css`) segue valendo.
 */

type CorHexRgb = { r: number; g: number; b: number };

function hexParaRgb(hex: string): CorHexRgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;

  const numero = parseInt(match[1], 16);
  return { r: (numero >> 16) & 255, g: (numero >> 8) & 255, b: numero & 255 };
}

/** Luminância relativa (WCAG) — decide se o texto em cima da cor é claro ou escuro. */
function luminanciaRelativa({ r, g, b }: CorHexRgb): number {
  const canal = (valor: number) => {
    const c = valor / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function variaveisCorDestaque(
  hex: string | null | undefined,
): Record<string, string> {
  const rgb = hex ? hexParaRgb(hex) : null;
  if (!rgb) return {};

  const corSolida = `#${[rgb.r, rgb.g, rgb.b]
    .map((valor) => valor.toString(16).padStart(2, "0"))
    .join("")}`;
  const foreground = luminanciaRelativa(rgb) > 0.6 ? "#101828" : "#ffffff";

  return {
    "--primary": corSolida,
    "--primary-foreground": foreground,
    "--ring": corSolida,
    "--accent": `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 0.08)`,
    "--accent-foreground": corSolida,
    "--sidebar-primary": corSolida,
    "--sidebar-primary-foreground": foreground,
    "--sidebar-ring": corSolida,
  };
}

/**
 * A mesma sobreposição, como uma regra `:root` pronta pra um `<style>`
 * no servidor. Aplicar no `:root` (em vez de um wrapper no meio da árvore)
 * é o que garante que conteúdo em portal — Dialog, Select, DropdownMenu,
 * o menu mobile — também herde a cor: eles renderizam fora do AppShell,
 * direto no fim do `<body>`, então só um ancestral real de verdade alcança os dois.
 *
 * `hex` só chega aqui depois de validado contra `/^#[0-9A-Fa-f]{6}$/` no
 * server action que grava — por isso é seguro interpolar direto na string.
 */
export function regraCssCorDestaque(hex: string | null | undefined): string {
  const vars = variaveisCorDestaque(hex);
  const entradas = Object.entries(vars);
  if (entradas.length === 0) return "";

  const declaracoes = entradas.map(([nome, valor]) => `${nome}:${valor};`).join("");
  return `:root{${declaracoes}}`;
}
