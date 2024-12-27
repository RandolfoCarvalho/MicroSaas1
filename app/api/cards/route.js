// app/api/cards/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';

// Função para lidar com POST (criar um cartão)
// app/api/cards/route.js
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Dados recebidos:', data); // Para debug

    // Validação dos dados
    if (!data.userId || !data.nome || !data.mensagem || !data.data) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar se images existe antes de tentar mapear
    const createData = {
      userId: data.userId,
      nome: data.nome,
      mensagem: data.mensagem,
      data: data.data,
      corTexto: data.corTexto || '#000000', // valor padrão se não fornecido
      fonte: data.fonte || 'Arial', // valor padrão se não fornecido
      musicUrl: data.musicUrl || '',
    };

    // Só adiciona images se existir
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      createData.images = {
        create: data.images.map((url) => ({ url }))
      };
    }

    const card = await prisma.card.create({
      data: createData,
      include: {
        images: true // Incluir imagens na resposta
      }
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Erro detalhado:', error); // Log do erro completo
    return NextResponse.json(
      { error: error.message || 'Error creating card' },
      { status: 500 }
    );
  }
}

// Função para lidar com GET (listar cartões)
// app/api/cards/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId && isNaN(Number(userId))) {
      return NextResponse.json(
        { error: 'Invalid userId format. Must be a number.' },
        { status: 400 }
      );
    }

    const cards = await prisma.card.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: {
        images: {
          select: {
            url: true,
            id: true
          }
        }
      },
    });
    const cardsWithFormattedImages = cards.map(card => ({
      ...card,
      images: card.images.map(image => `../../public/imagens/${image.url}`)
    }));

    return NextResponse.json(cardsWithFormattedImages);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Error fetching cards' },
      { status: 500 }
    );
  }
}

