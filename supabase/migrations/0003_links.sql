create type public.link_status as enum ('active', 'inactive');

create table public.links (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  destination_url text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  status public.link_status not null default 'active',
  click_count bigint not null default 0,
  last_clicked_at timestamptz,
  -- Reservados para recursos futuros (ainda não têm nenhuma regra aplicada
  -- pelo middleware/redirect nem UI própria — só o schema está preparado):
  -- password: deve guardar um HASH (nunca a senha em texto puro) quando a
  --   funcionalidade de link protegido por senha for implementada.
  -- expires_at: quando implementado, o middleware deve tratar como inativo
  --   depois dessa data.
  -- max_clicks: limite de cliques antes do link parar de redirecionar.
  -- priority / rotation_weight: para redirecionamento A/B ou round-robin
  --   entre múltiplos destinos no futuro.
  -- qr_code_url: URL de uma imagem de QR Code gerada para o link.
  -- archived_at: soft-archive, distinto de status='inactive'.
  password text,
  expires_at timestamptz,
  max_clicks integer,
  priority integer not null default 0,
  rotation_weight integer not null default 0,
  qr_code_url text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint links_slug_unique unique (slug),
  constraint links_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint links_slug_length check (char_length(slug) between 1 and 100),
  constraint links_destination_url_not_blank check (btrim(destination_url) <> ''),
  constraint links_max_clicks_positive check (max_clicks is null or max_clicks > 0)
);

create index links_status_idx on public.links (status);
create index links_category_id_idx on public.links (category_id);
create index links_created_at_idx on public.links (created_at desc);

create trigger links_set_updated_at
before update on public.links
for each row execute function public.set_updated_at();
