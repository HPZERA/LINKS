-- View mínima consultada pelo middleware (Edge, anon key) para resolver o
-- redirecionamento. Expõe apenas o necessário: nunca description/category/etc.
create view public.links_public
with (security_invoker = on) as
select slug, destination_url, status
from public.links
where status = 'active';

grant select on public.links_public to anon;
