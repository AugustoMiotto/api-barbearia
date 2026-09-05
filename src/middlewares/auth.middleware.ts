import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Criamos um tipo customizado para a requisição, adicionando os dados do usuário
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

// 2. Middleware principal: Verifica se o usuário está logado
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  // O cabeçalho vem no formato "Bearer <token>". O split separa a palavra do token em si.
  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave secreta não configurada.');
    }

    // A MÁGICA ACONTECE AQUI: convertemos para unknown primeiro, e depois para o nosso tipo
    const decoded = jwt.verify(token, secret) as unknown as { id: number; role: string };

    // Injeta os dados do usuário (id e role) dentro da requisição para o Controller poder usar
    req.user = decoded;

    // Tudo certo! Pode prosseguir para o Controller
    return next();
    
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// 3. Middleware de Autorização: Verifica o cargo (Role)
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Se o cargo do usuário logado não estiver na lista de cargos permitidos, bloqueia
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  };
};