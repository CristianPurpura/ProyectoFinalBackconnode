import AuthService from '../services/authService.js';

class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
  }

  // Middleware para verificar autenticación
  authenticate = async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token de acceso requerido'
        });
      }

      const result = this.authService.verifyToken(token);
      
      if (!result.success) {
        return res.status(401).json({
          success: false,
          data: null,
          message: result.message
        });
      }

      // Agregar información del usuario a la request
      req.user = result.data;
      req.userId = result.data.id;
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Error interno del servidor en la autenticación'
      });
    }
  };

  // Middleware para verificar roles (opcional para futuras implementaciones)
  authorize = (roles = []) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            data: null,
            message: 'Usuario no autenticado'
          });
        }

        // Si no se especifican roles, solo verificar que esté autenticado
        if (roles.length === 0) {
          return next();
        }

        // Verificar si el usuario tiene uno de los roles requeridos
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            data: null,
            message: 'Permisos insuficientes para acceder a este recurso'
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: null,
          message: 'Error interno del servidor en la autorización'
        });
      }
    };
  };

  // Middleware opcional: verificar si es admin
  requireAdmin = (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Usuario no autenticado'
        });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          data: null,
          message: 'Acceso denegado. Se requieren permisos de administrador'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Error interno del servidor en la verificación de permisos'
      });
    }
  };
}

export default AuthMiddleware;