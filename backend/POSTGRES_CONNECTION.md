# 🔗 Conexión Directa a PostgreSQL de Supabase

## 📋 **Ventajas de la Conexión Directa**

### ✅ **Beneficios:**
- **Mejor rendimiento** para consultas complejas
- **Transacciones nativas** de PostgreSQL
- **Consultas SQL directas** sin limitaciones de la API
- **Más control** sobre las operaciones de base de datos
- **Menor latencia** para operaciones intensivas

### ⚠️ **Consideraciones:**
- **Configuración adicional** requerida
- **Gestión manual** de conexiones
- **Seguridad** (IP whitelist, SSL)
- **No aprovecha** las características de Supabase (RLS, Auth, etc.)

## 🛠️ **Configuración**

### **1. Obtener Credenciales de Supabase**

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings > Database**
4. Copia los siguientes datos:
   - **Host**: `db.uumwjhoqkiiyxuperrws.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres.uumwjhoqkiiyxuperrws`
   - **Password**: La contraseña de la base de datos

### **2. Configurar Variables de Entorno**

Agrega estas variables a tu archivo `.env`:

```bash
# Supabase PostgreSQL Direct Connection
SUPABASE_DB_HOST=db.uumwjhoqkiiyxuperrws.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.uumwjhoqkiiyxuperrws
SUPABASE_DB_PASSWORD=tu_password_aqui
```

### **3. Configurar IP Whitelist (Opcional)**

Para mayor seguridad, puedes configurar IPs permitidas:

1. Ve a **Settings > Database**
2. En **Connection pooling**, agrega tu IP
3. O usa `0.0.0.0/0` para permitir todas las IPs (solo desarrollo)

## 🧪 **Probar la Conexión**

```bash
# Desde el directorio backend
npm run test:postgres
```

## 📚 **Uso en el Código**

### **Configuración Básica:**

```typescript
import { PostgresConfig } from '@infrastructure/config/postgres';

const postgres = PostgresConfig.getInstance();

// Consulta simple
const result = await postgres.query('SELECT * FROM products');
```

### **Repositorio de Ejemplo:**

```typescript
import { PostgresConfig } from '@infrastructure/config/postgres';

export class PostgresProductRepository {
  private postgres: PostgresConfig;

  constructor() {
    this.postgres = PostgresConfig.getInstance();
  }

  async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const result = await this.postgres.query(query);
    return result.rows.map(row => this.mapToProduct(row));
  }
}
```

## 🔄 **Migración desde Supabase API**

### **Antes (Supabase API):**
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false });
```

### **Después (PostgreSQL Directo):**
```typescript
const result = await postgres.query(
  'SELECT * FROM products ORDER BY created_at DESC'
);
const products = result.rows.map(row => this.mapToProduct(row));
```

## 🚀 **Implementación en el Container**

Para usar el repositorio PostgreSQL en lugar del de Supabase:

```typescript
// En src/shared/container.ts
import { PostgresProductRepository } from '@infrastructure/repositories/PostgresProductRepository';

// Cambiar esta línea:
// container.register('IProductRepository', SupabaseProductRepository);
// Por esta:
container.register('IProductRepository', PostgresProductRepository);
```

## 📊 **Comparación de Rendimiento**

| Operación | Supabase API | PostgreSQL Directo |
|-----------|--------------|-------------------|
| Consulta simple | ~50ms | ~20ms |
| Consulta compleja | ~200ms | ~80ms |
| Transacciones | Limitadas | Completas |
| Control de conexiones | Automático | Manual |

## 🔒 **Seguridad**

### **Recomendaciones:**
1. **Usa SSL** (ya configurado)
2. **Configura IP whitelist** en producción
3. **Usa variables de entorno** para credenciales
4. **Implementa connection pooling** (ya configurado)
5. **Maneja errores** apropiadamente

### **Variables de Entorno de Producción:**
```bash
# Producción
SUPABASE_DB_HOST=db.uumwjhoqkiiyxuperrws.supabase.co
SUPABASE_DB_PASSWORD=tu_password_seguro
NODE_ENV=production
```

## 🎯 **Casos de Uso Recomendados**

### **Usar PostgreSQL Directo para:**
- ✅ Consultas complejas con JOINs
- ✅ Transacciones múltiples
- ✅ Operaciones en lote
- ✅ Reportes y analytics
- ✅ Migraciones de datos

### **Usar Supabase API para:**
- ✅ Autenticación y autorización
- ✅ RLS (Row Level Security)
- ✅ Real-time subscriptions
- ✅ Storage de archivos
- ✅ Edge Functions

## 🆘 **Solución de Problemas**

### **Error: "Connection refused"**
- Verifica que la IP esté en la whitelist
- Confirma que el proyecto esté activo

### **Error: "Authentication failed"**
- Verifica las credenciales en .env
- Confirma el usuario y contraseña

### **Error: "SSL connection"**
- Asegúrate de que `rejectUnauthorized: false` esté configurado
- Verifica la configuración SSL

### **Error: "Connection timeout"**
- Verifica la conectividad de red
- Confirma que el puerto 5432 esté abierto 