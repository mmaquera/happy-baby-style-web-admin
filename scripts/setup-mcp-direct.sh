#!/bin/bash

# Script para configurar MCP sin Docker usando UV
echo "🚀 Configurando MCP para AWS sin Docker..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar si UV está instalado
if ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando UV (Python package manager)...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi

echo -e "${GREEN}✅ UV encontrado${NC}"

# Verificar si Python está disponible
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}🐍 Instalando Python...${NC}"
    uv python install 3.11
fi

# Instalar MCP servers directamente
echo -e "\n${YELLOW}📦 Instalando PostgreSQL MCP Server...${NC}"
uv tool install awslabs.postgres-mcp-server

echo -e "\n${YELLOW}📦 Instalando DynamoDB MCP Server...${NC}"
uv tool install awslabs.dynamodb-mcp-server

echo -e "\n${YELLOW}📦 Instalando AWS General MCP Server...${NC}"
uv pip install mcp-server-aws

# Obtener información de AWS
AWS_REGION="us-east-2"
DB_INSTANCE_ID="happy-baby-style-db"
DB_NAME="happy_baby_style_db"

echo -e "\n${YELLOW}📊 Obteniendo información de AWS...${NC}"

# Obtener Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "TU_ACCOUNT_ID")

# Obtener endpoint RDS
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $AWS_REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text 2>/dev/null || echo "TU_RDS_ENDPOINT")

# Crear configuración para Claude Desktop
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
mkdir -p "$CLAUDE_CONFIG_DIR"

echo -e "\n${YELLOW}📝 Creando configuración para Claude Desktop...${NC}"

cat > "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "postgres-rds": {
      "command": "uvx",
      "args": [
        "awslabs.postgres-mcp-server@latest",
        "--host", "$DB_ENDPOINT",
        "--port", "5432",
        "--database", "$DB_NAME",
        "--username", "postgres",
        "--password", "\${POSTGRES_PASSWORD}",
        "--readonly", "true"
      ],
      "env": {
        "POSTGRES_PASSWORD": "HappyBaby2024!"
      }
    },
    "aws-general": {
      "command": "uvx", 
      "args": [
        "mcp-server-aws@latest"
      ],
      "env": {
        "AWS_REGION": "$AWS_REGION"
      }
    }
  }
}
EOF

# Crear configuración para Amazon Q CLI
Q_CONFIG_DIR="$HOME/.aws/amazonq"
mkdir -p "$Q_CONFIG_DIR"

cat > "$Q_CONFIG_DIR/mcp.json" << EOF
{
  "mcpServers": {
    "postgres-rds": {
      "command": "uvx",
      "args": [
        "awslabs.postgres-mcp-server@latest",
        "--host", "$DB_ENDPOINT", 
        "--port", "5432",
        "--database", "$DB_NAME",
        "--username", "postgres",
        "--password", "\${POSTGRES_PASSWORD}",
        "--readonly", "true"
      ],
      "env": {
        "POSTGRES_PASSWORD": "HappyBaby2024!"
      }
    },
    "aws-general": {
      "command": "uvx",
      "args": [
        "mcp-server-aws@latest"
      ],
      "env": {
        "AWS_REGION": "$AWS_REGION"
      }
    }
  }
}
EOF

echo -e "\n${GREEN}✅ Configuración completada sin Docker!${NC}"
echo -e "\n${YELLOW}📋 Archivos creados:${NC}"
echo "   • Claude Desktop: $CLAUDE_CONFIG_DIR/claude_desktop_config.json"
echo "   • Amazon Q CLI: $Q_CONFIG_DIR/mcp.json"

echo -e "\n${YELLOW}🔧 Para usar:${NC}"
echo "1. Instala Claude Desktop o Amazon Q CLI"
echo "2. Los MCP servers se ejecutarán automáticamente con UV"
echo "3. No necesitas Docker ejecutándose"

echo -e "\n${YELLOW}🧪 Prueba:${NC}"
echo "Pregunta: '¿Cuál es el esquema de mi base de datos PostgreSQL?'"