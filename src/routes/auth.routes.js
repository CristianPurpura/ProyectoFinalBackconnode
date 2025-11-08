import express from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Ruta de login (pública)
router.post('/login', authController.login.bind(authController));

// Ruta para verificar token (pública, pero requiere token en headers)
router.post('/verify', authController.verifyToken.bind(authController));

// Ruta para obtener perfil (protegida)
router.get('/profile', 
  authMiddleware.authenticate,
  authController.getProfile.bind(authController)
);

// Ruta de logout (protegida)
router.post('/logout', 
  authMiddleware.authenticate,
  authController.logout.bind(authController)
);

export default router;