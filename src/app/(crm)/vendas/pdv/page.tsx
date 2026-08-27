import type { Metadata } from "next";

import { PdvView } from "@/components/sales/pdv/pdv-view";

export const metadata: Metadata = {
  title: "PDV Lite · Alira CRM",
};

export default function PdvPage() {
  return <PdvView />;
}
