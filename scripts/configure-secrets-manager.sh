#!/bin/bash

# Script para configurar AWS Secrets Manager para RDS
echo "🔐 Configurando AWS Secrets Manager para RDS..."

# Configuración
DB_INSTANCE_ID="happy-baby-style-db"
REGION="us-east-2"
SECRET_NAME="rds-db-credentials/postgres"
DB_USERNAME="postgres"
DB_PASSWORD="HappyBaby2024!"
DB_NAME="happy_baby_style_db"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado${NC}"
    exit 1
fi

# Obtener el endpoint de la base de datos
echo "📊 Obteniendo información de la instancia RDS..."
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text 2>/dev/null)

if [ $? -ne 0 ] || [ "$DB_ENDPOINT" = "None" ]; then
    echo -e "${RED}❌ No se pudo obtener el endpoint de la instancia RDS${NC}"
    echo -e "${YELLOW}💡 Verifica que la instancia $DB_INSTANCE_ID exista en la región $REGION${NC}"
    exit 1
fi

DB_PORT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Port' \
    --output text)

echo -e "${GREEN}✅ Instancia RDS encontrada: $DB_ENDPOINT:$DB_PORT${NC}"

# Crear el secreto en AWS Secrets Manager
echo -e "\n${YELLOW}🔑 Creando secreto en AWS Secrets Manager...${NC}"

SECRET_VALUE=$(cat <<EOF
{
  "username": "$DB_USERNAME",
  "password": "$DB_PASSWORD",
  "engine": "postgres",
  "host": "$DB_ENDPOINT",
  "port": $DB_PORT,
  "dbname": "$DB_NAME",
  "dbInstanceIdentifier": "$DB_INSTANCE_ID"
}
EOF
)

# Verificar si el secreto ya existe
SECRET_EXISTS=$(aws secretsmanager describe-secret \
    --secret-id $SECRET_NAME \
    --region $REGION \
    --query 'Name' \
    --output text 2>/dev/null)

if [ "$SECRET_EXISTS" = "$SECRET_NAME" ]; then
    echo -e "${YELLOW}⚠️ El secreto ya existe. Actualizando...${NC}"
    
    aws secretsmanager update-secret \
        --secret-id $SECRET_NAME \
        --secret-string "$SECRET_VALUE" \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Secreto actualizado exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al actualizar el secreto${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}🆕 Creando nuevo secreto...${NC}"
    
    aws secretsmanager create-secret \
        --name $SECRET_NAME \
        --description "Credenciales para la base de datos RDS Happy Baby Style" \
        --secret-string "$SECRET_VALUE" \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Secreto creado exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al crear el secreto${NC}"
        exit 1
    fi
fi

# Obtener el ARN del secreto
SECRET_ARN=$(aws secretsmanager describe-secret \
    --secret-id $SECRET_NAME \
    --region $REGION \
    --query 'ARN' \
    --output text)

echo -e "\n${GREEN}🎯 ARN del secreto: $SECRET_ARN${NC}"

# Obtener el ARN de la instancia RDS
RDS_ARN=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBInstances[0].DBInstanceArn' \
    --output text)

echo -e "${GREEN}🎯 ARN de RDS: $RDS_ARN${NC}"

# Obtener Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}🎯 Account ID: $ACCOUNT_ID${NC}"

# Verificar si Data API está habilitado
echo -e "\n${YELLOW}🔍 Verificando si Data API está habilitado...${NC}"

DATA_API_ENABLED=$(aws rds describe-db-clusters \
    --db-cluster-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBClusters[0].EnableHttpEndpoint' \
    --output text 2>/dev/null)

if [ "$DATA_API_ENABLED" = "True" ]; then
    echo -e "${GREEN}✅ Data API está habilitado${NC}"
elif [ "$DATA_API_ENABLED" = "False" ]; then
    echo -e "${YELLOW}⚠️ Data API no está habilitado${NC}"
    echo -e "${YELLOW}💡 Para habilitar Data API ejecuta:${NC}"
    echo "aws rds modify-db-cluster --db-cluster-identifier $DB_INSTANCE_ID --enable-http-endpoint --region $REGION"
else
    echo -e "${YELLOW}ℹ️ Esta es una instancia RDS, no un cluster. Data API solo está disponible para Aurora Serverless${NC}"
    echo -e "${YELLOW}💡 Para MCP, usaremos conexión directa con credenciales${NC}"
fi

# Crear archivo de configuración actualizado
echo -e "\n${YELLOW}📝 Creando archivo de configuración MCP actualizado...${NC}"

cat > "mcp-config-updated.json" << EOF
{
  "mcpServers": {
    "postgres-rds": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "AWS_ACCESS_KEY_ID",
        "-e", "AWS_SECRET_ACCESS_KEY",
        "-e", "AWS_SESSION_TOKEN",
        "-e", "AWS_REGION=$REGION",
        "awslabs/postgres-mcp-server:latest",
        "--resource_arn", "$RDS_ARN",
        "--secret_arn", "$SECRET_ARN",
        "--database", "$DB_NAME",
        "--region", "$REGION",
        "--readonly", "true"
      ]
    },
    "aws-general": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "AWS_ACCESS_KEY_ID",
        "-e", "AWS_SECRET_ACCESS_KEY",
        "-e", "AWS_SESSION_TOKEN", 
        "-e", "AWS_REGION=$REGION",
        "mcp-server-aws:latest"
      ]
    }
  }
}
EOF

echo -e "\n${GREEN}✅ Configuración completada!${NC}"
echo -e "\n${YELLOW}📋 Información de configuración:${NC}"
echo "   • Secret ARN: $SECRET_ARN"
echo "   • RDS ARN: $RDS_ARN"
echo "   • Account ID: $ACCOUNT_ID"
echo "   • Archivo de configuración: mcp-config-updated.json"

echo -e "\n${YELLOW}🔧 Próximos pasos:${NC}"
echo "1. Copia mcp-config-updated.json a tu configuración de Claude/Amazon Q"
echo "2. Si usas Aurora, considera habilitar Data API para mejor rendimiento"
echo "3. Asegúrate de que tu usuario IAM tenga permisos para:"
echo "   - secretsmanager:GetSecretValue"
echo "   - rds:DescribeDBInstances"
echo "   - rds-data:* (si usas Data API)"