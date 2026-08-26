"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 absolute inset-x-0 top-1 justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "size-8 p-0 text-center text-sm relative focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        outside: "text-muted-foreground/50",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className="size-4" {...chevronProps} />
          ) : (
            <ChevronRightIcon className="size-4" {...chevronProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
