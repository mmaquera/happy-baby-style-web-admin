# Configuración MCP en Cursor - Guía Paso a Paso

## 🎯 Configuración Directa en Cursor

### Paso 1: Instalar UV (Python Package Manager)
```bash
# En tu terminal:
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env
```

### Paso 2: Configurar MCP en Cursor

#### Opción A: Configuración Global (Recomendada)
1. **Abre Cursor**
2. **Presiona:** `Cmd + Shift + P` (macOS) o `Ctrl + Shift + P` (Windows/Linux)
3. **Busca:** "MCP: Configure"
4. **Selecciona:** "Edit Global MCP Configuration"

#### Opción B: Configuración por Workspace
1. **Abre Cursor**
2. **Ve a:** Settings → Extensions → MCP
3. **Crea archivo:** `.cursor/mcp.json` en la raíz de tu proyecto

### Paso 3: Pegar esta configuración

```json
{
  "mcpServers": {
    "postgres-rds": {
      "command": "uvx",
      "args": [
        "awslabs.postgres-mcp-server@latest",
        "--host", "happy-baby-style-db.cr0ug6u2oje3.us-east-2.rds.amazonaws.com",
        "--port", "5432",
        "--database", "happy_baby_style_db", 
        "--username", "postgres",
        "--password", "HappyBaby2024!",
        "--readonly", "true"
      ],
      "env": {
        "AWS_REGION": "us-east-2"
      }
    },
    "aws-general": {
      "command": "uvx",
      "args": [
        "mcp-server-aws@latest"
      ],
      "env": {
        "AWS_REGION": "us-east-2"
      }
    }
  }
}
```

### Paso 4: Reiniciar Cursor
- **Presiona:** `Cmd + Shift + P` → "Developer: Reload Window"

## 🔥 Configuración Ultra-Rápida (1 Click)

### Para Cursor con Amazon Q
Si tienes Amazon Q instalado en Cursor:

1. **Copia este enlace:**
```
https://cursor.com/install-mcp?name=postgres-rds&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJhd3NsYWJzLnBvc3RncmVzLW1jcC1zZXJ2ZXJAQGF0ZXN0IiwiLS1ob3N0IiwiaGFwcHktYmFieS1zdHlsZS1kYi5jcjB1ZzZ1Mm9qZTMudXMtZWFzdC0yLnJkcy5hbWF6b25hd3MuY29tIiwiLS1wb3J0IiwiNTQzMiIsIi0tZGF0YWJhc2UiLCJoYXBweV9iYWJ5X3N0eWxlX2RiIiwiLS11c2VybmFtZSIsInBvc3RncmVzIiwiLS1wYXNzd29yZCIsIkhhcHB5QmFieTIwMjQhIiwiLS1yZWFkb25seSIsInRydWUiXSwiZW52Ijp7IkFXU19SRUdJT04iOiJ1cy1lYXN0LTIifX0%3D
```

2. **Pégalo en tu navegador**
3. **Da click en "Install"**

## 🛠️ Configuración Manual Detallada

### Ubicaciones de Configuración:

#### macOS:
```bash
# Global
~/.cursor/mcp.json

# Por workspace
tu-proyecto/.cursor/mcp.json
```

#### Windows:
```bash
# Global  
%APPDATA%/Cursor/User/mcp.json

# Por workspace
tu-proyecto/.cursor/mcp.json
```

#### Linux:
```bash
# Global
~/.config/cursor/mcp.json

# Por workspace
tu-proyecto/.cursor/mcp.json
```

## 🔧 Verificar que Funciona

### 1. Abre el Chat de Cursor
- **Presiona:** `Cmd + I` (macOS) o `Ctrl + I` (Windows/Linux)

### 2. Pregunta algo como:
```
"¿Puedes analizar el esquema de mi base de datos PostgreSQL?"
```

### 3. Deberías ver:
- ✅ Cursor conectándose al MCP server
- ✅ Análisis de tu esquema de base de datos
- ✅ Respuestas sobre tus tablas User, Product, Order, etc.

## 🐛 Troubleshooting

### Error: "Command not found: uvx"
```bash
# Reinstalar UV:
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env

# O reiniciar terminal
```

### Error: "Cannot connect to database"
1. **Verifica que tu RDS esté running:**
   ```bash
   ./scripts/check-rds-status.sh
   ```

2. **Verifica las credenciales en el archivo de configuración**

3. **Verifica el security group de RDS permite conexiones desde tu IP**

### Error: "MCP server not found"
1. **Verifica la configuración MCP en Cursor:**
   - Settings → Extensions → MCP
   
2. **Reinstala los MCP servers:**
   ```bash
   uvx --reinstall awslabs.postgres-mcp-server@latest
   uvx --reinstall mcp-server-aws@latest
   ```

## 🎯 Preguntas de Ejemplo

Una vez configurado, puedes hacer preguntas como:

### Análisis de Base de Datos:
- "¿Cuántas tablas tengo y cómo están relacionadas?"
- "¿Qué productos no tienen stock?"
- "¿Cuántos usuarios se registraron esta semana?"

### Análisis de Código:
- "¿Mi esquema de Prisma tiene problemas de rendimiento?"
- "¿Debería agregar índices a alguna tabla?"
- "¿Cómo puedo optimizar mis consultas?"

### Infraestructura AWS:
- "¿Cuál es el estado de mi instancia RDS?"
- "¿Puedo revisar las métricas de mi base de datos?"
- "¿Hay configuraciones de seguridad que deba revisar?"

## 📁 Estructura Final del Proyecto

```
tu-proyecto/
├── .cursor/
│   └── mcp.json                 # Configuración MCP para este proyecto
├── cursor-mcp-config.json       # Configuración de respaldo
├── scripts/
│   ├── check-rds-status.sh     # Verificar estado RDS
│   └── setup-mcp-direct.sh     # Setup alternativo
└── CURSOR_MCP_SETUP.md         # Esta guía
```

## ✨ ¡Listo!

Con esta configuración tendrás:
- ✅ Acceso directo a tu RDS desde Cursor
- ✅ Análisis inteligente de tu base de datos
- ✅ Revisiones de infraestructura AWS
- ✅ Sin necesidad de Docker
- ✅ Configuración en 5 minutos

¡Ya puedes tener conversaciones inteligentes sobre tu base de datos directamente en Cursor!