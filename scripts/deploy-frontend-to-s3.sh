#!/bin/bash
# Script para desplegar el frontend a S3
# Uso: ./scripts/deploy-frontend-to-s3.sh

set -e

# Configuración
BUCKET_NAME="happy-baby-style-frontend-2024"
FRONTEND_DIR="frontend/dist"
REGION="us-east-2"

echo "🚀 Iniciando despliegue del frontend a S3..."
echo "📦 Bucket: $BUCKET_NAME"
echo "📁 Directorio: $FRONTEND_DIR"

# 1. Verificar que existe el directorio dist
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: No se encuentra el directorio $FRONTEND_DIR"
    echo "💡 Ejecuta 'cd frontend && npm run build' primero"
    exit 1
fi

# 2. Verificar que el bucket existe
echo "🔍 Verificando que el bucket existe..."
if ! aws s3 ls "s3://$BUCKET_NAME" > /dev/null 2>&1; then
    echo "❌ Error: El bucket $BUCKET_NAME no existe"
    echo "💡 Crea el bucket en la consola de AWS S3 primero"
    exit 1
fi

# 3. Subir archivos al bucket
echo "📤 Subiendo archivos al bucket..."
aws s3 sync "$FRONTEND_DIR" "s3://$BUCKET_NAME" --delete

# 4. Configurar el bucket para hosting estático
echo "⚙️ Configurando hosting estático..."
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

# 5. Configurar política de bucket para acceso público
echo "🔓 Configurando política de acceso público..."
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json

# 6. Limpiar archivo temporal
rm /tmp/bucket-policy.json

echo "🎉 ¡Despliegue completado!"
echo "🌐 Tu frontend está disponible en: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "📊 Para verificar: aws s3 ls s3://$BUCKET_NAME" 