import { prisma } from '../lib/prisma.js';

export class BarbershopService {
  async create(data: { name: string; address: string; ownerId: number }) {
    const barbershop = await prisma.barbershop.create({
      data: {
        name: data.name,
        address: data.address,
        ownerId: data.ownerId,
      },
    });

    return barbershop;
  }

  async listAll() {
    return await prisma.barbershop.findMany({
      include: {
        services: true, // Já traz os serviços junto, se houver
      },
    });
  }

  async addService(data: { name: string; description?: string; price: number; durationMinutes: number; barbershopId: number }) {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
        barbershopId: data.barbershopId,
      },
    });

    return service;
  }
}