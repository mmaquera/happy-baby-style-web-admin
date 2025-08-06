#!/bin/bash

# Script para actualizar la configuración de la aplicación con AWS RDS
echo "🔧 Actualizando configuración de la aplicación"
echo "=============================================="
echo ""

# Solicitar el endpoint de RDS
echo "🔗 Ingresa el endpoint de tu instancia RDS:"
echo "💡 Lo puedes encontrar en AWS Console → RDS → Databases → happy-baby-style-db"
echo ""
read -p "📝 RDS Endpoint: " RDS_ENDPOINT

if [[ -z "$RDS_ENDPOINT" ]]; then
    echo "❌ Endpoint de RDS requerido"
    exit 1
fi

# Construir nueva DATABASE_URL
NEW_DATABASE_URL="postgresql://postgres:HappyBaby2024!@${RDS_ENDPOINT}:5432/happy_baby_style_db"

echo ""
echo "🔗 Nueva DATABASE_URL:"
echo "$NEW_DATABASE_URL"
echo ""

# Actualizar archivos de configuración
echo "📝 Actualizando archivos de configuración..."

# 1. Actualizar backend/env.template
if [ -f "backend/env.template" ]; then
    echo "   📄 Actualizando backend/env.template..."
    cp backend/env.template backend/env.template.bak
    sed -i.tmp "s|DATABASE_URL=.*|DATABASE_URL=$NEW_DATABASE_URL|g" backend/env.template
    echo "   ✅ backend/env.template actualizado"
fi

# 2. Crear/actualizar backend/.env
echo "   📄 Creando backend/.env..."
cat > backend/.env << EOF
# AWS RDS PostgreSQL Database
DATABASE_URL=$NEW_DATABASE_URL

# Supabase Auth (mantener para autenticación)
SUPABASE_URL=\${SUPABASE_URL}
SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=\${SUPABASE_SERVICE_ROLE_KEY}

# JWT
JWT_SECRET=\${JWT_SECRET}

# GraphQL
GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=true

# CORS
CORS_ORIGIN=http://localhost:5173

# Server
PORT=3001
NODE_ENV=development

# Logging
LOG_LEVEL=debug
EOF

echo "   ✅ backend/.env creado"

# 3. Actualizar archivo de configuración AWS
echo "   📄 Actualizando aws-rds-config.env..."
sed -i.tmp "s|DB_HOST=.*|DB_HOST=$RDS_ENDPOINT|g" aws-rds-config.env
sed -i.tmp "s|DATABASE_URL=.*|DATABASE_URL=$NEW_DATABASE_URL|g" aws-rds-config.env
echo "   ✅ aws-rds-config.env actualizado"

# 4. Verificar archivo de configuración de PostgreSQL
echo "   📄 Verificando backend/src/infrastructure/config/postgres.ts..."

if [ -f "backend/src/infrastructure/config/postgres.ts" ]; then
    echo "   ✅ Archivo existe - usa variables de entorno, no requiere cambios"
else
    echo "   ⚠️ Archivo no encontrado"
fi

# 5. Crear script de prueba de conexión
echo "   📄 Creando script de prueba..."
cat > scripts/test-rds-connection.sh << 'EOF'
#!/bin/bash

# Script para probar la conexión a AWS RDS
echo "🔌 Probando conexión a AWS RDS..."

# Cargar variables de entorno
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '#' | grep 'DATABASE_URL' | xargs)
fi

if [[ -z "$DATABASE_URL" ]]; then
    echo "❌ DATABASE_URL no configurada"
    exit 1
fi

echo "🔗 Conectando a: ${DATABASE_URL:0:50}..."

# Probar conexión
if psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Conexión exitosa"
    
    # Mostrar información de la base de datos
    echo ""
    echo "📊 Información de la base de datos:"
    psql "$DATABASE_URL" -c "
        SELECT 
            current_database() as database,
            current_user as user,
            version() as version;
    "
    
    echo ""
    echo "📋 Tablas disponibles:"
    psql "$DATABASE_URL" -c "
        SELECT 
            schemaname,
            tablename,
            tableowner
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
    "
    
else
    echo "❌ Error de conexión"
    echo "💡 Verifica:"
    echo "   - El endpoint esté correcto"
    echo "   - La instancia esté disponible"
    echo "   - El Security Group permita tu IP"
fi
EOF

chmod +x scripts/test-rds-connection.sh
echo "   ✅ Script de prueba creado"

# Mostrar resumen
echo ""
echo "✅ Configuración actualizada!"
echo ""
echo "📋 Archivos modificados:"
echo "   - backend/.env (creado/actualizado)"
echo "   - backend/env.template (actualizado)"
echo "   - aws-rds-config.env (actualizado)"
echo "   - scripts/test-rds-connection.sh (creado)"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Ejecutar migración: ./scripts/migrate-from-supabase.sh"
echo "   2. Probar conexión: ./scripts/test-rds-connection.sh"
echo "   3. Reiniciar aplicación backend"
echo ""
echo "💡 Nota: Las credenciales de Supabase Auth se mantienen para autenticación"