import { createLinkAction } from "@/actions/links.actions";
import { listCategories } from "@/services/category.service";
import { listActiveAffiliatePlatforms } from "@/services/affiliate-platform.service";
import { getPublicDomain } from "@/services/settings.service";
import { LinkForm } from "@/components/links/link-form";

export default async function NewLinkPage() {
  const [categories, affiliatePlatforms, publicDomain] = await Promise.all([
    listCategories(),
    listActiveAffiliatePlatforms(),
    getPublicDomain(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo Link</h1>
        <p className="text-muted-foreground">
          Assim que salvo, o redirecionamento passa a funcionar imediatamente.
        </p>
      </div>

      <LinkForm
        categories={categories}
        affiliatePlatforms={affiliatePlatforms}
        publicDomain={publicDomain}
        action={createLinkAction}
      />
    </div>
  );
}
