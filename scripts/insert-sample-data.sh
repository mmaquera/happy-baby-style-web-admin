#!/bin/bash

# Script para insertar datos de ejemplo en AWS RDS
echo "📦 Insertando datos de ejemplo en AWS RDS"
echo "========================================"

# Cargar DATABASE_URL
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '#' | grep 'DATABASE_URL' | xargs)
fi

if [[ -z "$DATABASE_URL" ]]; then
    echo "❌ DATABASE_URL no configurada"
    exit 1
fi

echo "🔗 Conectando a AWS RDS..."

# Insertar datos de ejemplo
psql "$DATABASE_URL" << 'EOF'
-- Insertar categorías
INSERT INTO categories (name, description, slug, is_active, sort_order) VALUES 
('Bodies', 'Bodies cómodos para bebés', 'bodies', true, 1),
('Conjuntos', 'Conjuntos completos para bebés', 'conjuntos', true, 2),
('Pijamas', 'Pijamas suaves para dormir', 'pijamas', true, 3),
('Accesorios', 'Accesorios para bebés', 'accesorios', true, 4),
('Vestidos', 'Vestidos elegantes para bebés', 'vestidos', true, 5),
('Pantalones', 'Pantalones cómodos', 'pantalones', true, 6);

-- Insertar productos
INSERT INTO products (category_id, name, description, price, sku, is_active, stock_quantity, tags, rating, review_count) 
SELECT 
    c.id,
    'Body Algodón Orgánico',
    'Body suave de algodón orgánico 100%, perfecto para la piel delicada del bebé.',
    29.99,
    'BO-001',
    true,
    45,
    ARRAY['algodón', 'orgánico', 'suave'],
    4.5,
    23
FROM categories c WHERE c.slug = 'bodies'
UNION ALL
SELECT 
    c.id,
    'Pijama Dreams',
    'Pijama de dos piezas en algodón suave para noches tranquilas.',
    45.99,
    'PD-002',
    true,
    23,
    ARRAY['pijama', 'algodón', 'cómodo'],
    4.8,
    15
FROM categories c WHERE c.slug = 'pijamas'
UNION ALL
SELECT 
    c.id,
    'Conjunto Elegante',
    'Conjunto de tres piezas: body, pantalón y chaqueta ligera.',
    67.99,
    'CS-003',
    true,
    34,
    ARRAY['conjunto', 'elegante', 'especial'],
    4.2,
    8
FROM categories c WHERE c.slug = 'conjuntos';

-- Insertar variantes de productos
INSERT INTO product_variants (product_id, size, color, sku, price, stock_quantity, is_active)
SELECT 
    p.id,
    size_option,
    color_option,
    p.sku || '-' || size_option || '-' || color_option,
    p.price + (CASE WHEN size_option IN ('12M', '18M', '24M') THEN 5.00 ELSE 0.00 END),
    10,
    true
FROM products p
CROSS JOIN (VALUES ('3M'), ('6M'), ('9M'), ('12M'), ('18M'), ('24M')) AS sizes(size_option)
CROSS JOIN (VALUES ('blanco'), ('rosa'), ('azul'), ('amarillo'), ('verde')) AS colors(color_option)
WHERE p.sku IN ('BO-001', 'PD-002', 'CS-003');

-- Insertar perfiles de usuario de ejemplo
INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES 
(gen_random_uuid(), 'María', 'García', '+51 987 654 321'),
(gen_random_uuid(), 'Ana', 'López', '+51 987 654 322'),
(gen_random_uuid(), 'Carmen', 'Silva', '+51 987 654 323'),
(gen_random_uuid(), 'Rosa', 'Mendoza', '+51 987 654 324'),
(gen_random_uuid(), 'Elena', 'Torres', '+51 987 654 325');

-- Mostrar resumen
SELECT 'Categorías' as tabla, count(*) as registros FROM categories
UNION ALL
SELECT 'Productos', count(*) FROM products  
UNION ALL
SELECT 'Variantes', count(*) FROM product_variants
UNION ALL
SELECT 'Perfiles', count(*) FROM user_profiles;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Datos de ejemplo insertados exitosamente!"
    echo ""
    echo "📊 Resumen de datos:"
    echo "   - 6 categorías de productos"
    echo "   - 3 productos principales"  
    echo "   - 90 variantes de productos"
    echo "   - 5 perfiles de usuario"
    echo ""
    echo "🚀 ¡Tu base de datos está lista para usar!"
else
    echo ""
    echo "❌ Error insertando datos de ejemplo"
    exit 1
fi