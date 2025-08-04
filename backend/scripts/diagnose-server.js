#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 Diagnóstico del servidor backend...\n');

// Función para probar la conexión PostgreSQL
async function testPostgresConnection() {
  console.log('📋 1. Probando conexión PostgreSQL...');
  
  return new Promise((resolve) => {
    const testProcess = spawn('node', ['scripts/test-postgres-connection.js'], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Conexión PostgreSQL: OK');
        console.log(output);
      } else {
        console.log('❌ Conexión PostgreSQL: ERROR');
        console.log(errorOutput);
      }
      resolve();
    });
  });
}

// Función para verificar TypeScript
async function checkTypeScript() {
  console.log('\n📋 2. Verificando TypeScript...');
  
  return new Promise((resolve) => {
    const checkProcess = spawn('npm', ['run', 'type-check'], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    checkProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    checkProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    checkProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript: OK');
      } else {
        console.log('❌ TypeScript: ERROR');
        console.log(errorOutput);
      }
      resolve();
    });
  });
}

// Función para verificar dependencias
async function checkDependencies() {
  console.log('\n📋 3. Verificando dependencias...');
  
  const requiredFiles = [
    'package.json',
    'src/index.ts',
    'src/shared/container.ts',
    '.env'
  ];

  for (const file of requiredFiles) {
    const fs = require('fs');
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Existe`);
    } else {
      console.log(`❌ ${file}: No existe`);
    }
  }
}

// Función para intentar iniciar el servidor
async function testServerStart() {
  console.log('\n📋 4. Intentando iniciar el servidor...');
  
  return new Promise((resolve) => {
    const serverProcess = spawn('npx', [
      'ts-node-dev',
      '-r', 'tsconfig-paths/register',
      '--transpile-only',
      'src/index.ts'
    ], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('📤 Output:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('❌ Error:', data.toString());
    });

    // Dar tiempo para que el servidor inicie
    setTimeout(() => {
      serverProcess.kill('SIGTERM');
      
      if (output.includes('Server running on port')) {
        console.log('✅ Servidor: Se inició correctamente');
      } else {
        console.log('❌ Servidor: Error al iniciar');
        console.log('Error completo:', errorOutput);
      }
      
      resolve();
    }, 10000); // 10 segundos
  });
}

// Función principal
async function diagnose() {
  try {
    await checkDependencies();
    await testPostgresConnection();
    await checkTypeScript();
    await testServerStart();
    
    console.log('\n🎯 Diagnóstico completado');
    console.log('\n💡 Si hay errores, verifica:');
    console.log('   1. Variables de entorno en .env');
    console.log('   2. Conexión a PostgreSQL');
    console.log('   3. Dependencias instaladas (npm install)');
    console.log('   4. Permisos de archivos');
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
  }
}

diagnose(); 