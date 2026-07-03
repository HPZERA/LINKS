import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/format";
import type { ClickDTO } from "@/types/domain";

export function RecentClicksTable({ clicks }: { clicks: ClickDTO[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos cliques</CardTitle>
      </CardHeader>
      <CardContent>
        {clicks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum clique registrado ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>País</TableHead>
                <TableHead className="text-right">Quando</TableHead>
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
                  <TableCell className="text-muted-foreground">{click.country ?? "—"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDateTime(click.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
