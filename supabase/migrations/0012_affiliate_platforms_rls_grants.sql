alter table public.affiliate_platforms enable row level security;

-- Mesmo racional de "public_read_active_links" (0007): a view links_public
-- roda com security_invoker, então o join com affiliate_platforms no
-- middleware executa "como anon" — precisa de policy própria aqui.
create policy "public_read_active_affiliate_platforms"
on public.affiliate_platforms
for select
to anon
using (status = 'active');

grant select, insert, update, delete on public.affiliate_platforms to service_role;
grant select on public.affiliate_platforms to anon;
