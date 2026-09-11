import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any, any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ 
        body: req.body, 
        query: req.query, 
        params: req.params 
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.issues.map(issue => issue.message) 
        });
      }
      next(error);
    }
};