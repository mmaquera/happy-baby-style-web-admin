#!/bin/bash

# Script para verificar el estado de la instancia RDS
echo "🔍 Verificando estado de la instancia RDS..."

DB_INSTANCE_ID="happy-baby-style-db"
REGION="us-east-2"

# Verificar si AWS CLI está configurado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    echo "💡 Instálalo con: brew install awscli"
    exit 1
fi

# Verificar estado de la instancia
echo "📊 Consultando estado de la instancia..."
STATUS=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ No se pudo encontrar la instancia $DB_INSTANCE_ID"
    echo "💡 Verifica que:"
    echo "   - La instancia esté creada en AWS Console"
    echo "   - Estés usando la región correcta ($REGION)"
    echo "   - AWS CLI esté configurado correctamente"
    exit 1
fi

echo "📋 Estado actual: $STATUS"

if [ "$STATUS" = "available" ]; then
    echo "✅ ¡Instancia lista para usar!"
    
    # Obtener endpoint
    ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $REGION \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)
    
    # Obtener puerto
    PORT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $REGION \
        --query 'DBInstances[0].Endpoint.Port' \
        --output text)
    
    echo ""
    echo "🔗 Información de conexión:"
    echo "   Endpoint: $ENDPOINT"
    echo "   Puerto: $PORT"
    echo "   Base de datos: happy_baby_style_db"
    echo "   Usuario: postgres"
    echo ""
    echo "📝 Connection String:"
    echo "   postgresql://postgres:TU_PASSWORD@$ENDPOINT:$PORT/happy_baby_style_db"
    echo ""
    
    # Actualizar archivo de configuración
    echo "📄 Actualizando archivo de configuración..."
    sed -i.bak "s/DB_HOST=.*/DB_HOST=$ENDPOINT/" /Users/mmaquera/Github/mmaquera/happy-baby-style-web-admin/aws-rds-config.env
    sed -i.bak "s/happy-baby-style-db\.xxxxxxxxxxxxx\.us-east-1\.rds\.amazonaws\.com/$ENDPOINT/g" /Users/mmaquera/Github/mmaquera/happy-baby-style-web-admin/aws-rds-config.env
    echo "✅ Archivo aws-rds-config.env actualizado"
    
elif [ "$STATUS" = "creating" ]; then
    echo "⏳ La instancia se está creando..."
    echo "🕐 Esto puede tomar 5-10 minutos"
    echo "🔄 Ejecuta este script nuevamente en unos minutos"
elif [ "$STATUS" = "modifying" ]; then
    echo "🔧 La instancia se está modificando..."
    echo "⏳ Espera unos minutos y vuelve a intentar"
else
    echo "⚠️ Estado inesperado: $STATUS"
    echo "🔍 Revisa la instancia en AWS Console"
fi