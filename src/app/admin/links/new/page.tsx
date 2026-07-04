import { createLinkAction } from "@/actions/links.actions";
import { listCategories } from "@/services/category.service";
import { listActiveAffiliatePlatforms } from "@/services/affiliate-platform.service";
import { LinkForm } from "@/components/links/link-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLinkPage() {
  const [categories, affiliatePlatforms] = await Promise.all([
    listCategories(),
    listActiveAffiliatePlatforms(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo Link</h1>
        <p className="text-muted-foreground">
          Assim que salvo, o redirecionamento passa a funcionar imediatamente.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes do link</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkForm
            categories={categories}
            affiliatePlatforms={affiliatePlatforms}
            action={createLinkAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
