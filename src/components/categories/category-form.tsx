"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { categoryFormSchema, type CategoryFormInput } from "@/lib/validations/category.schema";
import { slugify } from "@/utils/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ActionResult, CategoryDTO } from "@/types/domain";

export function CategoryForm({
  defaultValues,
  action,
  onSuccess,
}: {
  defaultValues?: Partial<CategoryFormInput>;
  action: (formData: FormData) => Promise<ActionResult<CategoryDTO>>;
  onSuccess: () => void;
}) {
  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", slug: "", ...defaultValues },
  });

  async function onSubmit(values: CategoryFormInput) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("slug", values.slug);

    const result = await action(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CategoryFormInput, { message: messages[0] });
        }
      }
      toast.error(result.error ?? "Não foi possível salvar a categoria.");
      return;
    }

    toast.success("Categoria salva com sucesso.");
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Depósitos"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    if (!form.formState.dirtyFields.slug) {
                      form.setValue("slug", slugify(event.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="depositos"
                  {...field}
                  onChange={(event) => field.onChange(slugify(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
