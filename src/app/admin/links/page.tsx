import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { listLinks } from "@/services/link.service";
import { getPublicDomain } from "@/services/settings.service";
import { LinksTable } from "@/components/links/links-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function LinksPage() {
  const [links, publicDomain] = await Promise.all([listLinks(), getPublicDomain()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
          <p className="text-muted-foreground">Gerencie os redirecionamentos do seu domínio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/links/export" />}>
            <Download className="size-4" />
            Exportar CSV
          </Button>
          <Button nativeButton={false} render={<Link href="/admin/links/new" />}>
            <Plus className="size-4" />
            Novo Link
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <LinksTable links={links} publicDomain={publicDomain} />
        </CardContent>
      </Card>
    </div>
  );
}
