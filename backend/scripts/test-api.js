#!/usr/bin/env node

const axios = require('axios');

async function testAPI() {
  console.log('🧪 Probando API del backend...\n');

  const baseURL = 'http://localhost:3001';
  
  try {
    // 1. Probar health check
    console.log('📋 1. Probando health check...');
    const healthResponse = await axios.get(`${baseURL}/health`, { timeout: 5000 });
    console.log('✅ Health check:', healthResponse.data);
    
    // 2. Probar API de productos
    console.log('\n📋 2. Probando API de productos...');
    const productsResponse = await axios.get(`${baseURL}/api/products`, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Products API:', {
      status: productsResponse.status,
      data: productsResponse.data,
      count: productsResponse.data?.data?.length || 0
    });
    
    // 3. Probar con filtros
    console.log('\n📋 3. Probando API con filtros...');
    const filteredResponse = await axios.get(`${baseURL}/api/products`, {
      timeout: 10000,
      params: {
        isActive: true,
        limit: 5
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Products API con filtros:', {
      status: filteredResponse.status,
      count: filteredResponse.data?.data?.length || 0
    });
    
    console.log('\n🎉 ¡Todas las pruebas de API exitosas!');
    
  } catch (error) {
    console.error('❌ Error en la API:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor no está corriendo. Ejecuta: npm run dev');
    } else if (error.code === 'ECONNABORTED') {
      console.log('\n💡 Timeout en la respuesta. El servidor puede estar lento.');
    }
  }
}

testAPI(); 