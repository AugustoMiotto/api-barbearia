import type { Response } from 'express';
import { AppointmentService } from '../services/appointment.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const appointmentService = new AppointmentService();

export class AppointmentController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { barberId, serviceId, date, startTime } = req.body;
      
      // O cliente que está agendando é o usuário logado no aplicativo!
      const clientId = req.user?.id;

      if (!barberId || !serviceId || !date || !startTime) {
        return res.status(400).json({ error: 'Faltam dados para o agendamento.' });
      }

      if (!clientId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const appointment = await appointmentService.create({
        clientId,
        barberId,
        serviceId,
        date,
        startTime
      });

      return res.status(201).json({ message: 'Agendamento realizado com sucesso!', appointment });
      
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}