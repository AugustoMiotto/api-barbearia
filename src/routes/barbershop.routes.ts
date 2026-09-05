import { Router } from 'express';
import { BarbershopController } from '../controllers/barbershop.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
const barbershopRoutes = Router();
const barbershopController = new BarbershopController();

barbershopRoutes.get('/', barbershopController.list);
barbershopRoutes.post('/', verifyToken, requireRole(['ADMIN']), barbershopController.create);
barbershopRoutes.post('/:id/services', verifyToken, requireRole(['ADMIN']), barbershopController.addService);

export { barbershopRoutes };