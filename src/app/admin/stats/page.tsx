import { getPeriodRange, getStatsBreakdown } from "@/services/analytics.service";
import { listLinks } from "@/services/link.service";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { LinkFilter } from "@/components/clicks/link-filter";
import { ClicksChart } from "@/components/dashboard/clicks-chart";
import { BreakdownList } from "@/components/dashboard/breakdown-list";
import type { PeriodPreset } from "@/types/domain";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const period = (params.period as PeriodPreset) ?? "7d";

  const range = getPeriodRange(
    period,
    params.from && params.to ? { from: new Date(params.from), to: new Date(params.to) } : undefined,
  );

  const [{ timeSeries, byDevice, byCountry }, links] = await Promise.all([
    getStatsBreakdown(range, params.linkId),
    listLinks(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Estatísticas</h1>
        <p className="text-muted-foreground">Visão agregada de dispositivos, países e volume de cliques.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <LinkFilter links={links} basePath="/admin/stats" />
        <PeriodFilter basePath="/admin/stats" />
      </div>

      <ClicksChart data={timeSeries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownList title="Por dispositivo" items={byDevice} />
        <BreakdownList title="Por país" items={byCountry} />
      </div>
    </div>
  );
}
