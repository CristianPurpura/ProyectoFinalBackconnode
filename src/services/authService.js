import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    // En una aplicación real, esto estaría en una base de datos
    this.users = [
      {
        id: 1,
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      }
    ];
  }

  // Autenticar usuario
  async authenticateUser(username, password) {
    try {
      if (!username || !password) {
        return {
          success: false,
          data: null,
          message: 'Usuario y contraseña son requeridos'
        };
      }

      // Buscar usuario
      const user = this.users.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return {
          success: false,
          data: null,
          message: 'Credenciales inválidas'
        };
      }

      // Generar token JWT
      const token = this.generateToken(user);
      
      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          },
          token: token
        },
        message: 'Autenticación exitosa'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Error en la autenticación: ${error.message}`
      };
    }
  }

  // Generar token JWT
  generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h',
      issuer: 'producto-api'
    });
  }

  // Verificar token JWT
  verifyToken(token) {
    try {
      if (!token) {
        return {
          success: false,
          data: null,
          message: 'Token no proporcionado'
        };
      }

      // Remover "Bearer " si está presente
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

      const decoded = jwt.verify(cleanToken, this.jwtSecret);
      
      return {
        success: true,
        data: decoded,
        message: 'Token válido'
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          success: false,
          data: null,
          message: 'Token expirado'
        };
      } else if (error.name === 'JsonWebTokenError') {
        return {
          success: false,
          data: null,
          message: 'Token inválido'
        };
      }
      
      return {
        success: false,
        data: null,
        message: `Error al verificar token: ${error.message}`
      };
    }
  }

  // Obtener usuario por ID (para el middleware)
  async getUserById(id) {
    try {
      const user = this.users.find(u => u.id === id);
      
      if (!user) {
        return {
          success: false,
          data: null,
          message: 'Usuario no encontrado'
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        message: 'Usuario obtenido correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Error al obtener usuario: ${error.message}`
      };
    }
  }
}

export default AuthService;