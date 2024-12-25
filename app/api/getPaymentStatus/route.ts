import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!id) {
      return NextResponse.json(
        { message: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    if (!accessToken) {
      console.error('Token de acesso não configurado');
      return NextResponse.json(
        { message: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    console.log(`Consultando pagamento ID: ${id}`);

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro na consulta do pagamento' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro na requisição:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor', error: error.message },
      { status: 500 }
    );
  }
}