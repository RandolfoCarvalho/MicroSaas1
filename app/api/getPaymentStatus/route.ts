import { NextResponse } from 'next/server';

// Constants
const POLLING_MAX_ATTEMPTS = 30; // 1 minute maximum (30 attempts * 2 seconds)
const POLLING_INTERVAL = 2000; // 2 seconds

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

    // Check payment status
    const paymentStatus = await checkPaymentStatus(id, accessToken);
    return NextResponse.json(paymentStatus);

  } catch (error) {
    console.error('Erro na requisição:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor', error: error.message },
      { status: 500 }
    );
  }
}

async function checkPaymentStatus(paymentId, accessToken) {
  const consultPayment = async () => {
    console.log(`Consultando pagamento ID: ${paymentId}`);
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao consultar status do pagamento');
    }

    return await response.json();
  };

  const data = await consultPayment();
  return {
    status: data.status,
    isApproved: data.status === 'approved'
  };
}