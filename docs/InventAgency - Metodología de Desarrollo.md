---
tags: [proceso, metodologia, desarrollo, agil]
created: 2026-04-11
---

# InventAgency - Metodología de Desarrollo

## Filosofía
Entrega garantizada con metodología ágil. Sprints semanales, demos constantes, comunicación transparente.

## Fases de Desarrollo

### Fase 1: MVP (6-8 semanas)
- Landing con cotizador inteligente
- Sistema de booking para Discovery Calls
- Portal básico del cliente
- Panel profesional básico
- Integración con Stripe
- Emails transaccionales

### Fase 2: IA & Automation (4-6 semanas)
- IA Studio para prototipos
- Estimaciones automáticas con IA
- Chat en tiempo real
- Notificaciones push

### Fase 3: Scale (4-6 semanas)
- App móvil para clientes
- Analytics avanzados
- White label para agencies
- API pública

## Convenciones Git

### Branches
- `feat/description` — Nuevas features
- `fix/description` — Bug fixes
- `refactor/description` — Refactoring
- `docs/description` — Documentación
- `test/description` — Tests
- `chore/description` — Mantenimiento

### Commits (Conventional Commits)
```
feat(auth): add Google OAuth login
fix(payments): resolve webhook signature validation
refactor(api): migrate from REST to tRPC
docs(readme): update deployment instructions
```

## Estándares de Código
- TypeScript strict mode siempre
- No `any` types unless absolutely justified
- Error handling mandatory — never silent failures
- API responses: `{ success, data, error, message }`
- Input validation con Zod en ALL user inputs
- SQL injection prevention (parameterized queries / Prisma)
- XSS prevention (sanitize HTML)

## Estándares de Entrega
Cada feature debe incluir:
1. Working code con zero TypeScript errors
2. Error handling y loading states
3. Mobile-responsive design
4. Basic accessibility (keyboard nav, ARIA labels)
5. Input validation (Zod schemas)
6. Environment variables en `.env.example`

## File Structure
```
src/
  app/                  # Next.js App Router pages
  components/
    ui/                 # shadcn/ui components
    shared/             # Shared components
    features/           # Feature-specific components
  lib/
    utils.ts            # Utility functions
    constants.ts        # App constants
    validators.ts       # Zod schemas
  server/
    api/                # tRPC routers
    db/                 # Prisma client + queries
    services/           # Business logic
  hooks/                # Custom React hooks
  stores/               # Zustand stores
  types/                # TypeScript types/interfaces
```

## Relacionado
- [[InventAgency - Tech Stack]]
- [[InventAgency - Skills Framework y Roles]]
