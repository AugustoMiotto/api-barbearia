import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERRO]: ${err.message}`);
  return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
};