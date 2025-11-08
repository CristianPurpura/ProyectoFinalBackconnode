// Middleware global para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por errorHandler:', err);

  // Error de Firebase
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(503).json({
      success: false,
      data: null,
      message: 'Error en el servicio de base de datos. Intente nuevamente más tarde.'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token expirado'
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Error de validación: ${err.message}`
    });
  }

  // Error de sintaxis JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Formato JSON inválido en el cuerpo de la petición'
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    success: false,
    data: null,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.path}`
  });
};

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Log del body para métodos POST, PUT, PATCH (sin mostrar passwords)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const bodyForLog = { ...req.body };
    if (bodyForLog.password) {
      bodyForLog.password = '***';
    }
    console.log(`[${timestamp}] Body:`, JSON.stringify(bodyForLog, null, 2));
  }
  
  next();
};

// Middleware para validar Content-Type en requests con body
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Content-Type debe ser application/json'
      });
    }
  }
  next();
};

// Middleware para headers de seguridad básica
const securityHeaders = (req, res, next) => {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

export {
  errorHandler,
  notFoundHandler,
  requestLogger,
  validateContentType,
  securityHeaders
};