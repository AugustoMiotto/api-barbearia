import { prisma } from '../lib/prisma.js';

export class DashboardService {
  async getMetrics(barberId: number) {
    // 1. Acha a barbearia do dono
    const barbershop = await prisma.barbershop.findFirst({ where: { ownerId: barberId } });
    if (!barbershop) throw new Error('Barbearia não encontrada para este usuário');

    // 2. Faturamento Total (Entradas)
    const revenue = await prisma.financialTransaction.aggregate({
      where: { barbershopId: barbershop.id, type: 'INCOME' },
      _sum: { amount: true },
    });

    // 3. Serviço mais pedido
    const topService = await prisma.appointment.groupBy({
      by: ['serviceId'],
      where: { barberId, status: 'COMPLETED' },
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 1,
    });

    let topServiceName = 'Nenhum';
    if (topService.length > 0) {
      const s = await prisma.service.findUnique({ where: { id: topService[0].serviceId } });
      if (s) topServiceName = s.name;
    }

    // 4. Horário de Pico
    const peakHour = await prisma.appointment.groupBy({
      by: ['startTime'],
      where: { barberId },
      _count: { startTime: true },
      orderBy: { _count: { startTime: 'desc' } },
      take: 1,
    });

    // 5. Total de Agendamentos no mês atual
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const totalAppointments = await prisma.appointment.count({
      where: { barberId, date: { gte: firstDayOfMonth } },
    });

    return {
      revenue: revenue._sum.amount || 0,
      totalAppointments,
      topServiceName,
      peakHour: peakHour.length > 0 ? peakHour[0].startTime : 'N/A',
    };
  }
}