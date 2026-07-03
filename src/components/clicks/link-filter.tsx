"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LinkDTO } from "@/types/domain";

const ALL_LINKS = "all";

export function LinkFilter({ links, basePath }: { links: LinkDTO[]; basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLinkId = searchParams.get("linkId") ?? ALL_LINKS;

  function handleChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_LINKS) {
      params.delete("linkId");
    } else {
      params.set("linkId", value);
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <Select value={currentLinkId} onValueChange={handleChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Todos os links" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_LINKS}>Todos os links</SelectItem>
        {links.map((link) => (
          <SelectItem key={link.id} value={link.id}>
            /{link.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
