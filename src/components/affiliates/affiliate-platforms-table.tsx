import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AffiliatePlatformDialog } from "@/components/affiliates/affiliate-platform-dialog";
import { DeleteAffiliatePlatformDialog } from "@/components/affiliates/delete-affiliate-platform-dialog";
import { formatDateTime } from "@/utils/format";
import type { AffiliatePlatformDTO } from "@/types/domain";

export function AffiliatePlatformsTable({ platforms }: { platforms: AffiliatePlatformDTO[] }) {
  if (platforms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        Nenhuma plataforma cadastrada ainda. Clique em &ldquo;Nova Plataforma&rdquo; para começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Link de afiliado</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {platforms.map((platform) => (
          <TableRow key={platform.id}>
            <TableCell className="font-medium">{platform.name}</TableCell>
            <TableCell className="text-muted-foreground">{platform.slug}</TableCell>
            <TableCell className="max-w-72 truncate text-muted-foreground">
              {platform.affiliateUrl}
            </TableCell>
            <TableCell>
              <Badge variant={platform.status === "active" ? "success" : "secondary"}>
                {platform.status === "active" ? "Ativa" : "Inativa"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDateTime(platform.createdAt)}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <AffiliatePlatformDialog platform={platform} />
                <DeleteAffiliatePlatformDialog id={platform.id} name={platform.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
