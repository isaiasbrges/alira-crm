import type { Metadata } from "next";

import { SegmentsView } from "@/components/segments/segments-view";

export const metadata: Metadata = {
  title: "Segmentos · Alira CRM",
};

export default function SegmentosPage() {
  return <SegmentsView />;
}
