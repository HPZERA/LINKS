import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import type { CategoryDTO } from "@/types/domain";

export function CategoriesTable({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        Nenhuma categoria cadastrada ainda.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">{category.slug}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <CategoryDialog category={category} />
                <DeleteCategoryDialog id={category.id} name={category.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
