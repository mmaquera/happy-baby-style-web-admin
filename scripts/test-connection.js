const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - Reemplaza con tus credenciales reales
const supabaseUrl = process.env.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'tu_anon_key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...\n');

  try {
    // 1. Probar conexión básica
    console.log('1. Probando conexión básica...');
    const { data: healthData, error: healthError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (healthError) {
      throw new Error(`Error de conexión: ${healthError.message}`);
    }
    console.log('✅ Conexión exitosa\n');

    // 2. Obtener estadísticas de la base de datos
    console.log('2. Obteniendo estadísticas de la base de datos...');
    
    // Contar productos
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Contar categorías
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    // Contar variantes de productos
    const { count: variantsCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true });
    
    // Contar pedidos
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    // Contar usuarios
    const { count: usersCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Estadísticas de la base de datos:');
    console.log(`   • Productos: ${productsCount}`);
    console.log(`   • Categorías: ${categoriesCount}`);
    console.log(`   • Variantes de productos: ${variantsCount}`);
    console.log(`   • Pedidos: ${ordersCount}`);
    console.log(`   • Usuarios: ${usersCount}\n`);

    // 3. Obtener muestra de productos
    console.log('3. Obteniendo muestra de productos...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        variants:product_variants(count)
      `)
      .limit(3);

    if (productsError) {
      throw new Error(`Error al obtener productos: ${productsError.message}`);
    }

    console.log('📦 Muestra de productos:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      SKU: ${product.sku}`);
      console.log(`      Precio: S/ ${product.price}`);
      console.log(`      Categoría: ${product.category?.name || 'Sin categoría'}`);
      console.log(`      Variantes: ${product.variants?.length || 0}`);
      console.log(`      Stock: ${product.stock_quantity}`);
      console.log(`      Estado: ${product.is_active ? 'Activo' : 'Inactivo'}\n`);
    });

    // 4. Obtener categorías
    console.log('4. Obteniendo categorías...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      throw new Error(`Error al obtener categorías: ${categoriesError.message}`);
    }

    console.log('🏷️  Categorías disponibles:');
    categories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (${category.slug})`);
      console.log(`      Descripción: ${category.description || 'Sin descripción'}`);
      console.log(`      Estado: ${category.is_active ? 'Activa' : 'Inactiva'}`);
      console.log(`      Orden: ${category.sort_order}\n`);
    });

    // 5. Verificar estructura de tablas
    console.log('5. Verificando estructura de tablas...');
    const tables = ['products', 'categories', 'product_variants', 'orders', 'order_items', 'user_profiles'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Tabla ${table}: Error - ${error.message}`);
        } else {
          console.log(`   ✅ Tabla ${table}: OK`);
        }
      } catch (err) {
        console.log(`   ❌ Tabla ${table}: Error - ${err.message}`);
      }
    }

    console.log('\n🎉 ¡Prueba de conexión completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Configura las variables de entorno en backend/.env');
    console.log('   2. Ejecuta: npm run install:all');
    console.log('   3. Ejecuta: npm run dev');
    console.log('   4. Abre http://localhost:3000 en tu navegador');

  } catch (error) {
    console.error('❌ Error durante la prueba de conexión:', error.message);
    console.log('\n🔧 Solución de problemas:');
    console.log('   1. Verifica que SUPABASE_URL y SUPABASE_ANON_KEY estén configurados');
    console.log('   2. Asegúrate de que el proyecto de Supabase esté activo');
    console.log('   3. Verifica que las tablas existan en tu base de datos');
    console.log('   4. Ejecuta el script de migración si es necesario');
  }
}

// Ejecutar la prueba
testConnection(); 