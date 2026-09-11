import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// 1. Blindagem de Segurança (Helmet)
app.use(helmet());

// 2. Proteção contra DDoS e força bruta (Rate Limiter)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 requisições por IP a cada 15 min
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api', limiter);

// 3. Correção do CORS (Permite que o Flutter acesse o Token)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

// 4. Rotas Principais
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API da Barbearia blindada e rodando!' });
});

// 5. O Ralo Global de Erros (Sempre por último!)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor protegido rodando na porta http://localhost:${PORT}`);
});