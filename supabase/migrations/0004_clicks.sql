create table public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  referer text,
  user_agent text,
  device text,
  browser text,
  os text,
  country text,
  ip text,
  created_at timestamptz not null default now()
);

create index clicks_link_id_created_at_idx on public.clicks (link_id, created_at desc);
create index clicks_created_at_idx on public.clicks (created_at desc);

-- Mantém um contador denormalizado em links para telas do painel não
-- precisarem agregar a tabela clicks inteira a cada render.
create or replace function public.handle_new_click()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links
     set click_count = click_count + 1,
         last_clicked_at = new.created_at
   where id = new.link_id;
  return new;
end;
$$;

create trigger on_click_created
after insert on public.clicks
for each row execute function public.handle_new_click();
