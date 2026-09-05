import { prisma } from '../lib/prisma.js';

export class AvailabilityService {
  async setAvailability(data: { barberId: number; dayOfWeek: number; startTime: string; endTime: string }) {
    
    // Verifica se o usuário existe
    const barber = await prisma.user.findUnique({
      where: { id: data.barberId }
    });

    if (!barber) {
      throw new Error('Usuário não encontrado.');
    }

    // Em um sistema real, você poderia verificar se ele já tem horário nesse dia 
    // e fazer um "update", mas vamos manter simples com o "create" por enquanto.
    const availability = await prisma.availability.create({
      data: {
        barberId: data.barberId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    return availability;
  }
}