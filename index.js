import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Importar rutas
import productsRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';

// Importar middlewares
import { 
  errorHandler, 
  notFoundHandler, 
  requestLogger, 
  validateContentType, 
  securityHeaders 
} from './src/middlewares/errorMiddleware.js';

// Configurar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(securityHeaders);

// Configurar CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://tu-dominio-frontend.vercel.app',
        'https://tu-dominio-frontend.com',
        /\.vercel\.app$/,
        /\.netlify\.app$/
      ]
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para logging de requests
app.use(requestLogger);

// Middleware para parsear JSON
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para validar Content-Type
app.use(validateContentType);

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'API de Productos funcionando correctamente',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/auth',
        products: '/api/products'
      }
    },
    message: 'Servidor API activo'
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    },
    message: 'Servidor funcionando correctamente'
  });
});

// Configurar rutas
app.use('/auth', authRoutes);
app.use('/api/products', productsRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware global de manejo de errores
app.use(errorHandler);

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  console.error('En la promesa:', promise);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Iniciar servidor (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor iniciado exitosamente`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));
    console.log('📋 Endpoints disponibles:');
    console.log(`   • GET    / - Información del API`);
    console.log(`   • GET    /health - Health check`);
    console.log(`   • POST   /auth/login - Autenticación`);
    console.log(`   • GET    /api/products - Obtener productos`);
    console.log(`   • POST   /api/products/create - Crear producto`);
    console.log(`   • GET    /api/products/:id - Obtener producto por ID`);
    console.log(`   • PUT    /api/products/:id - Actualizar producto`);
    console.log(`   • DELETE /api/products/:id - Eliminar producto`);
    console.log('='.repeat(50));
  });
}

export default app;