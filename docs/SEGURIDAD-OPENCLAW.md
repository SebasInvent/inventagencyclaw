# Seguridad OpenClaw - Guía de Blindaje

> Protección completa del sistema y acceso seguro

---

## 🔍 Fugas de Seguridad Comunes

### 1. Puerto por Defecto (3000)
**Riesgo:** Puerto conocido, fácil de escanear
**Solución:** Cambiar a puerto aleatorio alto

```bash
# En ~/.openclaw/config/gateway.yaml
server:
  port: 38472  # Puerto aleatorio 30000-65535
```

### 2. API Keys en Archivos de Texto
**Riesgo:** Keys expuestas en repos públicos
**Solución:** Variables de entorno + gitignore

```bash
# ~/.openclaw/.env
OPENCLAW_API_KEY=sk_live_...
RESEND_API_KEY=re_...
NOTION_TOKEN=secret_...

# ~/.gitignore
.env
*.key
config/secrets.yaml
```

### 3. Sin Autenticación en API
**Riesgo:** Cualquiera puede llamar endpoints
**Solución:** JWT tokens + rate limiting

```yaml
# gateway.yaml
security:
  auth:
    type: jwt
    secret: ${JWT_SECRET}  # De env var
  rate_limit:
    requests: 100
    per_minute: 1
```

### 4. Logs Sensibles
**Riesgo:** Contraseñas en logs
**Solución:** Sanitización automática

```yaml
logging:
  level: info
  sanitize:
    - password
    - token
    - key
    - secret
```

### 5. Sin Encriptación en Tránsito
**Riesgo:** MITM attacks
**Solución:** TLS 1.3 obligatorio

```yaml
server:
  tls:
    enabled: true
    min_version: "1.3"
    cert: /path/to/cert.pem
    key: /path/to/key.pem
```

---

## 🛡️ Configuración Segura

### 1. Cambiar Puerto

```bash
# Editar config
cat >> ~/.openclaw/config/gateway.yaml << 'EOF'
server:
  host: 127.0.0.1  # Solo localhost
  port: 45219      # Puerto aleatorio
  
security:
  cors:
    origins:
      - "https://inventagency.co"
    credentials: true
  
  headers:
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    X-XSS-Protection: 1; mode=block
EOF
```

### 2. Firewall (UFW)

```bash
# Solo permitir puerto específico
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 45219/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### 3. Fail2Ban

```bash
# Instalar
sudo apt install fail2ban

# Configurar para OpenClaw
sudo cat > /etc/fail2ban/jail.local << 'EOF'
[openclaw]
enabled = true
port = 45219
filter = openclaw
logpath = /var/log/openclaw/gateway.log
maxretry = 3
bantime = 3600
EOF
```

### 4. VPN/Tailscale (Recomendado)

```bash
# Instalar Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# OpenClaw solo escucha en tailscale0
# IP: 100.x.x.x (solo accesible en tu red privada)
```

---

## 🔐 Sistema de Órdenes Seguras

### Formato de Orden Cifrada

```yaml
---
orden_id: "SEC-001"
timestamp: "2025-04-11T19:30:00Z"
origen: "usuario_verificado"
hash: "sha256:abc123..."

accion: "publicar_linkedin"
parametros:
  post_id: "2025-04-11-la-trampa"
  horario: "09:00"
  
firma: "ed25519:signature..."
---
```

### Verificación de Orden

```bash
#!/bin/bash
# verify-order.sh

ORDER_FILE=$1
PUBLIC_KEY="~/.openclaw/keys/user.pub"

# Verificar firma
if ! openssl dgst -sha256 -verify $PUBLIC_KEY -signature $ORDER_FILE.sig $ORDER_FILE; then
    echo "Orden inválida: firma no verificada"
    exit 1
fi

