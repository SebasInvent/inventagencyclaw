---
tags: [tecnico, infraestructura, deploy, cloudflare]
created: 2026-04-11
---

# InventAgency - Infraestructura y Deploy

## Hosting

### Platform MVP
- **Provider**: Cloudflare Pages
- **Config**: `wrangler.toml`
- **Build**: `@cloudflare/next-on-pages`
- **Commands**:
  ```bash
  npm run pages:build   # Build para Cloudflare
  npm run pages:deploy  # Deploy a Cloudflare Pages
  npm run preview       # Build + local preview
  ```

### Web Landing
- **Provider**: Vercel / Cloudflare Pages
- **Framework**: Next.js 16

## Base de Datos
- **Provider**: Supabase
- **URL**: `https://syuxxszyvzfjqkvwojla.supabase.co`
- **Features**: Auth, Realtime, Storage, Edge Functions

## Variables de Entorno (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## CI/CD
- **Platform**: GitHub Actions
- **Strategy**: Automated pipelines
- **Branching**: `feat/`, `fix/`, `refactor/`, `docs/`, `test/`, `chore/`

## Monitoreo
- **Errors**: Sentry
- **Performance**: Vercel Analytics
- **Uptime**: Cloudflare observability

## Seguridad
- HTTPS only en producción
- CORS configurado por ambiente
- Rate limiting en APIs públicas
- RLS en todas las tablas de Supabase
- Input validation con Zod
- No secrets en código (siempre .env.local)

## Relacionado
- [[InventAgency - Tech Stack]]
- [[InventAgency - Base de Datos Supabase]]
- [[InventAgency Platform - MVP]]
