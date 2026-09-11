import type { Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const dashboardService = new DashboardService();

export class DashboardController {
  getMetrics = async (req: AuthRequest, res: Response) => {
    try {
      const barberId = req.user?.id;
      if (!barberId) return res.status(401).json({ error: 'Não autorizado' });

      const metrics = await dashboardService.getMetrics(barberId);
      return res.status(200).json(metrics);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}