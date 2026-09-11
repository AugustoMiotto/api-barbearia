import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Importa o nosso arquivo centralizador de rotas (index.ts)
// Nota: Mesmo usando TypeScript, no formato ESM as importações locais costumam exigir a extensão .js no final
import { router } from './routes/index.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Diz para o Express que TODAS as rotas do nosso 'router' vão começar com '/api'
app.use('/api', router);

// Mantemos a rota raiz só para teste de saúde da API
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API da Barbearia rodando com TypeScript!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});