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
