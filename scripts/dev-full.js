#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');

class DevFull {
  constructor() {
    this.backendProcess = null;
    this.frontendProcess = null;
    this.backendPort = 3001;
    this.frontendPort = 3000;
    this.isRunning = false;
  }

  // Función para limpiar todos los puertos
  async cleanupAllPorts() {
    console.log('🧹 Limpiando todos los puertos del proyecto...\n');
    
    const ports = [this.backendPort, this.frontendPort];
    
    for (const port of ports) {
      await this.cleanupPort(port);
    }
    
    console.log('✅ Limpieza de puertos completada\n');
  }

  // Función para limpiar un puerto específico
  async cleanupPort(port) {
    return new Promise((resolve) => {
      console.log(`🧹 Limpiando puerto ${port}...`);
      
      exec(`lsof -ti:${port}`, (error, stdout) => {
        if (stdout.trim()) {
          const pids = stdout.trim().split('\n');
          console.log(`📋 Procesos encontrados en puerto ${port}: ${pids.join(', ')}`);
          
          pids.forEach(pid => {
            exec(`kill -9 ${pid}`, (killError) => {
              if (killError) {
                console.log(`⚠️  No se pudo matar proceso ${pid}: ${killError.message}`);
              } else {
                console.log(`✅ Proceso ${pid} terminado`);
              }
            });
          });
        } else {
          console.log(`✅ No hay procesos usando el puerto ${port}`);
        }
        
        setTimeout(resolve, 1000);
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

  // Función para iniciar el backend
  startBackend() {
    console.log('🚀 Iniciando servidor de desarrollo del backend...');
    
    this.backendProcess = spawn('npx', [
      'ts-node-dev',
      '-r', 'tsconfig-paths/register',
      '--respawn',
      '--transpile-only',
      'src/index.ts'
    ], {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname, '../backend')
    });

    this.backendProcess.on('error', (error) => {
      console.error('❌ Error al iniciar el backend:', error.message);
    });

    this.backendProcess.on('exit', (code) => {
      console.log(`📤 Backend terminado con código: ${code}`);
    });
  }

  // Función para iniciar el frontend
  startFrontend() {
    console.log('🚀 Iniciando servidor de desarrollo del frontend...');
    
    this.frontendProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname, '../frontend')
    });

    this.frontendProcess.on('error', (error) => {
      console.error('❌ Error al iniciar el frontend:', error.message);
    });

    this.frontendProcess.on('exit', (code) => {
      console.log(`📤 Frontend terminado con código: ${code}`);
    });
  }

  // Función para detener todos los servidores
  async stopAll() {
    console.log('\n🛑 Deteniendo todos los servidores...');
    
    if (this.backendProcess) {
      this.backendProcess.kill('SIGTERM');
    }
    
    if (this.frontendProcess) {
      this.frontendProcess.kill('SIGTERM');
    }
    
    // Esperar a que los procesos terminen
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('👋 Todos los servidores detenidos. ¡Hasta luego!');
    process.exit(0);
  }

  // Función principal
  async run() {
    try {
      console.log('🎯 Iniciando servidores de desarrollo con gestión automática de puertos...\n');
      
      // Limpiar puertos existentes
      await this.cleanupAllPorts();
      
      // Verificar que los puertos estén libres
      const backendPortInUse = await this.checkPort(this.backendPort);
      const frontendPortInUse = await this.checkPort(this.frontendPort);
      
      if (backendPortInUse || frontendPortInUse) {
        console.log('⚠️  Algunos puertos aún están en uso. Intentando limpiar nuevamente...');
        await this.cleanupAllPorts();
        
        const backendStillInUse = await this.checkPort(this.backendPort);
        const frontendStillInUse = await this.checkPort(this.frontendPort);
        
        if (backendStillInUse || frontendStillInUse) {
          console.error('❌ No se pudieron liberar todos los puertos. Por favor, verifica manualmente.');
          process.exit(1);
        }
      }
      
      // Iniciar servidores
      this.startBackend();
      
      // Esperar un poco antes de iniciar el frontend
      setTimeout(() => {
        this.startFrontend();
      }, 2000);
      
      this.isRunning = true;
      
      // Manejar señales de terminación
      process.on('SIGINT', () => this.stopAll());
      process.on('SIGTERM', () => this.stopAll());
      process.on('SIGQUIT', () => this.stopAll());
      
      console.log('\n✅ Servidores iniciados correctamente');
      console.log(`🌐 Backend disponible en: http://localhost:${this.backendPort}`);
      console.log(`🌐 Frontend disponible en: http://localhost:${this.frontendPort}`);
      console.log('📝 Presiona Ctrl+C para detener todos los servidores');
      
    } catch (error) {
      console.error('❌ Error al iniciar los servidores:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar el servidor completo
const devFull = new DevFull();
devFull.run(); 