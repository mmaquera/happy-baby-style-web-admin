#!/usr/bin/env node

const { exec } = require('child_process');

class PortCleanup {
  constructor() {
    this.ports = [3000, 3001]; // Puertos del proyecto
  }

  // Función para limpiar un puerto específico
  async cleanupPort(port) {
    return new Promise((resolve) => {
      console.log(`🧹 Limpiando puerto ${port}...`);
      
      exec(`lsof -ti:${port}`, (error, stdout) => {
        if (stdout.trim()) {
          const pids = stdout.trim().split('\n');
          console.log(`📋 Procesos encontrados en puerto ${port}: ${pids.join(', ')}`);
          
          let killedCount = 0;
          pids.forEach(pid => {
            exec(`kill -9 ${pid}`, (killError) => {
              if (killError) {
                console.log(`⚠️  No se pudo matar proceso ${pid}: ${killError.message}`);
              } else {
                console.log(`✅ Proceso ${pid} terminado`);
                killedCount++;
              }
            });
          });
          
          console.log(`✅ ${killedCount} procesos terminados en puerto ${port}`);
        } else {
          console.log(`✅ No hay procesos usando el puerto ${port}`);
        }
        
        resolve();
      });
    });
  }

  // Función para verificar si un puerto está libre
  async checkPort(port) {
    return new Promise((resolve) => {
      exec(`lsof -i:${port}`, (error) => {
        resolve(!error); // Si hay error, el puerto está libre
      });
    });
  }

  // Función principal
  async run() {
    try {
      console.log('🎯 Limpiando todos los puertos del proyecto...\n');
      
      // Limpiar cada puerto
      for (const port of this.ports) {
        await this.cleanupPort(port);
        console.log(''); // Línea en blanco para separar
      }
      
      // Verificar que los puertos estén libres
      console.log('🔍 Verificando que los puertos estén libres...');
      for (const port of this.ports) {
        const portInUse = await this.checkPort(port);
        if (portInUse) {
          console.log(`⚠️  El puerto ${port} aún está en uso`);
        } else {
          console.log(`✅ El puerto ${port} está libre`);
        }
      }
      
      console.log('\n🎉 ¡Limpieza de puertos completada!');
      console.log('💡 Ahora puedes ejecutar: npm run dev');
      
    } catch (error) {
      console.error('❌ Error durante la limpieza de puertos:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar la limpieza
const cleanup = new PortCleanup();
cleanup.run(); 