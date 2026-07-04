# Gerenciador Inteligente de Links

Sistema de redirecionamento de links de afiliados (estilo Linktree, focado em performance) com painel administrativo. Acessar `SEU_DOMINIO/algum-slug` consulta o Supabase e redireciona via HTTP 302 em Edge Middleware — sem página intermediária.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase (Postgres + Auth) · Server Actions · Edge Middleware · Vercel

## Arquitetura

```
src/
├─ middleware.ts          # único middleware: rate limit -> auth guard (/admin) -> redirect de slug
├─ lib/middleware/         # módulos compostos pelo middleware.ts
├─ lib/supabase/           # clients: service (admin), server (SSR/cookies), browser, edge-public/edge-service (fetch cru)
├─ repositories/           # acesso a dados (Supabase), usados pelas Server Actions/Server Components
├─ services/               # regras de negócio + mapeamento para DTOs
├─ actions/                 # Server Actions ('use server')
├─ components/              # UI (shadcn/ui + componentes de domínio)
└─ app/
   ├─ page.tsx              # redireciona para /admin
   ├─ not-found.tsx          # 404 customizado (slug inexistente)
   ├─ login/                 # login (Supabase Auth)
   └─ admin/                 # painel (protegido pelo middleware)
```

O redirecionamento nunca usa o SDK completo do Supabase (incompatível com o Edge Runtime) — usa `fetch` cru contra o PostgREST, tanto para resolver o slug (`lib/supabase/edge-public.ts`, anon key, via a view pública `links_public`) quanto para registrar o clique em segundo plano (`lib/supabase/edge-service.ts`, service role key, disparado via `context.waitUntil` **depois** do 302 já ter sido enviado — não atrasa o redirect).

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto no Supabase

