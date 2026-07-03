-- Perfil de cada usuário do Supabase Auth. Hoje o sistema tem um único
-- admin, mas isolar isso em uma tabela própria (em vez de só usar
-- auth.users) prepara terreno para múltiplos admins/papéis e para a
-- integração futura com o CRM.
create type public.user_role as enum ('admin', 'manager', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'admin',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Cria automaticamente um profile para todo novo usuário criado no Auth
-- (ex: quando você adiciona um admin manualmente pelo dashboard).
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Mantém profiles.last_login_at sincronizado com auth.users.last_sign_in_at
-- a cada novo login, sem precisar de nenhuma mudança no código da aplicação.
create or replace function public.handle_auth_user_login()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.last_sign_in_at is distinct from old.last_sign_in_at then
    update public.profiles
       set last_login_at = new.last_sign_in_at
     where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_login
after update on auth.users
for each row execute function public.handle_auth_user_login();

-- Backfill: garante um profile para usuários já existentes antes desta
-- migration (ex: o admin criado manualmente no dashboard antes do deploy).
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;

-- Cada usuário só enxerga/edita o próprio profile. Nenhuma policy pública.
-- Observação: role e is_active não fazem parte do `update` liberado aqui de
-- forma alguma diferenciada — a policy de UPDATE cobre a linha inteira, mas
-- a única escrita que a aplicação faz nesses campos hoje é feita pelo
-- servidor com a service role key (actions/profile.actions.ts só atualiza
-- display_name/avatar_url). Promover/rebaixar role ou desativar um usuário
-- é uma operação administrativa feita via SQL/dashboard, não pelo próprio
-- usuário através do painel.
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
