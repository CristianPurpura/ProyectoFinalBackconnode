import AuthService from '../services/authService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Usuario y contraseña son requeridos'
        });
      }

      const result = await this.authService.authenticateUser(username, password);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token no proporcionado'
        });
      }

      const result = this.authService.verifyToken(token);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = req.user;
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'Perfil obtenido correctamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: null,
        message: 'Logout exitoso. Elimine el token del cliente.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;