# Guía de Configuración MCP para Happy Baby Style

## ¿Qué es MCP?

Model Context Protocol (MCP) es un protocolo abierto que permite a los asistentes de IA acceder a datos externos de forma segura y estandarizada. Con MCP puedes hacer que Claude, Amazon Q u otros asistentes de IA entiendan y trabajen directamente con tu infraestructura AWS.

## ¿Para qué te va a servir?

### 🔍 **Revisiones de Infraestructura**
- "¿Cuál es el estado actual de mi RDS?"
- "¿Hay índices faltantes en mi base de datos?"
- "¿Qué tablas tienen más consultas lentas?"

### 📊 **Análisis de Base de Datos**
- "¿Cómo están relacionadas mis tablas de productos y pedidos?"
- "¿Cuántos usuarios han hecho pedidos este mes?"
- "¿Qué productos no tienen stock?"

### 🛡️ **Seguridad y Optimización**
- "¿Hay configuraciones de seguridad que deba revisar?"
- "¿Cuáles son las mejores prácticas para mi esquema actual?"
- "¿Cómo puedo optimizar mis consultas más lentas?"

### 💡 **Desarrollo Asistido**
- "Genera un query para obtener estadísticas de ventas"
- "¿Cómo puedo agregar una nueva tabla de reviews?"
- "Explícame las relaciones en mi esquema de e-commerce"

## Configuración Paso a Paso

### 1. Preparar el Entorno

```bash
# Ejecutar el script de configuración automática
./scripts/setup-mcp-for-aws.sh
```

Este script:
- ✅ Verifica que Docker esté instalado
- ✅ Clona los repositorios MCP de AWS
- ✅ Construye las imágenes Docker necesarias
- ✅ Crea archivos de configuración para Claude y Amazon Q

### 2. Configurar AWS Secrets Manager

```bash
# Configurar credenciales seguras para la base de datos
./scripts/configure-secrets-manager.sh
```

Este script:
- ✅ Crea un secreto en AWS Secrets Manager con las credenciales de RDS
- ✅ Obtiene los ARNs necesarios para la configuración
- ✅ Genera archivos de configuración con los valores correctos

### 3. Verificar la Configuración

```bash
# Verificar que todo esté funcionando
./scripts/check-rds-status.sh
```

## MCPs Configurados para tu Proyecto

### 🐘 **PostgreSQL MCP Server**
- **Funcionalidad**: Acceso directo a tu base de datos RDS
- **Capacidades**: 
  - Análisis de esquemas
  - Queries de solo lectura (por defecto)
  - Información de tablas y relaciones
  - Estadísticas de la base de datos

### ☁️ **AWS General MCP Server**  
- **Funcionalidad**: Gestión general de recursos AWS
- **Capacidades**:
  - Estado de instancias RDS
  - Información de buckets S3
  - Gestión de DynamoDB
  - Operaciones de infraestructura

## Herramientas Compatibles

### 🤖 **Claude Desktop**
Configuración automática en: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 💻 **Amazon Q Developer CLI**
Configuración automática en: `~/.aws/amazonq/mcp.json`

### 🔧 **Cursor IDE**
Usa la misma configuración que Amazon Q CLI

## Ejemplos de Uso

### Análisis de Esquema
```
Pregunta: "¿Puedes analizar el esquema de mi base de datos y decirme cómo están relacionadas las tablas?"

Respuesta esperada: Claude analizará tu esquema Prisma y te explicará:
- Relaciones entre User, Order, Product
- Índices existentes
- Posibles optimizaciones
```

### Revisión de Datos
```
Pregunta: "¿Cuántos productos tengo por categoría y cuáles están sin stock?"

Respuesta esperada: Claude ejecutará queries y te dará:
- Conteo de productos por categoría
- Lista de productos sin stock
- Recomendaciones de reabastecimiento
```

### Optimización de Infraestructura
```
Pregunta: "¿Cómo está el rendimiento de mi RDS y qué puedo optimizar?"

Respuesta esperada: Claude revisará:
- Métricas de CPU y memoria
- Consultas lentas
- Configuraciones recomendadas
- Sugerencias de índices
```

## Seguridad

### 🔒 **Modo Solo Lectura**
Por defecto, todos los MCPs están configurados en modo `--readonly true` para evitar cambios accidentales.

### 🛡️ **Credenciales Seguras**
- Las credenciales se almacenan en AWS Secrets Manager
- No hay credenciales hardcodeadas en los archivos
- Acceso controlado por IAM

### 🔐 **Permisos Mínimos**
Los MCPs requieren solo los permisos mínimos necesarios:
- `rds:DescribeDBInstances`
- `secretsmanager:GetSecretValue`
- `rds-data:*` (si usas Data API)

## Troubleshooting

### ❌ **Error: Docker no encontrado**
```bash
brew install docker
# O descarga Docker Desktop desde https://www.docker.com/
```

### ❌ **Error: Credenciales AWS no configuradas**
```bash
aws configure
# O configura variables de entorno AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
```

### ❌ **Error: No se puede conectar a RDS**
1. Verifica que la instancia esté en estado "available"
2. Revisa las reglas del security group
3. Confirma que las credenciales sean correctas

### ❌ **Error: Secreto no encontrado**
```bash
# Ejecuta nuevamente el script de configuración
./scripts/configure-secrets-manager.sh
```

## Archivos de Configuración

```
proyecto/
├── mcp-config.json                    # Configuración base
├── mcp-config-updated.json           # Configuración con ARNs reales
├── scripts/
│   ├── setup-mcp-for-aws.sh         # Setup automático
│   ├── configure-secrets-manager.sh  # Configuración de secretos
│   └── check-rds-status.sh          # Verificación RDS
└── MCP_SETUP_GUIDE.md               # Esta guía
```

## Próximos Pasos

1. **Ejecuta los scripts de configuración**
2. **Instala Claude Desktop o configura Amazon Q CLI**
3. **Prueba con preguntas simples sobre tu base de datos**
4. **Explora capacidades más avanzadas de análisis**

## Preguntas de Ejemplo para Probar

### Básicas
- "¿Cuál es el esquema de mi base de datos?"
- "¿Cuántas tablas tengo?"
- "¿Qué estado tiene mi instancia RDS?"

### Intermedias  
- "¿Cuáles son las relaciones más importantes en mi e-commerce?"
- "¿Qué productos no tienen stock actualmente?"
- "¿Cuántos pedidos se hicieron esta semana?"

### Avanzadas
- "¿Puedes analizar las consultas lentas y sugerir optimizaciones?"
- "¿Qué índices debería agregar para mejorar el rendimiento?"
- "¿Hay problemas de seguridad en mi configuración actual?"

---

¡Con esta configuración, tendrás un asistente de IA que realmente entiende tu infraestructura y puede ayudarte con revisiones inteligentes y análisis profundos!