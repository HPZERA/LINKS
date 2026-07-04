import { notFound } from "next/navigation";
import { updateLinkAction } from "@/actions/links.actions";
import { getLink } from "@/services/link.service";
import { listCategories } from "@/services/category.service";
import { listAffiliatePlatforms } from "@/services/affiliate-platform.service";
import { getPublicDomain } from "@/services/settings.service";
import { LinkForm } from "@/components/links/link-form";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [link, categories, affiliatePlatforms, publicDomain] = await Promise.all([
    getLink(id),
    listCategories(),
    // Lista completa (não só ativas): se o link já estiver apontando para uma
    // plataforma que foi desativada depois, ela precisa continuar aparecendo
    // no select para o admin ver/trocar — senão o campo fica em branco.
    listAffiliatePlatforms(),
    getPublicDomain(),
  ]);

  if (!link) notFound();

  const action = updateLinkAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar /{link.slug}</h1>
        <p className="text-muted-foreground">As alterações valem para o próximo acesso ao link.</p>
      </div>

      <LinkForm
        categories={categories}
        affiliatePlatforms={affiliatePlatforms}
        publicDomain={publicDomain}
        action={action}
        defaultValues={{
          slug: link.slug,
          destinationType: link.destinationType,
          destinationUrl: link.destinationUrl ?? "",
          affiliatePlatformId: link.affiliatePlatformId ?? "",
          description: link.description ?? "",
          categoryId: link.categoryId ?? "",
          status: link.status,
        }}
      />
    </div>
  );
}
