import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O overlay colide com a UI real nos dois cantos de baixo: à esquerda com o
  // "Recolher" da sidebar, à direita com o botão do assistente. Erros de build
  // e de runtime continuam sendo exibidos normalmente sem ele.
  devIndicators: false,
};

export default nextConfig;
