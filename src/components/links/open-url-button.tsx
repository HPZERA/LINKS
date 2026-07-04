import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OpenUrlButton({ url, label }: { url: string; label?: string }) {
  return (
    <Button
      variant={label ? "outline" : "ghost"}
      size={label ? "default" : "icon"}
      nativeButton={false}
      render={<a href={url} target="_blank" rel="noopener noreferrer" />}
    >
      <ExternalLink className="size-4" />
      {label}
    </Button>
  );
}
