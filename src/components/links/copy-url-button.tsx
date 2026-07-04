"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/clipboard";
import { Button } from "@/components/ui/button";

export function CopyUrlButton({ url, label }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(url);
    if (!ok) {
      toast.error("Não foi possível copiar o link.");
      return;
    }
    toast.success("Link copiado com sucesso!");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      type="button"
      variant={label ? "outline" : "ghost"}
      size={label ? "default" : "icon"}
      onClick={handleCopy}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label}
    </Button>
  );
}
