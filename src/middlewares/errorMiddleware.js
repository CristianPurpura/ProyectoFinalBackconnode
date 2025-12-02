const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por errorHandler:', err);

  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(503).json({
      success: false,
      data: null,
      message: 'Error en el servicio de base de datos. Intente nuevamente más tarde.'
    });
  }

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

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Error de validación: ${err.message}`
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Formato JSON inválido en el cuerpo de la petición'
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.path}`
  });
};

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const bodyForLog = { ...req.body };
    if (bodyForLog.password) {
      bodyForLog.password = '***';
    }
    console.log(`[${timestamp}] Body:`, JSON.stringify(bodyForLog, null, 2));
  }
  
  next();
};

const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
    const contentType = req.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Content-Type debe ser application/json'
      });
    }
  }
  next();
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
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