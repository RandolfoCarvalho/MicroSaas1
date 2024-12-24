// app/api/cards/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Criar o cartão
    const card = await prisma.card.create({
      data: {
        userId: data.userId,
        nome: data.nome,
        mensagem: data.mensagem,
        data: data.data,
        corTexto: data.corTexto,
        fonte: data.fonte,
        musicUrl: data.musicUrl,
        images: {
          create: data.images.map(url => ({
            url: url
          }))
        }
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating card' },
      { status: 500 }
    );
  }
}