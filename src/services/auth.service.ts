import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(data: any) {
    const { name, email, password, phone, role } = data;

    // 1. Verifica se o e-mail já está cadastrado
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error('Este e-mail já está em uso.');
    }

    // 2. Criptografa a senha (Hash)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Salva no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'CLIENT', // Se não vier role, o padrão é CLIENT
      },
    });

    // 4. Remove a senha do objeto antes de devolver como resposta
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }
  async login(data: any) {
    const { email, password } = data;

    // 1. Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // 2. Compara a senha enviada com o Hash salvo no banco
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // 3. Gera o Token JWT válido por 7 dias
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave JWT não configurada no servidor.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, // Dados que vão dentro do token (Payload)
      secret,
      { expiresIn: '7d' }
    );

    // 4. Remove a senha antes de devolver os dados
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
