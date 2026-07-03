-- Tabela singleton: sempre existe exatamente uma linha (id = 1).
-- default_redirect: URL usada pelo middleware no lugar do 404 customizado
-- quando o slug acessado não existe. Se vazio/nulo, mantém o 404.
create table public.settings (
  id smallint primary key default 1,
  site_title text not null default 'Gerenciador de Links',
  primary_domain text,
  logo_url text,
  favicon_url text,
  meta_pixel_id text,
  meta_access_token text,
  meta_test_event_code text,
  google_analytics_id text,
  google_tag_manager_id text,
  webhook_url text,
  support_email text,
  default_redirect text,
  store_ip_address boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();
