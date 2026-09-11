import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    phone: z.string().optional(),
    role: z.enum(['CLIENT', 'BARBER', 'ADMIN']).default('CLIENT'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
  }),
});

export const barbershopSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nome da barbearia obrigatório'),
    address: z.string().min(5, 'Endereço obrigatório'),
  }),
});