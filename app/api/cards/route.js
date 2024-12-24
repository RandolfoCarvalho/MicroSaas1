// app/api/cards/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';

// Função para lidar com POST (criar um cartão)
export async function POST(request) {
  try {
    const data = await request.json();

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
          create: data.images.map((url) => ({
            url,
          })),
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Error creating card' },
      { status: 500 }
    );
  }
}

// Função para lidar com GET (listar cartões)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validação de userId
    if (userId && isNaN(Number(userId))) {
      return NextResponse.json(
        { error: 'Invalid userId format. Must be a number.' },
        { status: 400 }
      );
    }

    // Buscar os cartões do banco de dados
    const cards = await prisma.card.findMany({
      where: userId ? { userId: Number(userId) } : {}, // Filtra por userId se fornecido
      include: {
        images: true, // Inclui as imagens associadas
      },
    });

    // Adicionar o caminho completo das imagens
    const cardsWithImages = cards.map(card => {
      const imagesWithFullPath = card.images.map(image => ({
        ...image,
        url: `../../imagens/${image.url}`, // Gera o caminho completo para as imagens
      }));

      return {
        ...card,
        images: imagesWithFullPath, // Substitui as imagens com o caminho completo
      };
    });

    return NextResponse.json(cardsWithImages);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Error fetching cards' },
      { status: 500 }
    );
  }
}
