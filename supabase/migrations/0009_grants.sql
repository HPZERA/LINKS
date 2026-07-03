-- RLS não substitui GRANT no Postgres: mesmo com RLS habilitado, o role
-- ainda precisa do GRANT básico de tabela antes de as policies serem
-- avaliadas. O Supabase Table Editor aplica esses grants automaticamente
-- quando você cria tabelas pela interface — como criamos tudo via SQL puro
-- (SQL Editor), eles nunca foram aplicados, e isso quebrava até o
-- service_role (que ignora RLS via BYPASSRLS, mas não ignora GRANT).
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.categories to service_role;
grant select, insert, update, delete on public.links to service_role;
grant select, insert, update, delete on public.clicks to service_role;
grant select, insert, update, delete on public.settings to service_role;
grant select, insert, update, delete on public.profiles to service_role;

-- anon precisa do grant na tabela subjacente também: a view links_public
-- roda com security_invoker (como o papel de quem chama), então o SELECT
-- efetivo acontece "como anon" contra a tabela links, não só contra a view.
grant select on public.links to anon;

-- authenticated só toca em profiles (self-row, via policy), mais nada.
grant select, update on public.profiles to authenticated;
