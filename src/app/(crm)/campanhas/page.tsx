import type { Metadata } from "next";

import { CampaignsView } from "@/components/campaigns/campaigns-view";

export const metadata: Metadata = {
  title: "Campanhas · Alira CRM",
};

export default function CampanhasPage() {
  return <CampaignsView />;
}
