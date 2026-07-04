import Link from "next/link";
import { Download } from "lucide-react";
import { getClicksInRange, getPeriodRange } from "@/services/analytics.service";
import { listLinks } from "@/services/link.service";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { LinkFilter } from "@/components/clicks/link-filter";
import { ClicksTable } from "@/components/clicks/clicks-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PeriodPreset } from "@/types/domain";

const PAGE_SIZE = 50;

export default async function ClicksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const period = (params.period as PeriodPreset) ?? "7d";
  const page = Number(params.page ?? "1") || 1;

  const range = getPeriodRange(
    period,
    params.from && params.to ? { from: new Date(params.from), to: new Date(params.to) } : undefined,
  );

  const [{ rows, total }, links] = await Promise.all([
    getClicksInRange({
      from: range.from,
      to: range.to,
      linkId: params.linkId,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    listLinks(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams(params as Record<string, string>);
    query.set("page", String(targetPage));
    return `/admin/clicks?${query.toString()}`;
  };

  const exportQuery = new URLSearchParams();
  if (params.period) exportQuery.set("period", params.period);
  if (params.from) exportQuery.set("from", params.from);
  if (params.to) exportQuery.set("to", params.to);
  if (params.linkId) exportQuery.set("linkId", params.linkId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cliques</h1>
          <p className="text-muted-foreground">Histórico detalhado de cliques nos seus links.</p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/admin/clicks/export?${exportQuery.toString()}`} />}
        >
          <Download className="size-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <LinkFilter links={links} basePath="/admin/clicks" />
        <PeriodFilter basePath="/admin/clicks" />
      </div>

      <Card>
        <CardContent>
          <ClicksTable clicks={rows} />
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page} de {totalPages} ({total} cliques)
          </span>
          <div className="flex gap-2">
            {page <= 1 ? (
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={buildPageHref(page - 1)} />}
              >
                Anterior
              </Button>
            )}
            {page >= totalPages ? (
              <Button variant="outline" size="sm" disabled>
                Próxima
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={buildPageHref(page + 1)} />}
              >
                Próxima
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
