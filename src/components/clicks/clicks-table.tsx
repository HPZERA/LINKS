import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/format";
import type { ClickDTO } from "@/types/domain";

export function ClicksTable({ clicks }: { clicks: ClickDTO[] }) {
  if (clicks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        Nenhum clique encontrado para o período selecionado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Slug</TableHead>
          <TableHead>Dispositivo</TableHead>
          <TableHead>Navegador</TableHead>
          <TableHead>SO</TableHead>
          <TableHead>País</TableHead>
          <TableHead>Referer</TableHead>
          <TableHead className="text-right">Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clicks.map((click) => (
          <TableRow key={click.id}>
            <TableCell className="font-medium">/{click.linkSlug}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {click.device}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{click.browser ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{click.os ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{click.country ?? "—"}</TableCell>
            <TableCell className="max-w-48 truncate text-muted-foreground">
              {click.referer ?? "—"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDateTime(click.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
