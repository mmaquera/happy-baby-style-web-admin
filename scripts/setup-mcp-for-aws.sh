#!/bin/bash

# Script para configurar MCP servers para AWS
echo "🚀 Configurando MCP servers para AWS..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo -e "${YELLOW}💡 Instálalo desde: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker encontrado${NC}"

# Crear directorio para MCP si no existe
MCP_DIR="$HOME/.mcp"
mkdir -p "$MCP_DIR"

# 1. Configurar PostgreSQL MCP Server
echo -e "\n${YELLOW}📦 Configurando PostgreSQL MCP Server...${NC}"

# Clonar el repositorio AWS Labs MCP
if [ ! -d "$MCP_DIR/aws-mcp" ]; then
    echo "📥 Clonando repositorio AWS Labs MCP..."
    git clone https://github.com/awslabs/mcp.git "$MCP_DIR/aws-mcp"
fi

# Construir imagen Docker para PostgreSQL
echo "🏗️ Construyendo imagen Docker para PostgreSQL MCP..."
cd "$MCP_DIR/aws-mcp/src/postgres-mcp-server"
docker build -t awslabs/postgres-mcp-server:latest .

# 2. Configurar AWS General MCP Server
echo -e "\n${YELLOW}📦 Configurando AWS General MCP Server...${NC}"

# Clonar el repositorio MCP AWS general
if [ ! -d "$MCP_DIR/mcp-server-aws" ]; then
    echo "📥 Clonando repositorio MCP Server AWS..."
    git clone https://github.com/rishikavikondala/mcp-server-aws.git "$MCP_DIR/mcp-server-aws"
fi

# Construir imagen Docker para AWS General
echo "🏗️ Construyendo imagen Docker para AWS General MCP..."
cd "$MCP_DIR/mcp-server-aws"
docker build -t mcp-server-aws:latest .

# 3. Configurar DynamoDB MCP Server (opcional)
echo -e "\n${YELLOW}📦 Configurando DynamoDB MCP Server...${NC}"
cd "$MCP_DIR/aws-mcp/src/dynamodb-mcp-server"
docker build -t awslabs/dynamodb-mcp-server:latest .

echo -e "\n${GREEN}✅ Todas las imágenes Docker están listas${NC}"

# Verificar las imágenes
echo -e "\n${YELLOW}📋 Imágenes Docker disponibles:${NC}"
docker images | grep -E "(postgres-mcp-server|mcp-server-aws|dynamodb-mcp-server)"

# Crear archivo de configuración para Claude Desktop
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
mkdir -p "$CLAUDE_CONFIG_DIR"

echo -e "\n${YELLOW}📝 Generando configuración para Claude Desktop...${NC}"

# Obtener información de AWS
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "ACCOUNT_ID")
AWS_REGION="us-east-2"

cat > "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "postgres-rds": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "AWS_ACCESS_KEY_ID",
        "-e", "AWS_SECRET_ACCESS_KEY",
        "-e", "AWS_SESSION_TOKEN",
        "-e", "AWS_REGION=$AWS_REGION",
        "awslabs/postgres-mcp-server:latest",
        "--resource_arn", "arn:aws:rds:$AWS_REGION:$AWS_ACCOUNT_ID:db:happy-baby-style-db",
        "--secret_arn", "arn:aws:secretsmanager:$AWS_REGION:$AWS_ACCOUNT_ID:secret:rds-db-credentials/postgres",
        "--database", "happy_baby_style_db",
        "--region", "$AWS_REGION",
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
        "-e", "AWS_REGION=$AWS_REGION",
        "mcp-server-aws:latest"
      ]
    }
  }
}
EOF

# Crear archivo para Amazon Q Developer CLI
Q_CONFIG_DIR="$HOME/.aws/amazonq"
mkdir -p "$Q_CONFIG_DIR"

cat > "$Q_CONFIG_DIR/mcp.json" << EOF
{
  "mcpServers": {
    "postgres-rds": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "AWS_ACCESS_KEY_ID",
        "-e", "AWS_SECRET_ACCESS_KEY", 
        "-e", "AWS_SESSION_TOKEN",
        "-e", "AWS_REGION=$AWS_REGION",
        "awslabs/postgres-mcp-server:latest",
        "--resource_arn", "arn:aws:rds:$AWS_REGION:$AWS_ACCOUNT_ID:db:happy-baby-style-db",
        "--secret_arn", "arn:aws:secretsmanager:$AWS_REGION:$AWS_ACCOUNT_ID:secret:rds-db-credentials/postgres",
        "--database", "happy_baby_style_db",
        "--region", "$AWS_REGION",
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
        "-e", "AWS_REGION=$AWS_REGION",
        "mcp-server-aws:latest"
      ]
    }
  }
}
EOF

echo -e "\n${GREEN}✅ Configuración completada!${NC}"
echo -e "\n${YELLOW}📋 Archivos de configuración creados:${NC}"
echo "   • Claude Desktop: $CLAUDE_CONFIG_DIR/claude_desktop_config.json"
echo "   • Amazon Q CLI: $Q_CONFIG_DIR/mcp.json"

echo -e "\n${YELLOW}🔧 Configuración manual requerida:${NC}"
echo "1. Actualiza ACCOUNT_ID en los archivos de configuración con tu AWS Account ID real"
echo "2. Configura AWS Secrets Manager para las credenciales de la base de datos"
echo "3. Asegúrate de que tu instancia RDS tenga Data API habilitado"

echo -e "\n${YELLOW}🧪 Para probar la configuración:${NC}"
echo "1. Abre Claude Desktop o Amazon Q"
echo "2. Pregunta: '¿Cuál es el esquema de mi base de datos PostgreSQL?'"
echo "3. Pregunta: '¿Cuál es el estado de mi instancia RDS?'"

echo -e "\n${GREEN}🎉 ¡Setup de MCP completado!${NC}"