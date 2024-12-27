// app/api/cardsPreview/[id]/[nome]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';

export async function GET(request, { params }) {
  try {
    const { id, nome } = params;

    // Validação do ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID inválido ou ausente' },
        { status: 400 }
      );
    }

    // Validação do nome
    if (!nome) {
      return NextResponse.json(
        { error: 'Nome ausente' },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { 
        id: Number(id),
      },
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

    // Validação opcional: verificar se o nome na URL corresponde ao nome do cartão
    const decodedNome = decodeURIComponent(nome);
    if (card.nome && decodedNome && card.nome.toLowerCase() !== decodedNome.toLowerCase()) {
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