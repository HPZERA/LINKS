import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-sidebar-accent-foreground"
      >
        <LogOut className="size-4" />
        Sair
      </Button>
    </form>
  );
}
