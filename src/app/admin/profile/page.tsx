import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/services/profile.service";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/format";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  user: "Usuário",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getOrCreateProfile({ id: user.id, email: user.email ?? null });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">Informações da sua conta de administrador.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.displayName ?? ""} />}
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{profile.displayName || profile.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{ROLE_LABELS[profile.role] ?? profile.role}</Badge>
                <Badge variant={profile.isActive ? "success" : "destructive"}>
                  {profile.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">E-mail</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Último login</dt>
              <dd>{profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : "—"}</dd>
            </div>
          </dl>

          <p className="text-sm text-muted-foreground">
            Para alterar seu e-mail ou senha, acesse o dashboard do Supabase em Authentication &rarr;
            Users.
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Editar perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
