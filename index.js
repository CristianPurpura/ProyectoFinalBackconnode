import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import { 
  errorHandler, 
  notFoundHandler, 
  requestLogger, 
  validateContentType, 
  securityHeaders 
} from './src/middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(securityHeaders);

const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(requestLogger);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(validateContentType);
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

app.use('/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
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