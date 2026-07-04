import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyUrlButton } from "@/components/links/copy-url-button";
import { OpenUrlButton } from "@/components/links/open-url-button";

export function LinkCreatedCard({ url, editHref }: { url: string; editHref: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">URL pública</p>
        <p className="break-all font-mono text-sm">{url}</p>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <CopyUrlButton url={url} label="Copiar Link" />
        <OpenUrlButton url={url} label="Abrir Link" />
        <Button variant="outline" nativeButton={false} render={<Link href={editHref} />}>
          <Pencil className="size-4" />
          Editar
        </Button>
      </div>
    </div>
  );
}
