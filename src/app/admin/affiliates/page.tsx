import { listAffiliatePlatforms } from "@/services/affiliate-platform.service";
import { AffiliatePlatformsTable } from "@/components/affiliates/affiliate-platforms-table";
import { AffiliatePlatformDialog } from "@/components/affiliates/affiliate-platform-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default async function AffiliatesPage() {
  const platforms = await listAffiliatePlatforms();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Afiliados</h1>
          <p className="text-muted-foreground">
            Cadastre plataformas de afiliado para reaproveitar o link em vários slugs.
          </p>
        </div>
        <AffiliatePlatformDialog />
      </div>

      <Card>
        <CardContent>
          <AffiliatePlatformsTable platforms={platforms} />
        </CardContent>
      </Card>
    </div>
  );
}
