#!/bin/bash
# Script para desplegar el frontend en EC2
# Uso: ./scripts/deploy-frontend-to-ec2.sh

set -e

# Configuración - Misma instancia EC2
EC2_IP="3.144.1.119"
KEY_FILE="happy-baby-style-key.pem"
REMOTE_USER="ec2-user"
REMOTE_DIR="/home/ec2-user/happy-baby-style-frontend"
FRONTEND_DIR="frontend"

echo "🚀 Iniciando despliegue del frontend en EC2..."
echo "📍 IP: $EC2_IP"
echo "🔑 Key: $KEY_FILE"
echo "📁 Directorio remoto: $REMOTE_DIR"

# 1. Verificar que existe el key file
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo de clave $KEY_FILE"
    exit 1
fi

# 2. Verificar que existe el directorio dist
if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo "❌ Error: No se encuentra el directorio $FRONTEND_DIR/dist"
    echo "💡 Ejecuta 'cd frontend && npm run build' primero"
    exit 1
fi

# 3. Verificar conexión SSH
echo "🔍 Verificando conexión SSH..."
ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$EC2_IP" "echo 'SSH OK'"

# 4. Crear directorio remoto si no existe
echo "📁 Creando directorio remoto..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "mkdir -p $REMOTE_DIR"

# 5. Subir archivos del frontend
echo "📤 Subiendo archivos del frontend..."
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude 'src' \
    -e "ssh -i $KEY_FILE" \
    "$FRONTEND_DIR/" "$REMOTE_USER@$EC2_IP:$REMOTE_DIR/"

# 6. Verificar que npx esté disponible
echo "📦 Verificando npx..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "npx --version || echo 'npx no disponible'"

# 7. Detener proceso anterior si existe
echo "🛑 Deteniendo proceso anterior..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 delete happy-baby-style-frontend || true"

# 8. Iniciar frontend con PM2 usando npx serve
echo "🚀 Iniciando frontend con PM2..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 start 'npx serve -s dist -l 3000' --name 'happy-baby-style-frontend'"

# 9. Guardar configuración PM2
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 save"

# 10. Verificar que la aplicación esté corriendo
echo "✅ Verificando que la aplicación esté corriendo..."
sleep 5
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 status"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "curl -s http://localhost:3000 || echo 'Frontend check failed'"

echo "🎉 ¡Despliegue del frontend completado!"
echo "🌐 Tu frontend está disponible en: http://$EC2_IP:3000"
echo "📊 PM2 Status: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 status'"
echo "🔍 Logs: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 logs happy-baby-style-frontend'" 