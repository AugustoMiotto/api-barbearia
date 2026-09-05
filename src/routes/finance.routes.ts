import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const financeRoutes = Router();
const financeController = new FinanceController();

// Todas as rotas de finanças exigem token E cargo de ADMIN
financeRoutes.use(verifyToken, requireRole(['ADMIN']));

financeRoutes.post('/transactions', financeController.create);
financeRoutes.get('/dashboard/:barbershopId', financeController.dashboard);
financeRoutes.get('/export/:barbershopId', financeController.exportExcel);
export { financeRoutes };