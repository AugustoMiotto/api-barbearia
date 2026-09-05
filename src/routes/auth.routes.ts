import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
const authRoutes = Router();
const authController = new AuthController();

// Vai escutar requisições do tipo POST na rota /register
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/me', verifyToken, authController.me);

export { authRoutes };