import { notFound } from "next/navigation";
import { updateLinkAction } from "@/actions/links.actions";
import { getLink } from "@/services/link.service";
import { listCategories } from "@/services/category.service";
import { LinkForm } from "@/components/links/link-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [link, categories] = await Promise.all([getLink(id), listCategories()]);

  if (!link) notFound();

  const action = updateLinkAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar /{link.slug}</h1>
        <p className="text-muted-foreground">As alterações valem para o próximo acesso ao link.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes do link</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkForm
            categories={categories}
            action={action}
            defaultValues={{
              slug: link.slug,
              destinationUrl: link.destinationUrl,
              description: link.description ?? "",
              categoryId: link.categoryId ?? "",
              status: link.status,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
