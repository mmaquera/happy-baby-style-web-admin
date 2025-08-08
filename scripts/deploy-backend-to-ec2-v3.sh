#!/bin/bash
# Script para desplegar el backend en EC2 v3 con configuración de entorno mejorada
# Uso: ./scripts/deploy-backend-to-ec2-v3.sh

set -e

# Configuración - Misma instancia EC2
EC2_IP="3.144.1.119"
KEY_FILE="happy-baby-style-key.pem"
REMOTE_USER="ec2-user"
REMOTE_DIR="/opt/happy-baby-style"
BACKEND_DIR="backend"

echo "🚀 Iniciando despliegue del backend en EC2 v3 (Environment Config)..."
echo "📍 IP: $EC2_IP"
echo "🔑 Key: $KEY_FILE"
echo "📁 Directorio remoto: $REMOTE_DIR"

# 1. Verificar que existe el key file
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo de clave $KEY_FILE"
    exit 1
fi

# 2. Verificar conexión SSH
echo "🔍 Verificando conexión SSH..."
ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$EC2_IP" "echo 'SSH OK'"

# 3. Crear directorio remoto si no existe
echo "📁 Creando directorio remoto..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "mkdir -p $REMOTE_DIR"

# 4. Subir archivos del backend
echo "📤 Subiendo archivos del backend..."
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude 'logs' --exclude 'uploads' \
    -e "ssh -i $KEY_FILE" \
    "$BACKEND_DIR/" "$REMOTE_USER@$EC2_IP:$REMOTE_DIR/"

# 5. Instalar dependencias
echo "📦 Instalando dependencias..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm install --include=dev"

# 6. Configurar variables de entorno para producción
echo "⚙️ Configurando variables de entorno para producción..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cat > $REMOTE_DIR/.env << 'EOF'
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-amplify-domain.amplifyapp.com

# Database Configuration - Local PostgreSQL for Production
DATABASE_URL=postgresql://happybabystyle:happybabystyle123@localhost:5432/happybabystyle?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

# OAuth General Configuration
OAUTH_STATE_SECRET=your-production-oauth-state-secret
SESSION_SECRET=your-production-session-secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging Configuration
LOG_LEVEL=info
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
LOG_ENABLE_DAILY_ROTATE=true
LOG_DIRECTORY=./logs
LOG_MAX_FILES=30d
LOG_MAX_SIZE=50m
LOG_FORMAT=json
LOG_INCLUDE_TIMESTAMP=true
LOG_INCLUDE_TRACE_ID=true
LOG_INCLUDE_REQUEST_ID=true
LOG_INCLUDE_USER_ID=true
LOG_ENABLE_ERROR_STACK=true
LOG_ENABLE_PERFORMANCE=true

# Feature Flags
GRAPHQL_PLAYGROUND=false
CORS_ORIGIN=https://*.amplifyapp.com,https://your-domain.com
EOF"

# 7. Ejecutar migraciones de Prisma
echo "🗄️ Ejecutando migraciones de base de datos..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npx prisma generate"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npx prisma db push"

# 8. Validar configuración del entorno
echo "🔍 Validando configuración del entorno..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm run build"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && node scripts/validate-environment.js"

# 9. Iniciar aplicación con PM2
echo "🚀 Iniciando aplicación con PM2..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 delete happy-baby-style-backend || true"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 start npm --name 'happy-baby-style-backend' -- run start:production"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 save"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 startup"

# 10. Verificar que la aplicación esté corriendo
echo "✅ Verificando que la aplicación esté corriendo..."
sleep 5
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 status"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "curl -s http://localhost:3001/health || echo 'Health check failed'"

# 11. Mostrar información del entorno
echo "📊 Información del entorno desplegado..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && node scripts/show-environment-info.js"

echo "🎉 ¡Despliegue completado!"
echo "🌐 Tu backend está disponible en: http://$EC2_IP"
echo "🔍 GraphQL Playground: http://$EC2_IP/playground (deshabilitado en producción)"
echo "📊 PM2 Status: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 status'"
echo "🔍 Logs: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 logs happy-baby-style-backend'" 