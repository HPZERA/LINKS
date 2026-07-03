import { listLinks } from "@/services/link.service";
import { toCsv } from "@/utils/csv";
import { formatDateTime } from "@/utils/format";
import type { LinkDTO } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function GET() {
  const links = await listLinks();

  const csv = toCsv<LinkDTO>(links, [
    { header: "Slug", value: (l) => l.slug },
    { header: "Destino", value: (l) => l.destinationUrl },
    { header: "Categoria", value: (l) => l.categoryName ?? "" },
    { header: "Status", value: (l) => (l.status === "active" ? "Ativo" : "Inativo") },
    { header: "Cliques", value: (l) => l.clickCount },
    { header: "Último clique", value: (l) => (l.lastClickedAt ? formatDateTime(l.lastClickedAt) : "") },
    { header: "Descrição", value: (l) => l.description ?? "" },
    { header: "Criado em", value: (l) => formatDateTime(l.createdAt) },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="links-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
