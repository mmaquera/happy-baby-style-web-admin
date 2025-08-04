# 🚀 Guía de Scripts de Desarrollo - Gestión Automática de Puertos

## ✅ **Problema Resuelto**

Ya no necesitas matar puertos manualmente. Los nuevos scripts manejan automáticamente la limpieza de puertos antes de iniciar los servidores.

---

## 📋 **Scripts Disponibles**

### **1. 🎯 Script Principal (Recomendado)**
```bash
npm run dev
```
**¿Qué hace?**
- ✅ Limpia automáticamente los puertos 3000 y 3001
- ✅ Inicia backend (puerto 3001) y frontend (puerto 3000)
- ✅ Maneja señales de terminación (Ctrl+C)
- ✅ Cierra todos los procesos al salir

### **2. 🔧 Scripts Individuales**

#### **Backend Solo:**
```bash
npm run dev:backend
```
- Limpia puerto 3001
- Inicia solo el servidor backend

#### **Frontend Solo:**
```bash
npm run dev:frontend
```
- Limpia puerto 3000
- Inicia solo el servidor frontend

### **3. 🧹 Script de Limpieza Manual**
```bash
npm run cleanup
```
- Limpia todos los puertos del proyecto (3000, 3001)
- Útil si necesitas liberar puertos sin iniciar servidores

---

## 🎯 **Cómo Usar**

### **Opción 1: Iniciar Todo (Recomendado)**
```bash
# Desde la raíz del proyecto
npm run dev
```

**Resultado:**
```
🎯 Iniciando servidores de desarrollo con gestión automática de puertos...

🧹 Limpiando todos los puertos del proyecto...

🧹 Limpiando puerto 3001...
✅ No hay procesos usando el puerto 3001

🧹 Limpiando puerto 3000...
✅ No hay procesos usando el puerto 3000

✅ Limpieza de puertos completada

🚀 Iniciando servidor de desarrollo del backend...
🚀 Iniciando servidor de desarrollo del frontend...

✅ Servidores iniciados correctamente
🌐 Backend disponible en: http://localhost:3001
🌐 Frontend disponible en: http://localhost:3000
📝 Presiona Ctrl+C para detener todos los servidores
```

### **Opción 2: Iniciar Solo Backend**
```bash
npm run dev:backend
```

### **Opción 3: Iniciar Solo Frontend**
```bash
npm run dev:frontend
```

### **Opción 4: Limpiar Puertos Manualmente**
```bash
npm run cleanup
```

---

## 🛑 **Cómo Detener los Servidores**

### **Método 1: Ctrl+C (Recomendado)**
```bash
# Presiona Ctrl+C en la terminal donde ejecutaste npm run dev
^C
🛑 Deteniendo todos los servidores...
👋 Todos los servidores detenidos. ¡Hasta luego!
```

### **Método 2: Limpieza Manual**
```bash
# Si los servidores no se cierran correctamente
npm run cleanup
```

---

## 🔧 **Características de los Scripts**

### **✅ Gestión Automática de Puertos**
- Detecta procesos que usan los puertos 3000 y 3001
- Los termina automáticamente antes de iniciar
- Verifica que los puertos estén libres

### **✅ Manejo de Señales**
- `SIGINT` (Ctrl+C)
- `SIGTERM`
- `SIGQUIT`

### **✅ Logging Detallado**
- Muestra qué procesos se están terminando
- Indica el estado de cada puerto
- Proporciona URLs de acceso

### **✅ Manejo de Errores**
- Detecta si los puertos no se pueden liberar
- Muestra mensajes de error claros
- Termina el proceso si hay problemas críticos

---

## 📁 **Archivos de Scripts**

### **Scripts Principales:**
- `scripts/dev-full.js` - Script principal que maneja backend y frontend
- `scripts/dev-server.js` - Script solo para backend
- `scripts/dev-frontend.js` - Script solo para frontend
- `scripts/cleanup-ports.js` - Script de limpieza manual

### **Configuración:**
- `package.json` - Scripts npm actualizados
- Todos los scripts son ejecutables (`chmod +x`)

---

## 🚨 **Solución de Problemas**

### **Problema: "Puerto aún está en uso"**
```bash
# Solución 1: Usar el script de limpieza
npm run cleanup

# Solución 2: Limpieza manual
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### **Problema: "No se pudo matar proceso"**
```bash
# Verificar qué procesos están usando los puertos
lsof -i:3000
lsof -i:3001

# Matar manualmente si es necesario
kill -9 <PID>
```

### **Problema: "Error al iniciar el servidor"**
```bash
# Verificar que las dependencias estén instaladas
npm run install:all

# Verificar que los archivos de configuración existan
ls -la backend/.env
ls -la frontend/.env
```

---

## 🎉 **Ventajas de los Nuevos Scripts**

### **1. ⚡ Automatización**
- No más comandos manuales de limpieza
- Inicio automático de todos los servicios
- Cierre limpio al terminar

### **2. 🔍 Visibilidad**
- Logs detallados de lo que está pasando
- Estado de cada puerto claramente mostrado
- URLs de acceso proporcionadas

### **3. 🛡️ Robustez**
- Manejo de errores mejorado
- Verificación de puertos antes de iniciar
- Terminación limpia de procesos

### **4. 🎯 Simplicidad**
- Un solo comando para todo: `npm run dev`
- Scripts individuales para casos específicos
- Documentación clara y completa

---

## 📝 **Comandos de Referencia Rápida**

```bash
# Iniciar todo el proyecto
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Limpiar puertos
npm run cleanup

# Detener (Ctrl+C)
^C
```

**¡Ya no más problemas con puertos ocupados!** 🎯 