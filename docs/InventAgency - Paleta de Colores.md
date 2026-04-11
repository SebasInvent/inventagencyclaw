---
tags: [diseno, colores, paleta, tokens]
created: 2026-04-11
---

# InventAgency - Paleta de Colores

## Color Primary
**Cyan Eléctrico**: `#00D4FF` / `hsl(187, 100%, 42%)`

Este es el color insignia de InventAgency. Se usa en:
- CTAs principales
- Acentos y highlights
- Iconos activos
- Gradientes

## Dark Mode (Default)

### Fondos
| Token | HSL | Hex | Uso |
|-------|-----|-----|-----|
| `--background` | 0 0% 4% | #0A0A0A | Fondo principal |
| `--card` | 0 0% 7% | #121212 | Fondo de cards |
| `--popover` | 0 0% 7% | #121212 | Fondo de popovers |
| `--secondary` | 0 0% 12% | #1F1F1F | Fondo secundario |
| `--muted` | 0 0% 12% | #1F1F1F | Fondo muted |

### Texto
| Token | HSL | Uso |
|-------|-----|-----|
| `--foreground` | 0 0% 98% | Texto principal |
| `--muted-foreground` | 0 0% 55% | Texto secundario |
| `--primary-foreground` | 0 0% 0% | Texto sobre primary |
| `--card-foreground` | 0 0% 98% | Texto en cards |

### Bordes y Inputs
| Token | HSL | Uso |
|-------|-----|-----|
| `--border` | 0 0% 15% | Bordes generales |
| `--input` | 0 0% 15% | Bordes de inputs |
| `--ring` | 187 100% 42% | Focus rings (cyan) |

### Chart Colors
| Token | HSL | Uso |
|-------|-----|-----|
| `--chart-1` | 187 100% 42% | Cyan |
| `--chart-2` | 160 60% 45% | Green-teal |
| `--chart-3` | 30 80% 55% | Orange |
| `--chart-4` | 280 65% 60% | Purple |
| `--chart-5` | 340 75% 55% | Pink |

## Light Mode

### Fondos
| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | 0 0% 100% | Blanco |
| `--card` | 0 0% 98% | Casi blanco |
| `--secondary` | 0 0% 96% | Gris claro |

### Texto
| Token | HSL | Uso |
|-------|-----|-----|
| `--foreground` | 0 0% 4% | Casi negro |
| `--muted-foreground` | 0 0% 45% | Gris |
| `--primary-foreground` | 0 0% 100% | Blanco sobre cyan |

## Utilidades CSS Custom

```css
.gradient-text {
  @apply bg-gradient-to-r from-[#00D4FF] to-[#00A3CC] bg-clip-text text-transparent;
}

.glow {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.glow-sm {
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}
```

## Glassmorphism Pattern
```css
bg-foreground/10 backdrop-blur-md border-foreground/20
```

## Relacionado
- [[InventAgency - Sistema de Diseño]]
- [[InventAgency - Componentes UI]]
