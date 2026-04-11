---
tags: [tecnico, database, supabase, schema]
created: 2026-04-11
---

# InventAgency - Base de Datos Supabase

## Proyecto Supabase
- **URL**: `https://syuxxszyvzfjqkvwojla.supabase.co`
- **Región**: Auto-asignada
- **Auth**: Supabase Auth + Google OAuth

## Tablas del Platform MVP (8)

### profiles
Perfiles de usuarios extendidos.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK, ref a auth.users |
| full_name | VARCHAR | |
| company | VARCHAR | |
| role | ENUM | client, professional, admin |
| avatar_url | TEXT | |
| created_at | TIMESTAMPTZ | |

### projects
Proyectos de clientes.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| client_id | UUID | FK → profiles |
| name | VARCHAR | |
| type | ENUM | mobile, web, api, ai, blockchain, biometrics, analytics, ecommerce, enterprise, other |
| status | ENUM | quoted, in_progress, review, completed, cancelled |
| complexity | ENUM | basic, intermediate, advanced |
| timeline | ENUM | express, standard, flexible |
| estimated_min | INTEGER | USD |
| estimated_max | INTEGER | USD |
| progress | INTEGER | 0-100 |
| assigned_to | UUID | FK → profiles |

### discovery_calls
Llamadas de descubrimiento.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| client_id | UUID | FK → profiles |
| scheduled_at | TIMESTAMPTZ | |
| duration | INTEGER | minutos |
| status | ENUM | pending, confirmed, completed, cancelled, rescheduled |
| notes | TEXT | |
| professional_id | UUID | FK → profiles |

### messages
Sistema de mensajería.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| project_id | UUID | FK → projects |
| sender_id | UUID | FK → profiles |
| content | TEXT | |
| read | BOOLEAN | |

### deliverables
Entregables de proyectos.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| project_id | UUID | FK → projects |
| title | VARCHAR | |
| type | ENUM | code, design, document, deployment |
| url | TEXT | |

### invoices
Facturación.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| project_id | UUID | FK → projects |
| amount | INTEGER | USD cents |
| status | ENUM | pending, paid, overdue, cancelled |
| due_date | DATE | |

### quotations
Cotizaciones generadas.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| client_id | UUID | FK → profiles |
| project_type | ENUM | |
| complexity | ENUM | |
| timeline | ENUM | |
| estimated_min | INTEGER | |
| estimated_max | INTEGER | |

### clients (CRM)
Tabla adicional del CRM.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| company_name | VARCHAR | |
| contact_name | VARCHAR | |
| email | VARCHAR | UNIQUE |
| phone | VARCHAR | |
| status | ENUM | lead, prospect, active, inactive, churned |
| industry | VARCHAR | |
| budget_range | VARCHAR | |

### interactions
Interacciones con clientes.
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| client_id | UUID | FK → clients |
| type | ENUM | email, call, meeting, note, whatsapp, telegram |
| content | TEXT | |

## Características
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Triggers automáticos (updated_at)
- ✅ Índices optimizados
- ✅ ENUMs tipados
- ✅ Realtime habilitado (clients, interactions)

## Relacionado
- [[InventAgency Platform - MVP]]
- [[InventAgency - Tech Stack]]
