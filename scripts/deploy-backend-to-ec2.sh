#!/bin/bash

# Script para desplegar el backend en EC2
# Uso: ./scripts/deploy-backend-to-ec2.sh

set -e

# Configuración
EC2_IP="18.117.175.151"
KEY_FILE="happy-baby-style-key.pem"
REMOTE_USER="ec2-user"
REMOTE_DIR="/opt/happy-baby-style"
BACKEND_DIR="backend"

echo "🚀 Iniciando despliegue del backend en EC2..."
echo "📍 IP: $EC2_IP"
echo "🔑 Key: $KEY_FILE"

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
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npm install --production"

# 6. Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cat > $REMOTE_DIR/.env << 'EOF'
NODE_ENV=production
PORT=3001
# DATABASE_URL temporal - cambiar cuando se cree RDS
DATABASE_URL=postgresql://postgres:password@localhost:5432/happybabystyle?schema=public
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this
JWT_EXPIRES_IN=24h
LOG_LEVEL=info
CORS_ORIGIN=*
GRAPHQL_PLAYGROUND=true
EOF"

# 7. Ejecutar migraciones de Prisma (comentado temporalmente hasta crear RDS)
echo "🗄️ Generando Prisma Client..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && npx prisma generate"
echo "⚠️ Migraciones de base de datos omitidas - RDS no creado aún"

# 8. Iniciar aplicación con PM2
echo "🚀 Iniciando aplicación con PM2..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 delete happy-baby-style-backend || true"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && pm2 start npm --name 'happy-baby-style-backend' -- run dev"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 save"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 startup"

# 9. Verificar que la aplicación esté corriendo
echo "✅ Verificando que la aplicación esté corriendo..."
sleep 5
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 status"
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "curl -s http://localhost:3001/health || echo 'Health check failed'"

echo "🎉 ¡Despliegue completado!"
echo "🌐 Tu backend está disponible en: http://$EC2_IP"
echo "🔍 GraphQL Playground: http://$EC2_IP/playground"
echo "📊 PM2 Status: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 status'" 