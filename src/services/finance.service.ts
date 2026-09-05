import { prisma } from '../lib/prisma.js';

export class FinanceService {
  async createTransaction(data: { barbershopId: number; type: 'INCOME' | 'EXPENSE'; amount: number; description: string; appointmentId?: number }) {
    const transaction = await prisma.financialTransaction.create({
      data: {
        barbershopId: data.barbershopId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        // Converte undefined para null e agrada o Prisma
        appointmentId: data.appointmentId ?? null, 
      },
    });

    return transaction;
  }

  // 2. Gera o resumo financeiro (Dashboard)
  async getDashboard(barbershopId: number) {
    const transactions = await prisma.financialTransaction.findMany({
      where: { barbershopId },
      orderBy: { date: 'desc' } // Traz as mais recentes primeiro
    });

    // Calcula os totais convertendo o Decimal do banco para Number
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    const balance = income - expense;

    return {
      summary: {
        income,
        expense,
        balance
      },
      transactions
    };
  }
}