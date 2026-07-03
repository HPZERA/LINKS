"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { TimeSeriesPoint } from "@/services/analytics.service";

const chartConfig: ChartConfig = {
  count: {
    label: "Cliques",
    color: "var(--color-primary)",
  },
};

export function ClicksChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliques ao longo do tempo</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados para o período selecionado.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
