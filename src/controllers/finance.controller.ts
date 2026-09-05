import type { Response } from 'express';
import { FinanceService } from '../services/finance.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import ExcelJS from 'exceljs';

const financeService = new FinanceService();

export class FinanceController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { barbershopId, type, amount, description, appointmentId } = req.body;

      if (!barbershopId || !type || amount === undefined || !description) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios para a transação.' });
      }

      // Garante que o tipo seja válido
      if (type !== 'INCOME' && type !== 'EXPENSE') {
        return res.status(400).json({ error: 'Tipo inválido. Use INCOME ou EXPENSE.' });
      }

      const transaction = await financeService.createTransaction({
        barbershopId,
        type,
        amount,
        description,
        appointmentId
      });

      return res.status(201).json({ message: 'Transação registrada com sucesso!', transaction });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao registrar transação.' });
    }
  }

  dashboard = async (req: AuthRequest, res: Response) => {
    try {
      const barbershopId = Number(req.params.barbershopId);

      if (!barbershopId) {
        return res.status(400).json({ error: 'ID da barbearia é obrigatório.' });
      }

      const dashboardData = await financeService.getDashboard(barbershopId);
      return res.status(200).json(dashboardData);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao carregar dashboard.' });
    }
  }

  exportExcel = async (req: AuthRequest, res: Response) => {
    try {
      const barbershopId = Number(req.params.barbershopId);

      if (!barbershopId) {
        return res.status(400).json({ error: 'ID da barbearia é obrigatório.' });
      }

      // Aproveitamos o service que já busca todas as transações
      const { transactions } = await financeService.getDashboard(barbershopId);

      // Cria a planilha em branco
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fluxo de Caixa');

      // Define os cabeçalhos das colunas
      worksheet.columns = [
        { header: 'Data', key: 'date', width: 15 },
        { header: 'Tipo', key: 'type', width: 15 },
        { header: 'Descrição', key: 'description', width: 40 },
        { header: 'Valor (R$)', key: 'amount', width: 15 }
      ];

      // Preenche as linhas com os dados do banco
      transactions.forEach(t => {
        worksheet.addRow({
          date: t.date.toLocaleDateString('pt-BR'),
          type: t.type === 'INCOME' ? 'Receita' : 'Despesa',
          description: t.description,
          amount: Number(t.amount)
        });
      });

      // Configura os cabeçalhos HTTP para forçar o download de um arquivo .xlsx
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio_financeiro.xlsx'
      );

      // Escreve a planilha na resposta e encerra a requisição
      await workbook.xlsx.write(res);
      return res.end();
      
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao gerar o arquivo Excel.' });
    }
  }
}