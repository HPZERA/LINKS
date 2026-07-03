"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PeriodPreset } from "@/types/domain";

const PRESET_LABELS: Record<Exclude<PeriodPreset, "custom">, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
  "90d": "90 dias",
};

export function PeriodFilter({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get("period") as PeriodPreset | null) ?? "7d";

  const [range, setRange] = useState<DayPickerRange | undefined>(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    return from && to ? { from: new Date(from), to: new Date(to) } : undefined;
  });

  function applyPreset(period: Exclude<PeriodPreset, "custom">) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    params.delete("from");
    params.delete("to");
    router.push(`${basePath}?${params.toString()}`);
  }

  function applyCustomRange(nextRange: DayPickerRange | undefined) {
    setRange(nextRange);
    if (!nextRange?.from || !nextRange?.to) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("period", "custom");
    params.set("from", nextRange.from.toISOString());
    params.set("to", nextRange.to.toISOString());
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={currentPeriod === "custom" ? "custom" : currentPeriod}>
        <TabsList>
          {(Object.keys(PRESET_LABELS) as Array<keyof typeof PRESET_LABELS>).map((preset) => (
            <TabsTrigger key={preset} value={preset} onClick={() => applyPreset(preset)}>
              {PRESET_LABELS[preset]}
            </TabsTrigger>
          ))}
          <Popover>
            <PopoverTrigger
              render={
                <TabsTrigger value="custom">
                  <CalendarIcon className="size-3.5" />
                  {range?.from && range?.to
                    ? `${format(range.from, "dd/MM", { locale: ptBR })} - ${format(range.to, "dd/MM", { locale: ptBR })}`
                    : "Personalizado"}
                </TabsTrigger>
              }
            />
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={range} onSelect={applyCustomRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </TabsList>
      </Tabs>
    </div>
  );
}
