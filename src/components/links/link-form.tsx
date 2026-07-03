"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { linkFormSchema, type LinkFormInput } from "@/lib/validations/link.schema";
import { slugify } from "@/utils/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ActionResult, CategoryDTO, LinkDTO } from "@/types/domain";

const NONE_CATEGORY = "none";

export function LinkForm({
  categories,
  defaultValues,
  action,
}: {
  categories: CategoryDTO[];
  defaultValues?: Partial<LinkFormInput>;
  action: (formData: FormData) => Promise<ActionResult<LinkDTO>>;
}) {
  const router = useRouter();

  const form = useForm<LinkFormInput>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      slug: "",
      destinationUrl: "",
      description: "",
      categoryId: "",
      status: "active",
      ...defaultValues,
    },
  });

  async function onSubmit(values: LinkFormInput) {
    const formData = new FormData();
    formData.set("slug", values.slug);
    formData.set("destinationUrl", values.destinationUrl);
    formData.set("description", values.description ?? "");
    formData.set("categoryId", values.categoryId === NONE_CATEGORY ? "" : (values.categoryId ?? ""));
    formData.set("status", values.status);

    const result = await action(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof LinkFormInput, { message: messages[0] });
        }
      }
      toast.error(result.error ?? "Não foi possível salvar o link.");
      return;
    }

    toast.success("Link salvo com sucesso.");
    router.push("/admin/links");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    placeholder="deposito"
                    {...field}
                    onChange={(event) => field.onChange(slugify(event.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>Ex: deposito, live, grupo, instagram.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destinationUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de destino</FormLabel>
              <FormControl>
                <Input placeholder="https://go.aff.start.bet.br/css2hjfd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                value={field.value || NONE_CATEGORY}
                onValueChange={(value) => field.onChange(value === NONE_CATEGORY ? "" : value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE_CATEGORY}>Nenhuma</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
