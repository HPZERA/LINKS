import Link from "next/link";
import { Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteLinkDialog } from "@/components/links/delete-link-dialog";
import { formatDateTime, formatNumber } from "@/utils/format";
import type { LinkDTO } from "@/types/domain";

export function LinksTable({ links }: { links: LinkDTO[] }) {
  if (links.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        Nenhum link cadastrado ainda. Clique em &ldquo;Novo Link&rdquo; para começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Slug</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Cliques</TableHead>
          <TableHead>Último clique</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="font-medium">/{link.slug}</TableCell>
            <TableCell className="max-w-72 truncate text-muted-foreground">
              {link.destinationUrl}
            </TableCell>
            <TableCell className="text-muted-foreground">{link.categoryName ?? "—"}</TableCell>
            <TableCell className="text-right">{formatNumber(link.clickCount)}</TableCell>
            <TableCell className="text-muted-foreground">
              {link.lastClickedAt ? formatDateTime(link.lastClickedAt) : "—"}
            </TableCell>
            <TableCell>
              <Badge variant={link.status === "active" ? "success" : "secondary"}>
                {link.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  render={<Link href={`/admin/links/${link.id}/edit`} />}
                >
                  <Pencil className="size-4" />
                </Button>
                <DeleteLinkDialog id={link.id} slug={link.slug} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
