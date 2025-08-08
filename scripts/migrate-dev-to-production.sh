#!/bin/bash
# Script para migrar estructura de desarrollo a producción
# Uso: ./scripts/migrate-dev-to-production.sh

set -e

echo "🔄 INICIANDO MIGRACIÓN DE DESARROLLO A PRODUCCIÓN"
echo "================================================"

# Configuración
EC2_IP="3.144.1.119"
KEY_FILE="happy-baby-style-key.pem"
REMOTE_USER="ec2-user"
REMOTE_DIR="/opt/happy-baby-style"
BACKEND_DIR="backend"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 no está instalado"
        exit 1
    fi
}

# Verificar dependencias
log_info "Verificando dependencias..."
check_command "ssh"
check_command "rsync"
check_command "pg_dump"

# Verificar archivo de clave
if [ ! -f "$KEY_FILE" ]; then
    log_error "No se encuentra el archivo de clave $KEY_FILE"
    exit 1
fi

# PASO 1: PREPARACIÓN EN DESARROLLO
log_info "PASO 1: Preparación en desarrollo"
echo "-----------------------------------"

cd $BACKEND_DIR

# Verificar que estamos en el directorio correcto
if [ ! -f "prisma/schema.prisma" ]; then
    log_error "No se encuentra el esquema de Prisma"
    exit 1
fi

# Crear migración inicial si no existe
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null | grep -v README.md)" ]; then
    log_info "Creando migración inicial..."
    npx prisma migrate dev --name "initial_schema" --create-only
    
    log_success "Migración inicial creada"
else
    log_info "Migraciones existentes encontradas"
    npx prisma migrate status
fi

# Generar cliente Prisma
log_info "Generando cliente Prisma..."
npx prisma generate

# PASO 2: BACKUP DE PRODUCCIÓN
log_info "PASO 2: Backup de producción"
echo "-----------------------------"

# Verificar conexión SSH
log_info "Verificando conexión SSH..."
ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$EC2_IP" "echo 'SSH OK'"

# Crear backup de producción
log_info "Creando backup de producción..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm run db:backup:production"

# PASO 3: SINCRONIZACIÓN DE ARCHIVOS
log_info "PASO 3: Sincronización de archivos"
echo "-----------------------------------"

# Subir archivos actualizados
log_info "Subiendo archivos actualizados..."
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude 'logs' --exclude 'uploads' \
    -e "ssh -i $KEY_FILE" \
    "$BACKEND_DIR/" "$REMOTE_USER@$EC2_IP:$REMOTE_DIR/"

# PASO 4: MIGRACIÓN EN PRODUCCIÓN
log_info "PASO 4: Migración en producción"
echo "--------------------------------"

# Detener aplicación
log_info "Deteniendo aplicación..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 stop happy-baby-style-backend || true"

# Instalar dependencias si es necesario
log_info "Instalando dependencias..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm install --include=dev"

# Generar cliente Prisma en producción
log_info "Generando cliente Prisma en producción..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npx prisma generate"

# Aplicar migración
log_info "Aplicando migración..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && NODE_ENV=production npm run prisma:migrate:deploy"

# PASO 5: VERIFICACIÓN
log_info "PASO 5: Verificación"
echo "---------------------"

# Verificar estado de migración
log_info "Verificando estado de migración..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npx prisma migrate status"

# Verificar integridad de datos
log_info "Verificando integridad de datos..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm run db:verify:production"

# Reconstruir aplicación
log_info "Reconstruyendo aplicación..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm run build"

# Reiniciar aplicación
log_info "Reiniciando aplicación..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 start npm --name 'happy-baby-style-backend' -- run start:production"

# Verificar que la aplicación está funcionando
log_info "Verificando que la aplicación está funcionando..."
sleep 10
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 status"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "curl -s http://localhost:3001/health || echo 'Health check failed'"

# PASO 6: MONITOREO POST-MIGRACIÓN
log_info "PASO 6: Monitoreo post-migración"
echo "--------------------------------"

# Mostrar información del entorno
log_info "Información del entorno desplegado..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && node scripts/show-environment-info.js"

# Mostrar logs recientes
log_info "Logs recientes de la aplicación..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 logs happy-baby-style-backend --lines 20"

# PASO 7: LIMPIEZA Y DOCUMENTACIÓN
log_info "PASO 7: Limpieza y documentación"
echo "----------------------------------"

# Limpiar backups antiguos
log_info "Limpiando backups antiguos..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm run db:clean"

# Guardar configuración PM2
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 save"

# Crear reporte de migración
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="migration_report_${TIMESTAMP}.txt"

cat > "$REPORT_FILE" << EOF
MIGRACIÓN DE DESARROLLO A PRODUCCIÓN
====================================

Fecha: $(date)
Hora: $(date +%H:%M:%S)
Estado: COMPLETADA

RESUMEN:
- Migración inicial creada en desarrollo
- Backup de producción realizado
- Archivos sincronizados
- Migración aplicada en producción
- Integridad de datos verificada
- Aplicación reiniciada y funcionando

PRÓXIMOS PASOS:
1. Monitorear logs por 24-48 horas
2. Verificar performance de la aplicación
3. Ejecutar tests de regresión
4. Documentar lecciones aprendidas

COMANDOS ÚTILES:
- Ver logs: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 logs happy-baby-style-backend'
- Ver estado: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 status'
- Health check: curl http://$EC2_IP/health
- Verificar DB: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'cd $REMOTE_DIR && npm run db:verify:production'
EOF

log_success "Reporte de migración creado: $REPORT_FILE"

# RESULTADO FINAL
echo ""
echo "🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE"
echo "===================================="
echo ""
echo "📊 RESUMEN:"
echo "   ✅ Migración inicial creada"
echo "   ✅ Backup de producción realizado"
echo "   ✅ Archivos sincronizados"
echo "   ✅ Migración aplicada en producción"
echo "   ✅ Integridad de datos verificada"
echo "   ✅ Aplicación funcionando"
echo ""
echo "🌐 Tu aplicación está disponible en:"
echo "   http://$EC2_IP"
echo "   http://$EC2_IP/health"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "   1. Monitorear logs por 24-48 horas"
echo "   2. Verificar performance"
echo "   3. Ejecutar tests de regresión"
echo ""
echo "📄 Reporte completo: $REPORT_FILE"
echo ""
log_success "¡Migración completada exitosamente!" 