import { prisma } from '../lib/prisma.js';

export class AppointmentService {
  async create(data: { clientId: number; barberId: number; serviceId: number; date: string; startTime: string }) {
    
    // 1. Busca o serviço para saber a duração dele
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new Error('Serviço não encontrado.');
    }

    // 2. Calcula o horário de término (endTime)
    // Pega "14:00", separa em horas e minutos
    const [hours, minutes] = data.startTime.split(':').map(Number); 
    
    // Cria uma data fake só para fazer a matemática do tempo
    const timeCalculator = new Date();
    timeCalculator.setHours(hours, minutes + service.durationMinutes, 0, 0);
    
    // Formata de volta para string (ex: "14:40")
    const endHours = String(timeCalculator.getHours()).padStart(2, '0');
    const endMinutes = String(timeCalculator.getMinutes()).padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}`;

    // 3. Salva o agendamento no banco
    const appointment = await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        // Converte a string "YYYY-MM-DD" para o formato DateTime que o Prisma exige
        date: new Date(data.date), 
        startTime: data.startTime,
        endTime: endTime,
        status: 'PENDING' // Começa como pendente
      },
    });

    return appointment;
  }
}