#!/bin/bash
# Setup de seguridad OpenClaw
# Ejecutar como: sudo bash setup-seguridad.sh

echo "═══════════════════════════════════════"
echo "🔒 SETUP DE SEGURIDAD OPENCLAW"
echo "═══════════════════════════════════════"
echo ""

# 1. Generar puerto aleatorio
PUERTO=$((30000 + RANDOM % 35535))
echo "✓ Puerto seleccionado: $PUERTO"

# 2. Crear directorio de config
mkdir -p ~/.openclaw/config
mkdir -p ~/.openclaw/logs
mkdir -p ~/.openclaw/keys

# 3. Configurar gateway.yaml
cat > ~/.openclaw/config/gateway.yaml << EOF
server:
  host: 127.0.0.1
  port: $PUERTO
  
security:
  cors:
    origins:
      - "https://inventagency.co"
      - "http://localhost:*"
    credentials: true
  
  headers:
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    X-XSS-Protection: 1; mode=block
    Strict-Transport-Security: max-age=31536000
  
  rate_limit:
    enabled: true
    requests: 100
    window: 60

logging:
  level: info
  file: ~/.openclaw/logs/gateway.log
  sanitize:
    - password
    - token
    - key
    - secret
    - api_key
EOF

echo "✓ Configuración creada"

# 4. Crear .env template
cat > ~/.openclaw/.env.example << 'EOF'
# API Keys - NUNCA subir a GitHub
OPENCLAW_API_KEY=sk_live_...
RESEND_API_KEY=re_...
NOTION_TOKEN=secret_...
LINKEDIN_TOKEN=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# JWT Secret
generate con: openssl rand -base64 32
JWT_SECRET=...

# Webhook
WEBHOOK_TOKEN=...
EOF

echo "✓ Template .env creado"

# 5. Crear .gitignore
cat > ~/.openclaw/.gitignore << 'EOF'
# Secrets
.env
.env.local
*.key
*.pem
config/secrets.yaml

# Logs
logs/
*.log

# Runtime
tmp/
cache/

# OS
.DS_Store
Thumbs.db
EOF

echo "✓ .gitignore creado"

# 6. Generar claves para órdenes firmadas
openssl genpkey -algorithm Ed25519 -out ~/.openclaw/keys/agent.key 2>/dev/null
openssl pkey -in ~/.openclaw/keys/agent.key -pubout -out ~/.openclaw/keys/agent.pub 2>/dev/null

echo "✓ Claves de firma generadas"

# 7. Configurar UFW (si está instalado)
if command -v ufw &> /dev/null; then
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow $PUERTO/tcp comment 'OpenClaw Gateway'
    ufw allow 22/tcp comment 'SSH'
    echo "✓ UFW configurado (puerto $PUERTO abierto)"
else
    echo "⚠ UFW no instalado. Instalar con: sudo apt install ufw"
fi

# 8. Crear script de verificación
cat > ~/.openclaw/scripts/verify-order.sh << 'SCRIPT'
#!/bin/bash
# Verificar orden firmada

ORDER_FILE=$1
PUBLIC_KEY="$HOME/.openclaw/keys/agent.pub"

if [ ! -f "$ORDER_FILE" ]; then
    echo "Error: Archivo no encontrado"
    exit 1
fi

if [ ! -f "$ORDER_FILE.sig" ]; then
    echo "Error: Firma no encontrada"
    exit 1
fi

# Verificar firma
if ! openssl pkeyutl -verify -in "$ORDER_FILE" -sigfile "$ORDER_FILE.sig" -pubin -inkey "$PUBLIC_KEY" 2>/dev/null; then
    echo "❌ Orden inválida: firma no verificada"
    exit 1
fi

# Verificar timestamp
ORDER_TIME=$(grep "timestamp:" "$ORDER_FILE" | cut -d'"' -f2)
if [ -z "$ORDER_TIME" ]; then
    echo "❌ Orden sin timestamp"
    exit 1
fi

CURRENT_TIME=$(date -u +%s)
ORDER_EPOCH=$(date -d "$ORDER_TIME" +%s 2>/dev/null || echo 0)
DIFF=$((CURRENT_TIME - ORDER_EPOCH))

if [ $DIFF -gt 300 ]; then
    echo "❌ Orden expirada (más de 5 minutos)"
    exit 1
fi

echo "✅ Orden verificada"
exit 0
SCRIPT

chmod +x ~/.openclaw/scripts/verify-order.sh

echo "✓ Script de verificación creado"

# 9. Crear script de backup
cat > ~/.openclaw/scripts/backup.sh << 'SCRIPT'
#!/bin/bash
# Backup de configuración

BACKUP_DIR="$HOME/.openclaw/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp -r ~/.openclaw/config "$BACKUP_DIR/"
cp -r ~/.openclaw/keys "$BACKUP_DIR/"
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .
rm -rf "$BACKUP_DIR"

echo "Backup creado: $BACKUP_DIR.tar.gz"
SCRIPT

chmod +x ~/.openclaw/scripts/backup.sh

echo "✓ Script de backup creado"

# 10. Resumen
echo ""
echo "═══════════════════════════════════════"
echo "✅ SETUP DE SEGURIDAD COMPLETADO"
echo "═══════════════════════════════════════"
echo ""
echo "🔧 CONFIGURACIÓN:"
echo "   Puerto: $PUERTO"
echo "   Config: ~/.openclaw/config/gateway.yaml"
echo "   Logs: ~/.openclaw/logs/"
echo "   Keys: ~/.openclaw/keys/"
echo ""
echo "🔐 SIGUIENTES PASOS:"
echo "   1. Copiar .env.example a .env"
echo "   2. Agregar tus API keys al .env"
echo "   3. NUNCA subir .env a GitHub"
echo "   4. Probar: ~/.openclaw/scripts/verify-order.sh"
echo ""
echo "🚀 PARA INICIAR OPENCLAW:"
echo "   openclaw gateway start --config ~/.openclaw/config/gateway.yaml"
echo ""
echo "═══════════════════════════════════════"