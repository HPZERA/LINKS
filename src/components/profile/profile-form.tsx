"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateProfileAction } from "@/actions/profile.actions";
import { profileFormSchema, type ProfileFormInput } from "@/lib/validations/profile.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ProfileDTO } from "@/types/domain";

export function ProfileForm({ profile }: { profile: ProfileDTO }) {
  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    },
  });

  async function onSubmit(values: ProfileFormInput) {
    const formData = new FormData();
    formData.set("displayName", values.displayName ?? "");
    formData.set("avatarUrl", values.avatarUrl ?? "");

    const result = await updateProfileAction(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ProfileFormInput, { message: messages[0] });
        }
      }
      toast.error(result.error ?? "Não foi possível salvar o perfil.");
      return;
    }

    toast.success("Perfil atualizado.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de exibição</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
