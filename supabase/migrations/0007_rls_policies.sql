alter table public.categories enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.settings enable row level security;

-- Única policy pública de todo o sistema: leitura de links ativos,
-- usada exclusivamente pelo middleware (anon key) através da view
-- links_public (security_invoker = on, então esta policy é o que
-- realmente autoriza a leitura).
create policy "public_read_active_links"
on public.links
for select
to anon
using (status = 'active');

-- Nenhuma outra policy é criada para anon/authenticated. Todo o resto
-- (INSERT em clicks, leitura/escrita de settings, CRUD completo de
-- links/categories pelo painel admin) é feito no servidor (Server
-- Actions e o bloco waitUntil do middleware) usando a
-- SUPABASE_SERVICE_ROLE_KEY, que ignora RLS por padrão.
