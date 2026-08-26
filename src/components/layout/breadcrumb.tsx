"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { labelForSegment } from "@/lib/navigation";

type BreadcrumbProps = {
  root: string;
};

export function Breadcrumb({ root }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Trilha de navegação" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        <li className="hidden shrink-0 text-muted-foreground sm:block">{root}</li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight
                aria-hidden
                className="hidden size-3.5 shrink-0 text-muted-foreground/50 sm:block"
              />
              {isLast ? (
                <span className="truncate font-medium text-foreground" aria-current="page">
                  {labelForSegment(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {labelForSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
