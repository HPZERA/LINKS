"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import {
  createAffiliatePlatformAction,
  updateAffiliatePlatformAction,
} from "@/actions/affiliate-platforms.actions";
import { AffiliatePlatformForm } from "@/components/affiliates/affiliate-platform-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AffiliatePlatformDTO } from "@/types/domain";

export function AffiliatePlatformDialog({ platform }: { platform?: AffiliatePlatformDTO }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEdit = Boolean(platform);

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
            Nova Plataforma
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar plataforma" : "Nova plataforma"}</DialogTitle>
        </DialogHeader>
        <AffiliatePlatformForm
          defaultValues={
            platform
              ? {
                  name: platform.name,
                  slug: platform.slug,
                  affiliateUrl: platform.affiliateUrl,
                  status: platform.status,
                  notes: platform.notes ?? "",
                }
              : undefined
          }
          action={
            isEdit ? updateAffiliatePlatformAction.bind(null, platform!.id) : createAffiliatePlatformAction
          }
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