Se ainda não tiver um projeto: crie em [supabase.com](https://supabase.com/dashboard), de preferência na região **South America (São Paulo)** se o público for majoritariamente do Brasil (reduz a latência do redirect).

### 3. Aplicar as migrations

No **SQL Editor** do Supabase Studio, rode os arquivos de `supabase/migrations/` **em ordem** (0001 → 0012), ou use a CLI do Supabase. A migration `0009_grants.sql` é essencial: sem ela, o Postgres nega acesso a todas as tabelas mesmo para a service role key (RLS não substitui `GRANT` — se você criou o banco rodando as migrations manualmente pelo SQL Editor, os grants automáticos que o Table Editor aplicaria não acontecem sozinhos).

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

### 4. Criar o usuário administrador

No dashboard do Supabase: **Authentication → Users → Add user**. Crie com seu e-mail e senha — esse é o único login aceito pelo painel (não há fluxo de cadastro). Um trigger (`0008_profiles.sql`) cria automaticamente a linha correspondente em `profiles`; se você criar o usuário antes de aplicar essa migration, o backfill dela cobre esse caso.

### 5. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha com os valores de **Project Settings → API** do Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (nunca exponha essa chave no client)

### 6. Gerar os tipos reais do banco (opcional, recomendado)

O projeto já vem com `src/types/database.types.ts` escrito manualmente espelhando as migrations. Depois de aplicar as migrations, você pode substituí-lo pelo tipo gerado automaticamente:

```bash
supabase gen types typescript --project-id SEU_PROJECT_REF > src/types/database.types.ts
```

### 7. Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000/login`, entre com o usuário criado no passo 4, e crie seu primeiro link em **Links → Novo Link**.

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Configure as mesmas variáveis de ambiente do `.env.local` (Settings → Environment Variables).
3. Aponte seu domínio (`portalhpzera.com.br`) para o projeto na Vercel.
4. Preencha o campo **Domínio principal** em **Configurações** no painel.

## Configurações opcionais

- **Meta Pixel / Conversions API**: preencha `Meta Pixel ID` e `Meta Access Token` (gerado em Events Manager → Configurações → Conversions API) na página de Configurações. O evento é disparado **server-side**, depois do redirect, sem afetar a velocidade do clique. Use `Meta Test Event Code` temporariamente para validar na aba Test Events.
- **Google Analytics / GTM**: os IDs ficam salvos em Configurações para uso futuro (o redirect não carrega página, então esses scripts não são disparados client-side no clique — ficam disponíveis para integração futura, ex: no próprio painel admin).
- **Webhook**: recebe um `POST` em JSON a cada clique (`{ event, slug, destinationUrl, country, device, referer, timestamp }`).
- **Rate limiting distribuído**: opcional. Sem `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`, o sistema usa um fallback em memória por instância (não distribuído, proteção mínima). Para um limite consistente entre regiões, crie um banco gratuito em [upstash.com](https://upstash.com) e preencha essas variáveis. Se um link tiver tráfego alto vindo de IPs compartilhados (NAT corporativo/operadora), aumente `RATE_LIMIT_MAX`.
- **Retenção de IP**: o toggle "Armazenar IP dos cliques" em Configurações controla se o IP bruto do visitante é gravado — desligue se sua política de privacidade não permitir.
- **Redirecionamento padrão**: se preenchido em Configurações, um slug inexistente redireciona para essa URL em vez de mostrar o 404 customizado.
- **E-mail de suporte**: campo informativo em Configurações, ainda sem uso automático no produto (reservado para uso futuro, ex: exibir em algum lugar do painel ou em notificações).

## Perfis e permissões

A tabela `profiles` (1:1 com `auth.users`, populada automaticamente por trigger) guarda:

- `role` (`admin` | `manager` | `user`): hoje é só armazenado — não há nenhuma rota/ação que restrinja por papel. Preparado para quando o painel tiver mais de um usuário com permissões diferentes.
- `is_active`: **este campo é aplicado**. Se `false`, o middleware desloga o usuário e redireciona para `/login?reason=inactive` no próximo acesso a `/admin`. Para desativar alguém, edite a linha em `profiles` direto no Supabase (não há UI para isso ainda, já que só existe um admin hoje).
- `last_login_at`: atualizado automaticamente por um trigger em `auth.users`, sem precisar de nenhum código na aplicação.

## Afiliados / Plataformas

Cadastro central de plataformas de afiliado (**Afiliados** no menu, `/admin/affiliates`) para não colar o mesmo link de afiliado toda vez que criar um novo slug — cadastre a plataforma uma vez e reaproveite em quantos links quiser.

- Tabela `affiliate_platforms` (migration `0010`): `name`, `slug`, `affiliate_url`, `status` (`active`/`inactive`), `notes`.
- No formulário de link (**Novo Link** / editar), o campo **Tipo de destino** alterna entre:
  - **URL manual**: comportamento de sempre, usa `links.destination_url`.
  - **Plataforma afiliada**: seleciona uma plataforma ativa em vez de digitar a URL. O link guarda apenas `affiliate_platform_id`; a URL efetiva é sempre lida de `affiliate_platforms.affiliate_url` no momento do redirect — trocar a URL da plataforma atualiza instantaneamente todos os links que apontam para ela, sem precisar editar link por link.
- A resolução do destino continua acontecendo **dentro da view `links_public`** (migration `0011`, um `left join` com `affiliate_platforms`), então o middleware de redirect continua fazendo uma única query — nenhum overhead extra no caminho quente do redirect.
- Se a plataforma referenciada estiver **inativa**, a view não retorna a linha: o slug se comporta como se não tivesse match e cai no mesmo fallback configurado em Configurações (ou 404 customizado, se não houver fallback) — nunca redireciona para um destino inválido.
- Uma plataforma com links apontando para ela **não pode ser excluída** (`on delete restrict` em `links.affiliate_platform_id`); a UI mostra o erro pedindo para reatribuir os links antes.
- Links criados antes dessa feature continuam funcionando sem alteração: `destination_type` tem default `'manual'`, então todo link existente já nasce como "URL manual" com o comportamento de sempre.

## Exportação / backup

Botões "Exportar" nas páginas de **Links** (`/admin/links/export`), **Cliques** (`/admin/clicks/export`, respeita os filtros de período/link aplicados) e **Configurações** (`/admin/settings/export`, JSON sem o `metaAccessToken`). Servem como backup manual — não há agendamento automático.

## Colunas reservadas em `links`

`password`, `expires_at`, `max_clicks`, `priority`, `rotation_weight`, `qr_code_url` e `archived_at` existem no schema (migration `0003`) mas **nenhuma delas tem lógica implementada ainda** — nem no formulário, nem no middleware de redirecionamento. Ficam preparadas para features futuras (link com senha, expiração, limite de cliques, rotação A/B, QR code, arquivamento). Se for implementar alguma, lembre que `password` deve guardar um hash, nunca texto puro.

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
npm run lint    # ESLint
```
