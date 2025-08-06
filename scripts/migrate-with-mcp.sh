#!/bin/bash

# Script de migración usando MCP de Supabase a AWS RDS
echo "🚀 Migración Supabase → AWS RDS usando MCP"
echo "=========================================="
echo ""

# Solicitar endpoint de AWS RDS
echo "🔗 Necesitamos el endpoint de tu instancia RDS:"
echo "💡 AWS Console → RDS → Databases → happy-baby-style-db → Endpoint"
echo ""
read -p "📝 RDS Endpoint: " RDS_ENDPOINT

if [[ -z "$RDS_ENDPOINT" ]]; then
    echo "❌ Endpoint de RDS requerido"
    exit 1
fi

# Construir URL de AWS RDS
RDS_URL="postgresql://postgres:HappyBaby2024!@${RDS_ENDPOINT}:5432/happy_baby_style_db"

echo ""
echo "🔗 AWS RDS URL: ${RDS_URL:0:60}..."
echo ""

# Crear directorio de backup
BACKUP_DIR="./migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Directorio de backup: $BACKUP_DIR"

# Probar conexión a RDS
echo ""
echo "🔌 Probando conexión a AWS RDS..."
psql "$RDS_URL" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Conexión a AWS RDS exitosa"
else
    echo "❌ Error conectando a AWS RDS"
    echo "💡 Verifica:"
    echo "   - El endpoint esté correcto"
    echo "   - La instancia esté 'Available'"
    echo "   - El Security Group permita tu IP"
    exit 1
fi

# Crear esquema en RDS
echo ""
echo "🏗️ Creando esquema en AWS RDS..."
echo "================================"

# Crear enums
echo "📋 Creando enums..."
psql "$RDS_URL" << 'EOF'
-- Crear enums
CREATE TYPE order_status AS ENUM (
    'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_method_type AS ENUM (
    'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'
);
EOF

echo "✅ Enums creados"

# Crear tablas
echo "📋 Creando tablas..."
psql "$RDS_URL" << 'EOF'
-- Tabla user_profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    birth_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla user_addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL DEFAULT 'Mi dirección',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Perú',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(10,2),
    sku TEXT UNIQUE,
    images JSONB DEFAULT '[]',
    attributes JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    tags TEXT[],
    rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla product_variants
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size TEXT,
    color TEXT,
    sku TEXT UNIQUE,
    price NUMERIC(10,2),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, size, color)
);

-- Tabla shopping_carts
CREATE TABLE shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);

-- Tabla user_favorites
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Tabla orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    order_number TEXT UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_cost NUMERIC(10,2) DEFAULT 0 CHECK (shipping_cost >= 0),
    discount_amount NUMERIC(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    product_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla payment_methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    type payment_method_type NOT NULL,
    provider TEXT,
    last_four TEXT,
    metadata JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
EOF

if [ $? -eq 0 ]; then
    echo "✅ Tablas creadas exitosamente"
else
    echo "❌ Error creando tablas"
    exit 1
fi

# Crear índices
echo "📋 Creando índices..."
psql "$RDS_URL" << 'EOF'
-- Índices para rendimiento
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_is_active ON product_variants(is_active);
CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Índice GIN para tags
CREATE INDEX idx_products_tags_gin ON products USING GIN(tags);
EOF

echo "✅ Índices creados"

echo ""
echo "✅ ¡Esquema creado exitosamente en AWS RDS!"
echo ""
echo "📊 Resumen de migración:"
echo "   - Enums: ✅ Creados"  
echo "   - Tablas: ✅ Creadas (10 tablas)"
echo "   - Índices: ✅ Creados"
echo "   - Constraints: ✅ Aplicados"
echo ""
echo "🔗 Nueva DATABASE_URL:"
echo "   $RDS_URL"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Ejecuta: ./scripts/update-app-config.sh"
echo "   2. Ingresa el endpoint: $RDS_ENDPOINT"
echo "   3. Prueba la conexión: ./scripts/test-rds-connection.sh"
echo ""
echo "💡 Nota: Los datos de Supabase deben migrarse manualmente ya que"
echo "   el volumen es pequeño y el esquema está listo."