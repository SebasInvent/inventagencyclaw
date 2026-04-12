# Sistema de Órdenes Autónomas - Invent Agency

> Protocolo seguro para ejecutar tareas sin intervención humana

---

## 📋 Formato de Orden

### Estructura YAML

```yaml
---
# Metadata
orden_id: "ORD-{timestamp}-{secuencia}"
timestamp: "2025-04-11T20:10:00Z"
version: "1.0"

# Autenticación
emisor: "usuario_verificado"
firma: "ed25519:..."
hash_contenido: "sha256:..."

# Acción
tipo: "autonoma"  # autonoma | semi | manual
accion: "publicar_contenido"
categoria: "marketing"  # marketing | ventas | producto | ops

# Parámetros
parametros:
  plataforma: "linkedin"
  contenido_id: "2025-04-11-post-1"
  horario: "09:00"
  timezone: "America/Bogota"

# Contexto
contexto:
  prioridad: "alta"  # critica | alta | media | baja
  urgencia: "normal"  # inmediata | hoy | esta_semana | flexible
  dependencias: []  # IDs de órdenes previas

# Restricciones
restricciones:
  max_intentos: 3
  ventana_tiempo: "09:00-18:00"
  requiere_aprobacion: false
  notificar_si_falla: true

# Éxito/Fracaso
criterios_exito:
  - "post_publicado"
  - "engagement > 1%"

si_falla:
  accion: "notificar"
  reintentar: true
  max_reintentos: 2

# Notificaciones
notificar:
  - canal: "telegram"
    cuando: ["inicio", "completada", "fallo"]
  - canal: "email"
    cuando: ["fallo"]
---
```

---

## 🔐 Firma Digital

### Generar Orden Firmada

```bash
#!/bin/bash
# sign-order.sh

ORDER_FILE=$1
PRIVATE_KEY="$HOME/.openclaw/keys/agent.key"

# Calcular hash
HASH=$(sha256sum $ORDER_FILE | awk '{print $1}')

# Firmar
openssl pkeyutl -sign -in <(echo $HASH) -inkey $PRIVATE_KEY -out $ORDER_FILE.sig

echo "Orden firmada: $ORDER_FILE.sig"
```

### Verificar Orden

```bash
#!/bin/bash
# verify-and-execute.sh

ORDER_FILE=$1
PUBLIC_KEY="$HOME/.openclaw/keys/agent.pub"

# Verificar firma
if ! openssl pkeyutl -verify -in <(sha256sum $ORDER_FILE | awk '{print $1}') \
   -sigfile $ORDER_FILE.sig -pubin -inkey $PUBLIC_KEY; then
    echo "❌ Firma inválida"
    exit 1
fi

# Verificar timestamp
ORDER_TIME=$(yq '.timestamp' $ORDER_FILE)
ORDER_EPOCH=$(date -d $ORDER_TIME +%s)
NOW=$(date +%s)
DIFF=$((NOW - ORDER_EPOCH))

if [ $DIFF -gt 300 ]; then  # 5 minutos
    echo "❌ Orden expirada"
    exit 1
fi

# Ejecutar
echo "✅ Orden verificada, ejecutando..."
execute-order $ORDER_FILE
```

---

## 🤖 Tipos de Órdenes

### 1. Órdenes Autónomas (Ejecutar sin preguntar)

**Requieren:**
- Firma válida
- Template pre-aprobado
- Parámetros dentro de límites

**Ejemplos:**
- Publicar post de LinkedIn (ya creado)
- Enviar newsletter (ya escrita)
- Sincronizar GitHub-Obsidian
- Generar reporte de métricas
- Backup automático

**Seguridad:**
- Solo acciones pre-definidas
- Sin acceso a APIs externas sin aprobación
- Logs completos
- Reversible

### 2. Órdenes Semi-Autónomas (Confirmar antes)

**Requieren:**
- Aprobación explícita
- Revisión de contenido generado
- Confirmación de parámetros

**Ejemplos:**
- Crear nuevo contenido
- Enviar email a cliente
- Publicar en redes (contenido nuevo)
- Hacer deploy
- Contactar a alguien

**Flujo:**
1. Yo preparo la acción
2. Te muestro preview
3. Tú apruebas/rechazas
4. Yo ejecuto

### 3. Órdenes Manuales (Solo preparar)

**Requieren:**
- Ejecución manual por ti
- Solo preparo todo listo

**Ejemplos:**
- Transferencias bancarias
- Contratos legales
- Decisiones estratégicas
- Cambios irreversibles

---

## 📱 Canales de Orden

### 1. Telegram (Recomendado)

**Comandos:**
```
/orden publicar linkedin hoy 9am
/estado orden ORD-001
/cancelar orden ORD-001
/plan semana
```

**Seguridad:**
- Bot token en .env
- Solo tu chat_id aceptado
- Logs de todos los comandos

### 2. Email Firmado

**Formato:**
```
Subject: [ORDEN] Publicar LinkedIn
From: tu-email@inventagency.co
X-Signature: ed25519:...

---
orden_id: "ORD-001"
accion: "publicar_linkedin"
...
---
```

### 3. Webhook Seguro

```bash
POST https://agent.inventagency.co/orden
Headers:
  Authorization: Bearer ${WEBHOOK_TOKEN}
  X-Signature: ed25519:...
  X-Timestamp: 2025-04-11T20:10:00Z

Body:
  { orden YAML firmada }
```

### 4. Archivo Local

