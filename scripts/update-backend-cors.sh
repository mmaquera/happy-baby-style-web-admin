#!/bin/bash
# Script para actualizar CORS del backend para Amplify
# Uso: ./scripts/update-backend-cors.sh

set -e

# Configuración
EC2_IP="3.144.1.119"
KEY_FILE="happy-baby-style-key.pem"
REMOTE_USER="ec2-user"
REMOTE_DIR="/opt/happy-baby-style"

echo "🔧 Actualizando CORS del backend para Amplify..."
echo "📍 IP: $EC2_IP"

# 1. Verificar conexión SSH
echo "🔍 Verificando conexión SSH..."
ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$EC2_IP" "echo 'SSH OK'"

# 2. Crear archivo de configuración CORS temporal
echo "📝 Creando configuración CORS..."
cat > /tmp/cors-config.js << 'EOF'
// Configuración CORS para Amplify
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://*.amplifyapp.com',
  'https://*.amplifyapp.com/*',
  'https://main.*.amplifyapp.com',
  'https://main.*.amplifyapp.com/*'
];

const corsConfig = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida
    const isAllowed = corsOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsConfig;
EOF

# 3. Subir configuración al servidor
echo "📤 Subiendo configuración CORS..."
scp -i "$KEY_FILE" /tmp/cors-config.js "$REMOTE_USER@$EC2_IP:/tmp/"

# 4. Aplicar configuración
echo "⚙️ Aplicando configuración CORS..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "cd $REMOTE_DIR && cp /tmp/cors-config.js ./cors-config.js"

# 5. Reiniciar backend
echo "🔄 Reiniciando backend..."
ssh -i "$KEY_FILE" "$REMOTE_USER@$EC2_IP" "pm2 restart happy-baby-style-backend"

# 6. Limpiar archivos temporales
rm /tmp/cors-config.js

echo "✅ CORS actualizado para Amplify"
echo "🌐 El backend ahora acepta requests desde dominios de Amplify"
echo "📊 Verificar: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'pm2 status'" 