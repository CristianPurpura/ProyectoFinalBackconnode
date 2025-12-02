import express from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

router.post('/login', authController.login.bind(authController));
router.post('/verify', authController.verifyToken.bind(authController));

router.get('/profile', 
  authMiddleware.authenticate,
  authController.getProfile.bind(authController)
);

router.post('/logout', 
  authMiddleware.authenticate,
  authController.logout.bind(authController)
);

export default router;