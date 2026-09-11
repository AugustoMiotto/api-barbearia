import { Router } from 'express';
import { barbershopRoutes } from './barbershop.routes.js';
import { authRoutes } from './auth.routes.js';
import { availabilityRoutes } from './availability.routes.js';
import { appointmentRoutes } from './appointment.routes.js';
import { financeRoutes } from './finance.routes.js';
import { dashboardRoutes } from './dashboard.routes.js';

const router = Router();
router.use('/barbershops', barbershopRoutes);
router.use('/auth', authRoutes);
router.use('/barbearshops',barbershopRoutes);
router.use('/availability', availabilityRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/finances', financeRoutes);
router.use('/dashboard', dashboardRoutes);

export { router };