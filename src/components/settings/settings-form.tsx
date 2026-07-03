"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateSettingsAction } from "@/actions/settings.actions";
import { settingsFormSchema, type SettingsFormInput } from "@/lib/validations/settings.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SettingsDTO } from "@/types/domain";

export function SettingsForm({ settings }: { settings: SettingsDTO }) {
  const form = useForm<SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteTitle: settings.siteTitle,
      primaryDomain: settings.primaryDomain ?? "",
      logoUrl: settings.logoUrl ?? "",
      faviconUrl: settings.faviconUrl ?? "",
      metaPixelId: settings.metaPixelId ?? "",
      metaAccessToken: settings.metaAccessToken ?? "",
      metaTestEventCode: settings.metaTestEventCode ?? "",
      googleAnalyticsId: settings.googleAnalyticsId ?? "",
      googleTagManagerId: settings.googleTagManagerId ?? "",
      webhookUrl: settings.webhookUrl ?? "",
      supportEmail: settings.supportEmail ?? "",
      defaultRedirect: settings.defaultRedirect ?? "",
      storeIpAddress: settings.storeIpAddress,
    },
  });

  async function onSubmit(values: SettingsFormInput) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.set(key, String(value ?? ""));
    }

    const result = await updateSettingsAction(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof SettingsFormInput, { message: messages[0] });
        }
      }
      toast.error(result.error ?? "Não foi possível salvar as configurações.");
      return;
    }

    toast.success("Configurações salvas com sucesso.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="siteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do site</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domínio principal</FormLabel>
                  <FormControl>
                    <Input placeholder="portalhpzera.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faviconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail de suporte</FormLabel>
                  <FormControl>
                    <Input placeholder="suporte@portalhpzera.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultRedirect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirecionamento padrão (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Se preenchido, um slug inexistente redireciona para esta URL em vez de mostrar a
                    página de link não encontrado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="integrations" className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="metaPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Pixel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789012345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaAccessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Access Token (Conversions API)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="EAAG..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Gerado em Events Manager &rarr; Configurações &rarr; Conversions API.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaTestEventCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Test Event Code (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="TEST12345" {...field} />
                  </FormControl>
                  <FormDescription>
                    Preencha temporariamente para validar eventos na aba Test Events do Events Manager.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleTagManagerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Tag Manager ID</FormLabel>
                  <FormControl>
                    <Input placeholder="GTM-XXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="privacy" className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook de cliques</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Recebe um POST em JSON a cada clique registrado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeIpAddress"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <FormLabel>Armazenar IP dos cliques</FormLabel>
                    <FormDescription>
                      Desative se sua política de privacidade não permitir reter o IP bruto dos
                      visitantes.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Salvar configurações
          </Button>
        </div>
      </form>
    </Form>
  );
}
