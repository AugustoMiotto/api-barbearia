import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const availabilityRoutes = Router();
const availabilityController = new AvailabilityController();

// Note o array ['BARBER', 'ADMIN'] liberando o acesso para os dois perfis
availabilityRoutes.post('/', verifyToken, requireRole(['BARBER', 'ADMIN']), availabilityController.create);

export { availabilityRoutes };