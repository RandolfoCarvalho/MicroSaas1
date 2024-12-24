import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../prisma/prisma'; // Ajuste o caminho para onde está sua configuração do Prisma

export async function POST(request) {
  try {
    const { email, name, password } = await request.json();

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
