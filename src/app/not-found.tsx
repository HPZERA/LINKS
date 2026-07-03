import { LinkIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LinkIcon className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Link não encontrado</h1>
          <p className="text-muted-foreground">
            Este link não existe ou foi desativado. Verifique se o endereço foi digitado
            corretamente.
          </p>
        </div>
      </div>
    </div>
  );
}
