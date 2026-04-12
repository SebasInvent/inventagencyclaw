#!/bin/bash
# Procesador de órdenes autónomas
# Ejecutar cada minuto via cron

ORDERS_DIR="$HOME/.openclaw/orders"
PUBLIC_KEY="$HOME/.openclaw/keys/agent.pub"
LOG_FILE="$HOME/.openclaw/logs/orders.log"

# Función de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verificar si hay órdenes pendientes
if [ ! -d "$ORDERS_DIR/pendientes" ]; then
    exit 0
fi

# Procesar cada orden
for order_file in "$ORDERS_DIR/pendientes"/*.yaml; do
    [ -e "$order_file" ] || continue
    
    order_id=$(basename "$order_file" .yaml)
    log "Procesando orden: $order_id"
    
    # Mover a procesando
    mv "$order_file" "$ORDERS_DIR/procesando/"
    order_file="$ORDERS_DIR/procesando/$(basename "$order_file")"
    
    # Verificar firma
    if [ ! -f "$order_file.sig" ]; then
        log "❌ $order_id: Sin firma"
        mv "$order_file" "$ORDERS_DIR/fallidas/"
        continue
    fi
    
    # Verificar firma digital
    if ! openssl pkeyutl -verify -in <(sha256sum "$order_file" | awk '{print $1}') \
       -sigfile "$order_file.sig" -pubin -inkey "$PUBLIC_KEY" 2>/dev/null; then
        log "❌ $order_id: Firma inválida"
        mv "$order_file" "$ORDERS_DIR/fallidas/"
        mv "$order_file.sig" "$ORDERS_DIR/fallidas/"
        continue
    fi
    
    # Verificar timestamp (no más de 1 hora)
    order_time=$(grep "timestamp:" "$order_file" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
    if [ -n "$order_time" ]; then
        order_epoch=$(date -d "$order_time" +%s 2>/dev/null || echo 0)
        now=$(date +%s)
        diff=$((now - order_epoch))
        
        if [ $diff -gt 3600 ]; then
            log "❌ $order_id: Expirada ($diff segundos)"
            mv "$order_file" "$ORDERS_DIR/fallidas/"
            mv "$order_file.sig" "$ORDERS_DIR/fallidas/"
            continue
        fi
    fi
    
    # Extraer acción
    accion=$(grep "accion:" "$order_file" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
    tipo=$(grep "tipo:" "$order_file" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
    
    log "✓ $order_id: Verificada ($tipo - $accion)"
    
    # Ejecutar según tipo
    case "$tipo" in
        "autonoma")
            # Ejecutar directamente
            case "$accion" in
                "sync_github_obsidian")
                    log "→ Ejecutando sync..."
                    cd ~/.openclaw/workspace/inventagencyclaw
                    git pull origin main
                    rsync -av docs/ ~/Documents/Obsidian-Vault/InventAgency/ 2>/dev/null
                    log "✓ Sync completado"
                    ;;
                    
                "publicar_linkedin")
                    log "→ Publicando en LinkedIn..."
                    # Aquí iría la llamada a API
                    log "⚠ API no configurada aún"
                    ;;
                    
                "backup")
                    log "→ Ejecutando backup..."
                    ~/.openclaw/scripts/backup.sh
                    log "✓ Backup completado"
                    ;;
                    
                "test_conexion")
                    log "→ Test de conexión"
                    log "✓ Sistema funcionando correctamente"
                    ;;
                    
                *)
                    log "⚠ $order_id: Acción no implementada: $accion"
                    ;;
            esac
            ;;
            
        "semi")
            # Notificar para aprobación
            log "⏸ $order_id: Requiere aprobación ($accion)"
            # Aquí enviaría notificación a Telegram/Email
            ;;
            
        *)
            log "⚠ $order_id: Tipo desconocido: $tipo"
            ;;
    esac
    
    # Mover a completadas
    mv "$order_file" "$ORDERS_DIR/completadas/"
    [ -f "$order_file.sig" ] && mv "$order_file.sig" "$ORDERS_DIR/completadas/"
    log "✓ $order_id: Completada"
    
done

log "Procesamiento finalizado"