"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  affiliatePlatformFormSchema,
  type AffiliatePlatformFormInput,
} from "@/lib/validations/affiliate-platform.schema";
import { slugify } from "@/utils/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ActionResult, AffiliatePlatformDTO } from "@/types/domain";

const STATUS_ITEMS = { active: "Ativa", inactive: "Inativa" };

export function AffiliatePlatformForm({
  defaultValues,
  action,
  onSuccess,
}: {
  defaultValues?: Partial<AffiliatePlatformFormInput>;
  action: (formData: FormData) => Promise<ActionResult<AffiliatePlatformDTO>>;
  onSuccess: () => void;
}) {
  const form = useForm<AffiliatePlatformFormInput>({
    resolver: zodResolver(affiliatePlatformFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      affiliateUrl: "",
      status: "active",
      notes: "",
      ...defaultValues,
    },
  });

  async function onSubmit(values: AffiliatePlatformFormInput) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("slug", values.slug);
    formData.set("affiliateUrl", values.affiliateUrl);
    formData.set("status", values.status);
    formData.set("notes", values.notes ?? "");

    const result = await action(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof AffiliatePlatformFormInput, { message: messages[0] });
        }
      }
      toast.error(result.error ?? "Não foi possível salvar a plataforma.");
      return;
    }

    toast.success("Plataforma salva com sucesso.");
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
              <FormLabel>Nome da plataforma</FormLabel>
              <FormControl>
                <Input
                  placeholder="Bet365"
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
                  placeholder="bet365"
                  {...field}
                  onChange={(event) => field.onChange(slugify(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de afiliado</FormLabel>
              <FormControl>
                <Input placeholder="https://go.afiliado.com/xyz" {...field} />
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
              <Select value={field.value} onValueChange={field.onChange} items={STATUS_ITEMS}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Opcional" {...field} />
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
