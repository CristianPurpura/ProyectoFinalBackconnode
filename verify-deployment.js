#!/usr/bin/env node

// Script de verificación post-despliegue
// Uso: node verify-deployment.js [URL_DE_TU_API]

import https from 'https';
import http from 'http';

const apiUrl = process.argv[2] || 'http://localhost:3000';
console.log(`🔍 Verificando API en: ${apiUrl}\n`);

// Función helper para hacer requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    }).on('error', reject);
  });
}

async function verifyAPI() {
  const tests = [
    {
      name: 'API Info',
      url: `${apiUrl}/`,
      expected: 200
    },
    {
      name: 'Health Check',
      url: `${apiUrl}/health`,
      expected: 200
    },
    {
      name: 'Products Endpoint',
      url: `${apiUrl}/api/products`,
      expected: 200
    }
  ];

  console.log('🧪 Ejecutando pruebas...\n');

  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      const result = await makeRequest(test.url);
      
      if (result.status === test.expected) {
        console.log(`✅ ${test.name}: OK (${result.status})`);
        if (result.data.message) {
          console.log(`   📝 ${result.data.message}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${result.status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Verificación completada!');
  console.log(`\n📱 Tu API está disponible en: ${apiUrl}`);
  console.log('📚 Endpoints disponibles:');
  console.log(`   • GET  ${apiUrl}/ - Información del API`);
  console.log(`   • GET  ${apiUrl}/health - Health check`);
  console.log(`   • GET  ${apiUrl}/api/products - Obtener productos`);
  console.log(`   • POST ${apiUrl}/auth/login - Autenticación`);
  console.log(`   • POST ${apiUrl}/api/products/create - Crear producto (requiere auth)`);
}

verifyAPI().catch(console.error);