# Verificar timestamp (no más de 5 minutos)
ORDER_TIME=$(yq '.timestamp' $ORDER_FILE)
CURRENT_TIME=$(date -u +%s)
ORDER_EPOCH=$(date -d $ORDER_TIME +%s)
DIFF=$((CURRENT_TIME - ORDER_EPOCH))

if [ $DIFF -gt 300 ]; then
    echo "Orden expirada"
    exit 1
fi

echo "Orden verificada, ejecutando..."
```

---

## 📱 Integración con Dispositivos

### 1. App Móvil (Opción ligera)

```bash
# Web app PWA
# Acceso en: https://inventagency.co/agent
# Comunicación via WebSocket seguro (wss://)
```

### 2. Telegram Bot (Recomendado)

```bash
# Bot para órdenes rápidas
# Comandos:
# /orden publicar post de hoy
# /estado cómo vamos
# /recordatorio revisar métricas
```

### 3. Email Seguro

```bash
# Órdenes via email firmado
# Subject: [ORDEN] Publicar LinkedIn
# Body cifrado con PGP
```

---

## 🔔 Sistema de Recordatorios

### Configuración

```yaml
# ~/.openclaw/reminders.yaml
reminders:
  daily:
    - time: "09:00"
      message: "Revisar métricas de ayer"
      action: "generate_report"
    
    - time: "14:00"
      message: "Publicar contenido LinkedIn"
      action: "publish_scheduled"
  
  weekly:
    - day: monday
      time: "08:00"
      message: "Plan de la semana"
      action: "create_weekly_plan"
  
  triggers:
    - event: "new_lead"
      action: "send_welcome_sequence"
    
    - event: "no_activity_24h"
      action: "notify_user"
```

### Canales de Notificación

```yaml
notifications:
  channels:
    - type: telegram
      bot_token: ${TELEGRAM_BOT_TOKEN}
      chat_id: ${TELEGRAM_CHAT_ID}
    
    - type: email
      to: "hola@inventagency.co"
      smtp: ${SMTP_CONFIG}
    
    - type: webhook
      url: "https://inventagency.co/api/agent/notify"
      headers:
        Authorization: "Bearer ${WEBHOOK_TOKEN}"
```

---

## 🔑 Gestión de Credenciales

### 1. Vault (HashiCorp o similar)

```bash
# Almacenar secrets
vault kv put secret/openclaw/resend api_key=re_...
vault kv put secret/openclaw/linkedin token=...

# Leer en runtime
export RESEND_KEY=$(vault kv get -field=api_key secret/openclaw/resend)
```

### 2. SOPS (Simple y efectivo)

```bash
# Encriptar archivo
sops -e -i secrets.yaml

# Desencriptar al usar
sops -d secrets.yaml | yq '.resend.api_key'
```

### 3. 1Password CLI

```bash
# Integración con 1Password
op read "op://Private/OpenClaw Resend/credential"
```

---

## 🚀 Checklist de Seguridad

### Inmediato (Hoy)
- [ ] Cambiar puerto de 3000 a aleatorio
- [ ] Configurar firewall UFW
- [ ] Mover API keys a .env
- [ ] Agregar .env a .gitignore
- [ ] Generar par de claves para órdenes

### Esta semana
- [ ] Instalar fail2ban
- [ ] Configurar Tailscale
- [ ] Setup Telegram bot
- [ ] Crear sistema de órdenes firmadas
- [ ] Documentar procesos

### Este mes
- [ ] Auditoría de seguridad completa
- [ ] Pentest básico
- [ ] Backup automatizado
- [ ] Plan de recuperación

---

## 📞 Contacto de Emergencia

Si detectas intrusión:
1. Matar proceso OpenClaw: `pkill -f openclaw`
2. Revocar todas las API keys
3. Cambiar contraseñas
4. Revisar logs: `tail -f /var/log/openclaw/gateway.log`
5. Contactar soporte

---

*Documento creado: 2025-04-11*
*Nivel: Confidencial*
*Revisar: Mensualmente*