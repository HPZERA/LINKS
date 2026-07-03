import { listCategories } from "@/services/category.service";
import { CategoriesTable } from "@/components/categories/categories-table";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Organize seus links por categoria.</p>
        </div>
        <CategoryDialog />
      </div>

      <Card>
        <CardContent>
          <CategoriesTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