```bash
# Crear orden
cat > ~/.openclaw/orders/pendientes/ORD-001.yaml << 'EOF'
---
orden_id: "ORD-001"
...
EOF

# Firmar
~/.openclaw/scripts/sign-order.sh ~/.openclaw/orders/pendientes/ORD-001.yaml

# Procesar automáticamente
~/.openclaw/scripts/process-orders.sh
```

---

## 🔄 Proceso de Ejecución

### Diagrama

```
┌─────────────┐
│   Orden     │
│  Recibida   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Verificar  │
│   Firma     │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────┐
│OK   │ │FAIL │
└──┬──┘ └──┬──┘
   │       │
   ▼       ▼
┌─────────┐ ┌─────────┐
│Verificar│ │Notificar│
│  Límite │ │  Fallo  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│Ejecutar │ │Reintentar│
│  Orden  │ │o Abortar │
└────┬────┘ └─────────┘
     │
     ▼
┌─────────┐
│Notificar│
│ Result  │
└─────────┘
```

### Estados

- `pendiente` - Esperando ejecución
- `verificando` - Validando firma/permisos
- `ejecutando` - En progreso
- `completada` - Éxito
- `fallida` - Error (con logs)
- `cancelada` - Abortada por usuario
- `reintentando` - Intento N de M

---

## 🛡️ Safeguards

### Límites Automáticos

```yaml
limits:
  ordenes_por_hora: 10
  ordenes_por_dia: 50
  reintentos_max: 3
  timeout_segundos: 300
  
  apis:
    linkedin_posts_dia: 5
    emails_hora: 20
    gasto_max_mes: $50
```

### Lista Blanca de Acciones

```yaml
allowed_actions:
  autonomas:
    - sync_github_obsidian
    - generate_report
    - backup_data
    - publish_scheduled_content
    
  semi:
    - create_new_content
    - send_email
    - publish_social
    - deploy_website
    
  manual:
    - financial_transaction
    - legal_document
    - delete_data
    - change_config
```

### Kill Switch

```bash
# ~/.openclaw/emergency-stop.sh

# Detener todas las órdenes
touch ~/.openclaw/STOP

# Revocar tokens
rm ~/.openclaw/.env

# Notificar
echo "🚨 EMERGENCIA: Todas las órdenes detenidas"
```

---

## 📊 Dashboard de Órdenes

### Métricas

```yaml
metricas:
  ordenes_hoy:
    total: 15
    completadas: 14
    fallidas: 1
    
  tiempo_promedio:
    ejecucion: "2.3 min"
    verificacion: "0.5 seg"
    
  autonomia:
    tasa_exito: "93%"
    intervenciones: 2
    ahorro_tiempo: "4.5 horas"
```

### Reporte Diario

```
📊 REPORTE DE ÓRDENES - 2025-04-11

✅ Completadas: 14/15 (93%)
❌ Fallidas: 1 (timeout)
⏱️ Tiempo ahorrado: 4.5 horas

Top Acciones:
  1. Publicar LinkedIn (5)
  2. Sync GitHub (3)
  3. Generar reportes (4)
  4. Backup (2)

Próximas 24h:
  • ORD-016: Newsletter (09:00)
  • ORD-017: Reporte semanal (14:00)
  • ORD-018: Backup (00:00)
```

---

## 🚀 Implementación

### Paso 1: Setup Inicial

```bash
# 1. Crear estructura
mkdir -p ~/.openclaw/orders/{pendientes,procesando,completadas,fallidas}

# 2. Configurar canales
cat > ~/.openclaw/channels.yaml << 'EOF'
telegram:
  enabled: true
  bot_token: ${TELEGRAM_BOT_TOKEN}
  allowed_chat_ids:
    - ${TELEGRAM_CHAT_ID}

email:
  enabled: true
  allowed_from:
    - "hola@inventagency.co"
  require_signature: true

webhook:
  enabled: true
  secret: ${WEBHOOK_SECRET}
  allowed_ips:
    - "127.0.0.1"
EOF

# 3. Iniciar procesador
crontab -l > /tmp/crontab.tmp
echo "* * * * * ~/.openclaw/scripts/process-orders.sh >> ~/.openclaw/logs/orders.log 2>&1" >> /tmp/crontab.tmp
crontab /tmp/crontab.tmp
```

### Paso 2: Prueba

```bash
# Crear orden de prueba
cat > ~/.openclaw/orders/pendientes/TEST-001.yaml << 'EOF'
---
orden_id: "TEST-001"
timestamp: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
tipo: "autonoma"
accion: "test_conexion"
parametros:
  mensaje: "Sistema de órdenes funcionando"
notificar:
  - canal: "telegram"
    cuando: ["completada"]
---
EOF

# Firmar y ejecutar
~/.openclaw/scripts/sign-order.sh ~/.openclaw/orders/pendientes/TEST-001.yaml
~/.openclaw/scripts/verify-and-execute.sh ~/.openclaw/orders/pendientes/TEST-001.yaml
```

---

## ✅ Checklist de Activación

- [ ] Estructura de directorios creada
- [ ] Claves de firma generadas
- [ ] Canales configurados (Telegram, Email, Webhook)
- [ ] Límites definidos
- [ ] Lista blanca de acciones
- [ ] Kill switch probado
- [ ] Primera orden de prueba exitosa
- [ ] Documentación actualizada
- [ ] Backup del sistema

---

*Sistema creado: 2025-04-11*
*Versión: 1.0*
*Estado: Listo para implementar*