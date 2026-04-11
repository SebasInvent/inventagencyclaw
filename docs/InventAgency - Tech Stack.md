---
tags: [tecnico, stack, arquitectura]
created: 2026-04-11
---

# InventAgency - Tech Stack

## Frontend

| Layer | Technology | Version | Notas |
|-------|-----------|---------|-------|
| Framework | Next.js | 14+ (App Router) | Server Components by default |
| Language | TypeScript | 5.x strict | No `any` types |
| UI Library | React | 18+ / 19+ | Concurrent features |
| Components | shadcn/ui | Latest (new-york style) | 22+ componentes |
| Styling | TailwindCSS | 3.x / 4.x | Design tokens via CSS vars |
| Animations | Framer Motion | 12.x | Scroll-triggered, layout animations |
| Shaders | @paper-design/shaders-react | Latest | Liquid metal hero effect |
| Forms | React Hook Form + Zod | Latest | Shared validation schemas |
| State (client) | Zustand | 5.x | Lightweight, no boilerplate |
| State (server) | TanStack Query | v5 | Server state management |
| Icons | Lucide React | Latest | Consistent icon set |
| Smooth Scroll | Lenis | 1.x | For landing page |

## Backend

| Layer | Technology | Notas |
|-------|-----------|-------|
| Runtime | Node.js | 20+ LTS |
| API | tRPC / NestJS | Type-safe APIs |
| Validation | Zod | Shared frontend/backend |
| Auth | Supabase Auth | OAuth2, MFA, Google |
| Email | Resend | Transactional emails |
| Payments | Stripe | Webhooks required |
| File Storage | Cloudflare R2 / S3 | Pre-signed URLs |
| Realtime | Supabase Realtime | WebSockets |

## Database

| Layer | Technology | Notas |
|-------|-----------|-------|
| Primary DB | PostgreSQL | Via Supabase |
| ORM | Prisma | Migrations required |
| Cache | Redis (Upstash) | Rate limiting, sessions |
| Vector DB | pgvector (Supabase) | AI embeddings |
| Search | PostgreSQL FTS | Full text search |

## Infrastructure

| Layer | Technology | Notas |
|-------|-----------|-------|
| Web Hosting | Vercel / Cloudflare Pages | Edge-first |
| Serverless | Cloudflare Workers | Edge functions |
| CDN | Cloudflare | Global distribution |
| CI/CD | GitHub Actions | Automated pipelines |
| Monitoring | Sentry + Vercel Analytics | Error + performance |

## Blockchain (When Applicable)

| Layer | Technology | Notas |
|-------|-----------|-------|
| Smart Contracts | Solidity | OpenZeppelin base |
| Framework | Hardhat / Foundry | Testing + deployment |
| Client | ethers.js / viem + wagmi | Type-safe Web3 |
| Networks | Ethereum, Polygon, Arbitrum | Multi-chain |

## AI/ML (When Applicable)

| Layer | Technology | Notas |
|-------|-----------|-------|
| LLM | OpenAI / Anthropic | API integration |
| Framework | LangChain / Vercel AI SDK | Structured outputs |
| Embeddings | OpenAI / Supabase pgvector | RAG patterns |
| Image Gen | Replicate / DALL-E | Prototype generation |

## Relacionado
- [[InventAgency - Base de Datos Supabase]]
- [[InventAgency - Infraestructura y Deploy]]
- [[InventAgency - Componentes UI]]
