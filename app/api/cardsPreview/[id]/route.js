// app/api/cardsPreview/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID inválido ou ausente' },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: Number(id) },
      include: {
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Cartão não encontrado' },
        { status: 404 }
      );
    }

    // Formatar URLs das imagens para exibição pública
    const cardWithFormattedImages = {
      ...card,
      images: card.images.map(image => ({
        ...image,
        url: `/imagens/${image.url}`, // Ajuste conforme o local real das imagens no projeto
      })),
    };

    return NextResponse.json(cardWithFormattedImages);
  } catch (error) {
    console.error('Erro ao buscar o cartão:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar o cartão' },
      { status: 500 }
    );
  }
}
