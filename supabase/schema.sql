-- Happy Baby Style Database Schema
-- Este archivo contiene todas las tablas necesarias para el sistema de administración

-- Crear enums para los tipos de datos
CREATE TYPE product_category AS ENUM (
  'bodies',
  'conjuntos', 
  'pijamas',
  'accesorios'
);

CREATE TYPE product_size AS ENUM (
  'recien_nacido',
  '3_meses',
  '6_meses', 
  '9_meses',
  '12_meses',
  '18_meses',
  '24_meses'
);

CREATE TYPE product_color AS ENUM (
  'blanco',
  'rosa_suave',
  'azul_cielo',
  'amarillo_pastel',
  'verde_menta',
  'gris_perla'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'manager',
  'viewer'
);

CREATE TYPE image_entity_type AS ENUM (
  'product',
  'user',
  'category'
);

-- Tabla de usuarios (administradores)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category product_category NOT NULL,
  sizes product_size[] NOT NULL DEFAULT '{}',
  colors product_color[] NOT NULL DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de imágenes
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0),
  url TEXT NOT NULL,
  bucket VARCHAR(100) NOT NULL DEFAULT 'images',
  path TEXT NOT NULL,
  entity_type image_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de direcciones de envío
CREATE TABLE shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Colombia'
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  status order_status NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  shipping_address_id UUID REFERENCES shipping_addresses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de items de pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  size product_size NOT NULL,
  color product_color NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX idx_images_created_at ON images(created_at);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO users (email, name, role) VALUES 
('admin@happybabystyle.com', 'Administrador Principal', 'super_admin'),
('manager@happybabystyle.com', 'Gerente de Tienda', 'admin'),
('viewer@happybabystyle.com', 'Visualizador', 'viewer');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category, sizes, colors, sku, stock) VALUES 
(
  'Body Algodón Orgánico Blanco',
  'Body suave de algodón orgánico 100%, perfecto para la piel delicada del bebé. Sin costuras molestas y con broches de presión en la entrepierna para facilitar el cambio.',
  29.99,
  'bodies',
  ARRAY['recien_nacido', '3_meses', '6_meses']::product_size[],
  ARRAY['blanco', 'rosa_suave']::product_color[],
  'BO-001',
  45
),
(
  'Pijama Dreams Rosa Suave',
  'Pijama de dos piezas en algodón suave para noches tranquilas. Incluye camiseta de manga larga y pantalón con cintura elástica.',
  45.99,
  'pijamas',
  ARRAY['6_meses', '9_meses', '12_meses']::product_size[],
  ARRAY['rosa_suave', 'azul_cielo']::product_color[],
  'PD-002',
  23
),
(
  'Conjunto Suave Azul Cielo',
  'Conjunto de tres piezas: body, pantalón y chaqueta ligera. Ideal para ocasiones especiales manteniendo la comodidad del bebé.',
  67.99,
  'conjuntos',
  ARRAY['3_meses', '6_meses', '9_meses', '12_meses']::product_size[],
  ARRAY['azul_cielo', 'verde_menta']::product_color[],
  'CS-003',
  34
),
(
  'Gorro Suave Amarillo Pastel',
  'Gorro de algodón orgánico con diseño minimalista. Protege la cabecita del bebé manteniendo el estilo Happy Baby.',
  15.99,
  'accesorios',
  ARRAY['recien_nacido', '3_meses', '6_meses']::product_size[],
  ARRAY['amarillo_pastel', 'gris_perla']::product_color[],
  'AC-004',
  67
);

-- Insertar direcciones de ejemplo
INSERT INTO shipping_addresses (street, city, state, zip_code, country) VALUES 
('Calle 123 #45-67', 'Bogotá', 'Cundinamarca', '110111', 'Colombia'),
('Carrera 78 #12-34', 'Medellín', 'Antioquia', '050001', 'Colombia'),
('Avenida 56 #89-01', 'Cali', 'Valle del Cauca', '760001', 'Colombia');

-- Insertar pedidos de ejemplo
INSERT INTO orders (customer_email, customer_name, customer_phone, status, total, shipping_address_id) VALUES 
('maria.garcia@email.com', 'María García', '+57 300 123 4567', 'pending', 89.99, (SELECT id FROM shipping_addresses LIMIT 1)),
('ana.lopez@email.com', 'Ana López', '+57 310 987 6543', 'processing', 124.50, (SELECT id FROM shipping_addresses OFFSET 1 LIMIT 1)),
('carmen.silva@email.com', 'Carmen Silva', '+57 320 456 7890', 'shipped', 67.20, (SELECT id FROM shipping_addresses OFFSET 2 LIMIT 1));

-- Insertar items de pedido de ejemplo
INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES 
(
  (SELECT id FROM orders WHERE customer_email = 'maria.garcia@email.com'),
  (SELECT id FROM products WHERE sku = 'BO-001'),
  2,
  29.99,
  '3_meses',
  'blanco'
),
(
  (SELECT id FROM orders WHERE customer_email = 'maria.garcia@email.com'),
  (SELECT id FROM products WHERE sku = 'PD-002'),
  1,
  45.99,
  '6_meses',
  'rosa_suave'
);

-- Configurar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (se pueden ajustar según necesidades de seguridad)
-- Por ahora, permitir todo para facilitar el desarrollo
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON images FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON shipping_addresses FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL TO authenticated USING (true);

-- Vista para estadísticas del dashboard
CREATE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
  (SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'confirmed', 'processing', 'shipped')) as active_orders,
  (SELECT COUNT(DISTINCT customer_email) FROM orders) as total_customers,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at >= date_trunc('month', CURRENT_DATE)) as monthly_revenue,
  (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE) as todays_orders;

-- Comentarios para documentación
COMMENT ON TABLE products IS 'Tabla principal de productos del catálogo Happy Baby Style';
COMMENT ON TABLE orders IS 'Tabla de pedidos de clientes';
COMMENT ON TABLE order_items IS 'Items individuales de cada pedido';
COMMENT ON TABLE users IS 'Usuarios administradores del sistema';
COMMENT ON TABLE images IS 'Imágenes asociadas a productos y otras entidades';
COMMENT ON TABLE shipping_addresses IS 'Direcciones de envío de los pedidos';

COMMENT ON COLUMN products.sku IS 'Código único de producto (Stock Keeping Unit)';
COMMENT ON COLUMN products.sizes IS 'Array de tallas disponibles para el producto';
COMMENT ON COLUMN products.colors IS 'Array de colores disponibles para el producto';
COMMENT ON COLUMN products.image_urls IS 'URLs de las imágenes del producto';
COMMENT ON COLUMN orders.total IS 'Total del pedido en pesos colombianos';
COMMENT ON COLUMN images.entity_type IS 'Tipo de entidad a la que pertenece la imagen (product, user, category)';
COMMENT ON COLUMN images.entity_id IS 'ID de la entidad a la que pertenece la imagen';