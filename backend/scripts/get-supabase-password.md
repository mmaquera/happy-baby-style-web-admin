# 🔑 Obtener Contraseña de Supabase Database

## 📋 **Pasos para Obtener la Contraseña:**

### **1. Acceder al Dashboard de Supabase**
1. Ve a: https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **uumwjhoqkiiyxuperrws**

### **2. Ir a Configuración de Base de Datos**
1. En el menú lateral, haz clic en **"Settings"**
2. Selecciona **"Database"**
3. Busca la sección **"Connection info"**

### **3. Copiar la Contraseña**
1. Busca el campo **"Database Password"**
2. Haz clic en el botón **"Copy"** o **"Reveal"**
3. Copia la contraseña completa

### **4. Configurar en el Proyecto**
1. Ve al archivo `.env` en el directorio `backend/`
2. Agrega esta línea:
   ```bash
   SUPABASE_DB_PASSWORD=tu_contraseña_aqui
   ```

### **5. Probar la Conexión**
```bash
cd backend
npm run test:postgres
```

## 🔒 **Información de Conexión:**

- **Host**: `db.uumwjhoqkiiyxuperrws.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres.uumwjhoqkiiyxuperrws`
- **Password**: [Obtener del dashboard]

## ⚠️ **Notas Importantes:**

- La contraseña es sensible, no la compartas
- Mantén el archivo `.env` en `.gitignore`
- En producción, usa variables de entorno seguras
- La conexión usa SSL por defecto

## 🆘 **Si No Puedes Acceder:**

1. Verifica que tengas permisos de administrador en el proyecto
2. Contacta al propietario del proyecto Supabase
3. Revisa que el proyecto esté activo y no suspendido 