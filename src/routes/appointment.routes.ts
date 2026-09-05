import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const appointmentRoutes = Router();
const appointmentController = new AppointmentController();

// Apenas exige que o usuário esteja logado (verifyToken)
appointmentRoutes.post('/', verifyToken, appointmentController.create);

export { appointmentRoutes };