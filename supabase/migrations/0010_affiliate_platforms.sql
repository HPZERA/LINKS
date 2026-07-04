create table public.affiliate_platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  affiliate_url text not null,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliate_platforms_name_not_blank check (btrim(name) <> ''),
  constraint affiliate_platforms_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint affiliate_platforms_affiliate_url_not_blank check (btrim(affiliate_url) <> ''),
  constraint affiliate_platforms_status_valid check (status in ('active', 'inactive'))
);

create trigger affiliate_platforms_set_updated_at
before update on public.affiliate_platforms
for each row execute function public.set_updated_at();
