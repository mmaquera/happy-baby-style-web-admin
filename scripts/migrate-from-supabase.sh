#!/bin/bash

# Script completo de migración de Supabase a AWS RDS
echo "🚀 Migración de Supabase a AWS RDS PostgreSQL"
echo "============================================="
echo ""

# Verificar herramientas necesarias
if ! command -v psql &> /dev/null; then
    echo "❌ psql no está disponible"
    echo "💡 Ejecuta: export PATH=\"/opt/homebrew/opt/postgresql@16/bin:\$PATH\""
    exit 1
fi

if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump no está disponible"
    echo "💡 Ejecuta: export PATH=\"/opt/homebrew/opt/postgresql@16/bin:\$PATH\""
    exit 1
fi

# URLs de conexión
echo "📋 Configuración de conexiones"
echo "==============================="
echo ""

# Solicitar URL de Supabase
echo "🔗 Necesitamos la URL de conexión de Supabase"
echo "💡 Puedes encontrarla en:"
echo "   1. Ve a tu proyecto en supabase.com"
echo "   2. Settings → Database → Connection String"
echo "   3. Copia la URL que dice 'postgresql://...'"
echo ""
read -p "📝 Pega aquí tu Supabase URL: " SUPABASE_URL

if [[ -z "$SUPABASE_URL" ]]; then
    echo "❌ URL de Supabase requerida"
    exit 1
fi

# Solicitar endpoint de AWS RDS
echo ""
echo "🔗 Necesitamos el endpoint de tu instancia RDS"
echo "💡 Puedes encontrarlo en:"
echo "   1. Ve a AWS Console → RDS → Databases"
echo "   2. Click en tu instancia 'happy-baby-style-db'"
echo "   3. Copia el 'Endpoint'"
echo ""
read -p "📝 Pega aquí tu RDS Endpoint: " RDS_ENDPOINT

if [[ -z "$RDS_ENDPOINT" ]]; then
    echo "❌ Endpoint de RDS requerido"
    exit 1
fi

# Construir URL de AWS RDS
RDS_URL="postgresql://postgres:HappyBaby2024!@${RDS_ENDPOINT}:5432/happy_baby_style_db"

echo ""
echo "✅ URLs configuradas:"
echo "   Supabase: ${SUPABASE_URL:0:50}..."
echo "   AWS RDS:  ${RDS_URL:0:50}..."
echo ""

# Crear directorio de backup
BACKUP_DIR="./migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Directorio de backup: $BACKUP_DIR"

# Paso 1: Backup del esquema desde Supabase
echo ""
echo "🗄️ Paso 1: Respaldando esquema desde Supabase..."
echo "================================================"

pg_dump "$SUPABASE_URL" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --exclude-schema=auth \
    --exclude-schema=storage \
    --exclude-schema=realtime \
    --exclude-schema=extensions \
    --exclude-schema=graphql \
    --exclude-schema=graphql_public \
    --exclude-schema=supabase_functions \
    --exclude-schema=pgsodium \
    --exclude-schema=vault \
    > "$BACKUP_DIR/schema.sql"

if [ $? -eq 0 ]; then
    echo "✅ Esquema respaldado exitosamente"
else
    echo "❌ Error respaldando esquema"
    exit 1
fi

# Paso 2: Backup de datos desde Supabase
echo ""
echo "📊 Paso 2: Respaldando datos desde Supabase..."
echo "==============================================="

pg_dump "$SUPABASE_URL" \
    --data-only \
    --no-owner \
    --no-privileges \
    --exclude-schema=auth \
    --exclude-schema=storage \
    --exclude-schema=realtime \
    --exclude-schema=extensions \
    --exclude-schema=graphql \
    --exclude-schema=graphql_public \
    --exclude-schema=supabase_functions \
    --exclude-schema=pgsodium \
    --exclude-schema=vault \
    > "$BACKUP_DIR/data.sql"

if [ $? -eq 0 ]; then
    echo "✅ Datos respaldados exitosamente"
else
    echo "❌ Error respaldando datos"
    exit 1
fi

# Paso 3: Probar conexión a AWS RDS
echo ""
echo "🔌 Paso 3: Probando conexión a AWS RDS..."
echo "========================================="

psql "$RDS_URL" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Conexión a AWS RDS exitosa"
else
    echo "❌ Error conectando a AWS RDS"
    echo "💡 Verifica:"
    echo "   - El endpoint esté correcto"
    echo "   - La instancia esté en estado 'Available'"
    echo "   - El Security Group permita conexiones desde tu IP"
    exit 1
fi

# Paso 4: Restaurar esquema en AWS RDS
echo ""
echo "🏗️ Paso 4: Restaurando esquema en AWS RDS..."
echo "============================================="

psql "$RDS_URL" -f "$BACKUP_DIR/schema.sql" > "$BACKUP_DIR/schema_restore.log" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Esquema restaurado exitosamente"
else
    echo "⚠️ Esquema restaurado con warnings (normal)"
    echo "📋 Revisa el log: $BACKUP_DIR/schema_restore.log"
fi

# Paso 5: Restaurar datos en AWS RDS
echo ""
echo "📦 Paso 5: Restaurando datos en AWS RDS..."
echo "=========================================="

psql "$RDS_URL" -f "$BACKUP_DIR/data.sql" > "$BACKUP_DIR/data_restore.log" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Datos restaurados exitosamente"
else
    echo "⚠️ Datos restaurados con warnings (revisar log)"
    echo "📋 Revisa el log: $BACKUP_DIR/data_restore.log"
fi

# Paso 6: Verificar migración
echo ""
echo "🔍 Paso 6: Verificando migración..."
echo "==================================="

echo "📊 Contando registros en las tablas principales:"

for table in user_profiles categories products product_variants orders order_items; do
    count=$(psql "$RDS_URL" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ')
    if [[ "$count" =~ ^[0-9]+$ ]]; then
        echo "   $table: $count registros"
    else
        echo "   $table: Error o tabla no existe"
    fi
done

# Paso 7: Generar nuevo connection string
echo ""
echo "🔗 Paso 7: Configuración para tu aplicación"
echo "==========================================="

echo ""
echo "✅ ¡Migración completada!"
echo ""
echo "📝 Nueva configuración para tu aplicación:"
echo "DATABASE_URL=$RDS_URL"
echo ""
echo "📁 Archivos de backup guardados en: $BACKUP_DIR"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Actualiza tu archivo .env con la nueva DATABASE_URL"
echo "   2. Actualiza tu backend/src/infrastructure/config/postgres.ts"
echo "   3. Reinicia tu aplicación"
echo "   4. Verifica que todo funcione correctamente"
echo ""
echo "💡 Recuerda: Los archivos de Supabase (auth, storage) no se migraron"
echo "   Solo se migró la base de datos principal"