---
tags: [proyecto, platform, mvp, nextjs]
created: 2026-04-11
status: completado
---

# InventAgency Platform - MVP

## Estado: ✅ Completado (100%)

Plataforma de desarrollo de software bajo demanda. Cotización inteligente, booking de discovery calls, dashboard de cliente y panel profesional.

## Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS + shadcn/ui (new-york)
- **Auth**: Supabase Auth
- **DB**: Supabase PostgreSQL
- **Animaciones**: Framer Motion
- **Deploy**: Cloudflare Pages

## Estructura de Páginas (15)

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing con cotizador + Liquid Metal Hero |
| `/quote` | Cotizador inteligente (wizard 4 pasos) |
| `/book` | Sistema de booking para Discovery Calls |
| `/login` | Página de login |
| `/register` | Página de registro |
| `/register/verify` | Verificación de email |

### Dashboard del Cliente
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Dashboard principal (stats, proyectos, calls) |
| `/dashboard/projects` | Gestión de proyectos |
| `/dashboard/messages` | Sistema de mensajería |
| `/dashboard/billing` | Facturación |
| `/dashboard/calls` | Discovery Calls |

### Panel Profesional
| Ruta | Descripción |
|------|-------------|
| `/pro` | Dashboard profesional |
| `/pro/projects` | Gestión de proyectos asignados |
| `/pro/clients` | CRM de clientes |

## Componentes Clave

### UI (22+)
`avatar`, `badge`, `button`, `calendar`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `slider`, `tabs`, `textarea`, `toast`, `tooltip`, **`liquid-metal-hero`** (nuevo), `ThemeToggle`

### Booking
`BookingCalendar`, `BookingForm`, `BookingSuccess`

### Layout
`Header`, `Sidebar`

### Auth
`ProtectedRoute`, `AuthProvider`

## Hooks Personalizados (7)
- `useBooking` — Booking de discovery calls
- `useCalls` — Fetch y gestión de calls
- `useInvoices` — Facturación
- `useMessages` — Sistema de mensajería
- `useProjects` — Gestión de proyectos
- `useQuotations` — Cotizaciones
- `useUser` — Perfil de usuario

## Base de Datos (8 tablas)
- `profiles` — Perfiles de usuarios
- `projects` — Proyectos de clientes
- `discovery_calls` — Llamadas de descubrimiento
- `messages` — Sistema de mensajería
- `deliverables` — Entregables de proyectos
- `invoices` — Facturación
- `quotations` — Cotizaciones generadas
- `clients` — CRM (tabla adicional)
- `interactions` — Interacciones con clientes

## Flujo Completo del Usuario
```
1. Landing (/) → Hero Liquid Metal + Cotizador
2. Click "Cotizar Proyecto" → Wizard 4 pasos
3. Seleccionar: Tipo → Complejidad → Timeline → Precio
4. Click "Agendar Discovery Call" → /book
5. Seleccionar fecha/hora → Formulario → Confirmación
6. Registro/Login → /register o /login
7. Dashboard → Ver proyectos, calls, mensajes, facturación
```

## Feature Nueva: Liquid Metal Hero
- Componente: `liquid-metal-hero.tsx`
- Shader: `@paper-design/shaders-react` (preset #2)
- Efecto: Background animado liquid metal con contenido superpuesto
- Animaciones: Staggered fade-in, hover scale en botones, feature cards con delay

## Comandos
```bash
npm run dev          # Desarrollo local (localhost:3000)
npm run build        # Build de producción
npm run pages:build  # Build para Cloudflare
npm run pages:deploy # Deploy a Cloudflare Pages
```

## Relacionado
- [[InventAgency - Base de Datos Supabase]]
- [[InventAgency - Tech Stack]]
- [[InventAgency - Flujo de Cotización]]
- [[InventAgency - Componentes UI]]
