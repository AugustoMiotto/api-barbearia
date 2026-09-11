import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

export const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(verifyToken); // Protege a rota
dashboardRoutes.use(requireRole(['BARBER', 'ADMIN']));

dashboardRoutes.get('/metrics', dashboardController.getMetrics);