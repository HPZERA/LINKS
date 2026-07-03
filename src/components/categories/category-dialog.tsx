"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { createCategoryAction, updateCategoryAction } from "@/actions/categories.actions";
import { CategoryForm } from "@/components/categories/category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CategoryDTO } from "@/types/domain";

export function CategoryDialog({ category }: { category?: CategoryDTO }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(category);

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={isEdit ? <Button variant="ghost" size="icon" /> : <Button />}>
        {isEdit ? (
          <Pencil className="size-4" />
        ) : (
          <>
            <Plus className="size-4" />
            Nova Categoria
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          defaultValues={category ? { name: category.name, slug: category.slug } : undefined}
          action={isEdit ? updateCategoryAction.bind(null, category!.id) : createCategoryAction}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
