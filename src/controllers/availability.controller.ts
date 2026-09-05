import type { Response } from 'express';
import { AvailabilityService } from '../services/availability.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const availabilityService = new AvailabilityService();

export class AvailabilityController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { dayOfWeek, startTime, endTime } = req.body;
      
      // Pega o ID de quem está fazendo a requisição (O próprio barbeiro/admin logado)
      const barberId = req.user?.id;

      if (dayOfWeek === undefined || !startTime || !endTime) {
        return res.status(400).json({ error: 'Dia da semana, horário de início e fim são obrigatórios.' });
      }

      if (!barberId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const availability = await availabilityService.setAvailability({
        barberId,
        dayOfWeek,
        startTime,
        endTime
      });

      return res.status(201).json({ message: 'Agenda configurada com sucesso!', availability });
      
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}