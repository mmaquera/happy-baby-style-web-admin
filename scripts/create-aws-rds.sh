#!/bin/bash

# Script para crear instancia RDS PostgreSQL en AWS
# Configurado para Free Tier

echo "🚀 Creando instancia RDS PostgreSQL para Happy Baby Style..."

# Variables de configuración
DB_INSTANCE_ID="happy-baby-style-db"
DB_NAME="happy_baby_style_db"
DB_USERNAME="postgres"
DB_PASSWORD="HappyBaby2024!"
SECURITY_GROUP_NAME="happy-baby-style-db-sg"
REGION="us-east-2"

# 1. Crear Security Group
echo "📡 Creando Security Group..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name $SECURITY_GROUP_NAME \
    --description "Security group for Happy Baby Style PostgreSQL database" \
    --region $REGION \
    --query 'GroupId' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Security Group creado: $SECURITY_GROUP_ID"
else
    echo "❌ Error creando Security Group"
    exit 1
fi

# 2. Agregar regla de ingreso para PostgreSQL
echo "🔐 Configurando reglas de seguridad..."
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $REGION

echo "✅ Regla PostgreSQL agregada al Security Group"

# 3. Crear instancia RDS
echo "🗄️ Creando instancia RDS PostgreSQL..."
aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class db.t4g.micro \
    --engine postgres \
    --engine-version "16.4" \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --storage-type gp2 \
    --db-name $DB_NAME \
    --vpc-security-group-ids $SECURITY_GROUP_ID \
    --backup-retention-period 7 \
    --storage-encrypted \
    --publicly-accessible \
    --auto-minor-version-upgrade \
    --region $REGION \
    --tags "Key=Project,Value=HappyBabyStyle" "Key=Environment,Value=Production"

if [ $? -eq 0 ]; then
    echo "✅ Instancia RDS creada exitosamente"
    echo "📝 Detalles:"
    echo "   - DB Instance: $DB_INSTANCE_ID"
    echo "   - Database: $DB_NAME"
    echo "   - Username: $DB_USERNAME"
    echo "   - Security Group: $SECURITY_GROUP_ID"
    echo ""
    echo "⏳ La instancia tardará 5-10 minutos en estar disponible"
    echo "🔍 Puedes verificar el estado en: AWS Console > RDS > Databases"
    echo ""
    echo "🔗 Para obtener el endpoint:"
    echo "   aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query 'DBInstances[0].Endpoint.Address' --output text"
else
    echo "❌ Error creando instancia RDS"
    exit 1
fi

echo "🎉 ¡Configuración completada!"