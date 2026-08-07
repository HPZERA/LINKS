-- Slugs agora aceitam ponto (.) e ponto-e-vírgula (;) além do hífen como
-- separador, ex: "v2.roleta" ou "promo;10". Ainda exige letras
-- minúsculas/números nas pontas e não permite dois separadores seguidos.
alter table public.links drop constraint links_slug_format;
alter table public.links add constraint links_slug_format
  check (slug ~ '^[a-z0-9]+([-.;][a-z0-9]+)*$');

alter table public.categories drop constraint categories_slug_format;
alter table public.categories add constraint categories_slug_format
  check (slug ~ '^[a-z0-9]+([-.;][a-z0-9]+)*$');

alter table public.affiliate_platforms drop constraint affiliate_platforms_slug_format;
alter table public.affiliate_platforms add constraint affiliate_platforms_slug_format
  check (slug ~ '^[a-z0-9]+([-.;][a-z0-9]+)*$');
