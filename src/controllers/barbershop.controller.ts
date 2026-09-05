import type { Response } from 'express';
import { BarbershopService } from '../services/barbershop.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const barbershopService = new BarbershopService();

export class BarbershopController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { name, address } = req.body;
      
      // Pega o ID do admin que está logado (injetado pelo middleware)
      const ownerId = req.user?.id; 

      if (!name || !address) {
        return res.status(400).json({ error: 'Nome e endereço são obrigatórios.' });
      }

      if (!ownerId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const barbershop = await barbershopService.create({ name, address, ownerId });
      
      return res.status(201).json({ message: 'Barbearia criada com sucesso!', barbershop });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  list = async (req: AuthRequest, res: Response) => {
    try {
      const barbershops = await barbershopService.listAll();
      return res.status(200).json(barbershops);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar barbearias.' });
    }
  }
  addService = async (req: AuthRequest, res: Response) => {
    try {
      // Pega o ID que vem na URL (ex: /barbershops/1/services -> id = 1)
      const barbershopId = Number(req.params.id); 
      const { name, description, price, durationMinutes } = req.body;

      if (!name || price === undefined || !durationMinutes) {
        return res.status(400).json({ error: 'Nome, preço e duração são obrigatórios.' });
      }

      const service = await barbershopService.addService({
        name,
        description,
        price,
        durationMinutes,
        barbershopId
      });

      return res.status(201).json({ message: 'Serviço adicionado com sucesso!', service });
      
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno ao adicionar serviço.' });
    }
  }
}