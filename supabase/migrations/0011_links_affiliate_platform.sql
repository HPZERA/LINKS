-- on delete restrict (não set null): um link com destination_type =
-- 'affiliate_platform' sempre precisa de affiliate_platform_id preenchido
-- (ver constraint links_affiliate_platform_required abaixo) — permitir
-- set null deixaria o link num estado inconsistente. Excluir a plataforma
-- fica bloqueado enquanto algum link ainda a referenciar.
alter table public.links
  add column destination_type text not null default 'manual',
  add column affiliate_platform_id uuid references public.affiliate_platforms(id) on delete restrict;

-- destination_url só é obrigatório para destination_type = 'manual'; para
-- 'affiliate_platform' o destino real vem de affiliate_platforms.affiliate_url
-- (nunca duplicado na linha do link, para não ficar desatualizado se a
-- plataforma trocar de URL depois).
alter table public.links
  alter column destination_url drop not null,
  drop constraint links_destination_url_not_blank;

alter table public.links
  add constraint links_destination_type_valid check (destination_type in ('manual', 'affiliate_platform')),
  add constraint links_affiliate_platform_required check (
    destination_type = 'manual' or affiliate_platform_id is not null
  ),
  add constraint links_destination_url_required check (
    destination_type = 'affiliate_platform' or (destination_url is not null and btrim(destination_url) <> '')
  );

create index links_affiliate_platform_id_idx on public.links (affiliate_platform_id);

-- Resolve o destino final direto na view: se o link aponta para uma
-- plataforma afiliada, troca destination_url pela affiliate_url da
-- plataforma. O join só considera plataforma ativa — se estiver inativa (ou
-- o link ficou "orfão"), a linha some do resultado e o middleware trata como
-- slug sem match (cai no fallback configurado em vez de redirecionar para um
-- destino inválido). Mantém uma única query no caminho quente do redirect.
create or replace view public.links_public
with (security_invoker = on) as
select
  l.slug,
  case
    when l.destination_type = 'affiliate_platform' then ap.affiliate_url
    else l.destination_url
  end as destination_url,
  l.status
from public.links l
left join public.affiliate_platforms ap
  on ap.id = l.affiliate_platform_id and ap.status = 'active'
where l.status = 'active'
  and (l.destination_type = 'manual' or ap.affiliate_url is not null);
