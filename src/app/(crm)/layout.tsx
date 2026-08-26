import { AppShell } from "@/components/layout/app-shell";

export default function CrmLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
