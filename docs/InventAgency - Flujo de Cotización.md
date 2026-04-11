---
tags: [proceso, cotizacion, flujo, negocio]
created: 2026-04-11
---

# InventAgency - Flujo de Cotización

## Wizard de 4 Pasos

### Paso 1: Tipo de Proyecto
**Pregunta**: "¿Qué tipo de solución necesitas?"

| Opción | Icono | Precio Base |
|--------|-------|-------------|
| App Móvil | Smartphone | $10,000 |
| App Web | Globe | $8,000 |
| API / Backend | Server | $6,000 |
| Inteligencia Artificial | Brain | $15,000 |
| Blockchain / Web3 | Link2 | $20,000 |
| Biometría / Seguridad | Shield | $18,000 |
| Dashboard / Analytics | BarChart3 | $7,000 |
| E-commerce | ShoppingCart | $12,000 |
| Sistema Empresarial | Building2 | $25,000 |
| Otro | Target | N/A |

### Paso 2: Complejidad
**Pregunta**: "¿Cuántas funcionalidades principales necesitas?"

| Nivel | Features | Ejemplos | Multiplicador |
|-------|----------|----------|---------------|
| Básico | 5-10 | Login, CRUD, Dashboard | 1x |
| Intermedio | 10-20 | + Pagos, Notificaciones, Reportes | 1.8x |
| Avanzado | 20+ | + IA, Integraciones, Real-time | 2.5x |

### Paso 3: Timeline
**Pregunta**: "¿Cuál es tu timeline ideal?"

| Opción | Semanas | Ajuste | Icono |
|--------|---------|--------|-------|
| Express | 4 | +30% | Zap |
| Estándar | 8 | 0% | CheckCircle2 |
| Flexible | 12+ | -10% | Clock |

### Paso 4: Resultado
- Cálculo automático: `basePrice × complexityMultiplier × timelineAdjustment`
- Muestra rango de precio estimado
- CTAs: Agendar Discovery Call / Ver Prototipo con IA
- Nota: Discovery Call de 60 min = $500 USD (se descuenta si continúa)

## Opciones de Pago
- 50% inicio / 50% entrega
- 3 pagos mensuales
- 6 pagos mensuales (empresas)

## Implementación
- **Componente**: Integrado en `page.tsx` (landing)
- **Hook**: `useQuotations` para guardar en Supabase
- **Tabla**: `quotations` en DB
- **Animaciones**: Framer Motion con AnimatePresence

## Relacionado
- [[InventAgency - Modelo de Negocio]]
- [[InventAgency - Discovery Call]]
- [[InventAgency Platform - MVP]]
