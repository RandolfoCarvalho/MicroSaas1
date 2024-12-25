import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Notificação recebida:', body);

    // Verifique o tipo de notificação e o status do pagamento
    if (body.type === 'payment' && body.data.id) {
      const paymentId = body.data.id;

      // Use a API do Mercado Pago para consultar detalhes do pagamento
      const paymentDetails = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: process.env.MERCADO_PAGO_ACCESS_TOKEN
        }
      }).then(res => res.json());

      if (paymentDetails.status === 'approved') {
        console.log('Pagamento aprovado:', paymentDetails);

        // Aqui você pode processar o pagamento aprovado
        // Ex: criar um cartão, atualizar status no banco de dados, etc.
      }
    }
    console.log("enviando notificacoes");
    return NextResponse.json({ message: 'Notificação processada' });
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    );
  }
}
