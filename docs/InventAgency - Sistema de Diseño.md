---
tags: [diseno, ux, design-system, ui]
created: 2026-04-11
---

# InventAgency - Sistema de Diseño

## Filosofía
Minimalista futurista. Glassmorphism + liquid metal. Efectos sutiles pero impactantes. Dark mode como default.

## Paleta de Colores

### Dark Mode (Default)
| Token | HSL | Hex | Uso |
|-------|-----|-----|-----|
| background | 0 0% 4% | #0A0A0A | Fondo principal |
| foreground | 0 0% 98% | #FAFAFA | Texto principal |
| primary | 187 100% 42% | #00D4FF | Cyan eléctrico, CTAs |
| secondary | 0 0% 12% | #1F1F1F | Fondo secundario |
| muted | 0 0% 12% | #1F1F1F | Texto secundario |
| accent | 187 100% 42% | #00D4FF | Highlights |
| destructive | 0 84% 60% | #E5484D | Errores, danger |
| border | 0 0% 15% | #262626 | Bordes |
| card | 0 0% 7% | #121212 | Fondo de cards |

### Light Mode
| Token | HSL | Uso |
|-------|-----|-----|
| background | 0 0% 100% | Fondo principal |
| foreground | 0 0% 4% | Texto principal |
| primary | 187 100% 42% | Cyan (igual) |
| secondary | 0 0% 96% | Fondo secundario |
| border | 0 0% 90% | Bordes |

### Colores Especiales
- **Gradient**: `from-[#00D4FF] to-[#00A3CC]` — Usado en `.gradient-text`
- **Glow**: `0 0 20px rgba(0, 212, 255, 0.3)` — Usado en `.glow`
- **Glow SM**: `0 0 10px rgba(0, 212, 255, 0.2)` — Usado en `.glow-sm`

## Tipografía
- **Font Family**: Inter (variable font)
- **CSS Variable**: `--font-inter`
- **Headings**: Bold, tracking-tight
- **Body**: Regular, antialiased

## Componentes UI (shadcn/ui - new-york style)

### Componentes Disponibles
| Componente | Archivo | Notas |
|-----------|---------|-------|
| Avatar | `avatar.tsx` | User avatars |
| Badge | `badge.tsx` | Tags, status indicators |
| Button | `button.tsx` | 6 variants, 4 sizes |
| Calendar | `calendar.tsx` | Date picker |
| Card | `card.tsx` | Content containers |
| Dialog | `dialog.tsx` | Modals |
| Dropdown | `dropdown-menu.tsx` | Context menus |
| Input | `input.tsx` | Text fields |
| Label | `label.tsx` | Form labels |
| Progress | `progress.tsx` | Progress bars |
| Radio Group | `radio-group.tsx` | Single selection |
| Scroll Area | `scroll-area.tsx` | Custom scrollbars |
| Select | `select.tsx` | Dropdowns |
| Separator | `separator.tsx` | Dividers |
| Sheet | `sheet.tsx` | Side panels |
| Slider | `slider.tsx` | Range inputs |
| Tabs | `tabs.tsx` | Tab navigation |
| Textarea | `textarea.tsx` | Multi-line input |
| Toast | `toast.tsx` | Notifications |
| Tooltip | `tooltip.tsx` | Hover info |
| **Liquid Metal Hero** | `liquid-metal-hero.tsx` | Hero section con shader |
| Theme Toggle | `ThemeToggle.tsx` | Dark/Light switch |

## Animaciones

### Framer Motion Patterns
- **Staggered entrance**: `staggerChildren: 0.15`
- **Fade up**: `opacity: 0, y: 30 → opacity: 1, y: 0`
- **Scale on hover**: `whileHover: { scale: 1.05 }`
- **Scale on tap**: `whileTap: { scale: 0.95 }`
- **Scroll-triggered**: `whileInView`

### Liquid Metal Shader
- Componente: `@paper-design/shaders-react`
- Preset: `liquidMetalPresets[2]`
- Posición: `fixed, inset: 0, zIndex: -10`
- Efecto: Fondo animado fluido que se adapta al tema

## Patrones de Diseño
- **Glassmorphism**: `bg-foreground/10 backdrop-blur-md border-foreground/20`
- **Glow effects**: `.glow` y `.glow-sm` utilities
- **Gradient text**: `.gradient-text` utility class
- **Responsive**: Mobile-first, breakpoints sm/md/lg/xl

## Relacionado
- [[InventAgency - Paleta de Colores]]
- [[InventAgency - Componentes UI]]
- [[InventAgency Web - Landing Rediseño]]
