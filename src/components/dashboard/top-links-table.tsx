import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/format";
import type { DashboardStats } from "@/types/domain";

export function TopLinksTable({ links }: { links: DashboardStats["topLinks"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Links mais acessados</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum clique registrado ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">/{link.slug}</TableCell>
                  <TableCell className="max-w-64 truncate text-muted-foreground">
                    {link.destinationUrl}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(link.clickCount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
