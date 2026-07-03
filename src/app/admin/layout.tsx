import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/services/profile.service";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

// Todo o subtree /admin depende de sessão (cookies) e dados ao vivo do
// Supabase — nunca deve ser prerenderizado estaticamente no build.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Checagem redundante e leve: a proteção real de /admin já acontece no
  // middleware (auth-guard.ts). Isso apenas evita um flash de conteúdo caso
  // o middleware seja alterado no futuro e alguém esqueça de recompor este guard.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getOrCreateProfile({ id: user.id, email: user.email ?? null });

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header email={user.email ?? null} displayName={profile.displayName} avatarUrl={profile.avatarUrl} />
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
