import type { NextRequest } from "next/server";
import { getClicksInRange, getPeriodRange } from "@/services/analytics.service";
import { toCsv } from "@/utils/csv";
import { formatDateTime } from "@/utils/format";
import type { ClickDTO, PeriodPreset } from "@/types/domain";

export const dynamic = "force-dynamic";

// Teto de linhas exportadas por vez — evita uma exportação gigante travar a
// função. Para históricos maiores, exporte por períodos menores.
const EXPORT_ROW_LIMIT = 20_000;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const period = (params.get("period") as PeriodPreset | null) ?? "7d";
  const from = params.get("from");
  const to = params.get("to");
  const linkId = params.get("linkId") ?? undefined;

  const range = getPeriodRange(period, from && to ? { from: new Date(from), to: new Date(to) } : undefined);

  const { rows } = await getClicksInRange({
    from: range.from,
    to: range.to,
    linkId,
    limit: EXPORT_ROW_LIMIT,
    offset: 0,
  });

  const csv = toCsv<ClickDTO>(rows, [
    { header: "Slug", value: (c) => c.linkSlug },
    { header: "Dispositivo", value: (c) => c.device },
    { header: "Navegador", value: (c) => c.browser ?? "" },
    { header: "Sistema Operacional", value: (c) => c.os ?? "" },
    { header: "País", value: (c) => c.country ?? "" },
    { header: "Referer", value: (c) => c.referer ?? "" },
    { header: "IP", value: (c) => c.ip ?? "" },
    { header: "Data", value: (c) => formatDateTime(c.createdAt) },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cliques-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
