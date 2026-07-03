import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({
  email,
  displayName,
  avatarUrl,
}: {
  email: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}) {
  const label = displayName || email;
  const initial = label?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex h-16 items-center justify-end border-b border-border px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Avatar className="size-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={label ?? ""} />}
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initial}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
