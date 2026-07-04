"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Folder,
  Handshake,
  LayoutDashboard,
  Link as LinkIconLucide,
  MousePointerClick,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/layout/logout-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/links", label: "Links", icon: LinkIconLucide },
  { href: "/admin/affiliates", label: "Afiliados", icon: Handshake },
  { href: "/admin/clicks", label: "Cliques", icon: MousePointerClick },
  { href: "/admin/stats", label: "Estatísticas", icon: BarChart3 },
  { href: "/admin/categories", label: "Categorias", icon: Folder },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
  { href: "/admin/profile", label: "Perfil", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LinkIconLucide className="size-4" />
        </div>
        <span className="font-semibold tracking-tight text-sidebar-foreground">Links</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isExact = "exact" in item && item.exact;
          const active = isExact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
