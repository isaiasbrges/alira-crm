import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O padrão (bottom-left) fica por cima do rodapé da sidebar em dev.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
