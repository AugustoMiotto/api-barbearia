import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
const authService = new AuthService();

export class AuthController {
  // Como as rotas no Express precisam que o "this" seja preservado, 
  // usar arrow function (=>) aqui evita bugs futuros
  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, role } = req.body;

      // Validação simples
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
      }

      const user = await authService.register({ name, email, password, phone, role });
      
      return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
      
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }

      const result = await authService.login({ email, password });
      
      return res.status(200).json(result);
      
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  me = async (req: AuthRequest, res: Response) => {
    try {
      // O ID do usuário logado foi injetado pelo middleware no req.user!
      const userId = req.user?.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
      
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}
