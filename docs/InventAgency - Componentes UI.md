---
tags: [tecnico, componentes, ui, shadcn]
created: 2026-04-11
---

# InventAgency - Componentes UI

## Setup
- **Librería**: shadcn/ui (new-york style)
- **Path**: `@/components/ui`
- **Config**: `components.json`
- **Utils**: `@/lib/utils` (cn function con clsx + tailwind-merge)

## Componentes Disponibles (22+)

### Form Elements
| Componente | Dependencia | Uso |
|-----------|-------------|-----|
| Button | @radix-ui/react-slot, cva | CTAs, acciones |
| Input | — | Text fields |
| Textarea | — | Multi-line input |
| Select | @radix-ui/react-select | Dropdowns |
| Radio Group | @radix-ui/react-radio-group | Single selection |
| Slider | @radix-ui/react-slider | Range inputs |
| Calendar | react-day-picker | Date picker |
| Label | @radix-ui/react-label | Form labels |

### Display
| Componente | Dependencia | Uso |
|-----------|-------------|-----|
| Card | — | Content containers |
| Badge | cva | Tags, status |
| Avatar | @radix-ui/react-avatar | User avatars |
| Progress | @radix-ui/react-progress | Progress bars |
| Separator | @radix-ui/react-separator | Dividers |
| Tooltip | @radix-ui/react-tooltip | Hover info |

### Overlay
| Componente | Dependencia | Uso |
|-----------|-------------|-----|
| Dialog | @radix-ui/react-dialog | Modals |
| Sheet | @radix-ui/react-dialog | Side panels |
| Dropdown Menu | @radix-ui/react-dropdown-menu | Context menus |
| Toast | @radix-ui/react-toast | Notifications |

### Navigation
| Componente | Dependencia | Uso |
|-----------|-------------|-----|
| Tabs | @radix-ui/react-tabs | Tab navigation |
| Scroll Area | @radix-ui/react-scroll-area | Custom scrollbars |

### Custom
| Componente | Dependencia | Uso |
|-----------|-------------|-----|
| **Liquid Metal Hero** | @paper-design/shaders-react, framer-motion | Hero section con shader animado |
| Theme Toggle | — | Dark/Light switch |

## Liquid Metal Hero - Detalle

### Props
```typescript
interface LiquidMetalHeroProps {
  badge?: string;           // Badge superior (ej: "Development on Demand")
  title: ReactNode;         // Título principal (soporta JSX)
  subtitle: string;         // Subtítulo descriptivo
  primaryCtaLabel: string;  // Texto del CTA principal
  secondaryCtaLabel?: string; // Texto del CTA secundario
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick?: () => void;
  features?: string[];      // Features cards (máx 3)
}
```

### Uso
```tsx
<LiquidMetalHero
  badge="Development on Demand"
  title={<>Transforma tu idea en <span className="gradient-text">realidad digital</span></>}
  subtitle="Cotiza tu proyecto en minutos..."
  primaryCtaLabel="Cotizar Proyecto"
  secondaryCtaLabel="Ver Prototipo con IA"
  onPrimaryCtaClick={() => setStep(1)}
  onSecondaryCtaClick={() => {}}
  features={["Prototipos con IA", "Equipo de Élite", "Entrega Garantizada"]}
/>
```

### Animaciones
- **Container**: Staggered children (0.15s delay)
- **Items**: Fade up (y: 30 → 0, opacity: 0 → 1)
- **Buttons**: Scale entrance (0.9 → 1)
- **Hover**: Scale 1.05 on buttons
- **Features**: Staggered slide-in (x: -20 → 0) with incremental delay

## Convenciones de Naming
| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `LiquidMetalHero.tsx` |
| Hooks | camelCase con `use` | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Tipos | PascalCase | `UserProfile` |

## Relacionado
- [[InventAgency - Sistema de Diseño]]
- [[InventAgency - Tech Stack]]
- [[InventAgency Platform - MVP]]
