import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log("Webhook recebido.");

  try {
    const body = await request.json();
    console.log('Notificação recebida:', body);

    if (body.action === 'payment.updated') {
      const paymentId = body.data.id;

      const paymentDetails = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      });

      if (!paymentDetails.ok) {
        throw new Error('Erro ao consultar o pagamento na API do Mercado Pago');
      }

      const paymentData = await paymentDetails.json();
      console.log(`Pagamento aprovado: ${paymentId}`);
      if (paymentData.status === 'approved') {
        console.log(`Pagamento aprovado: ${paymentId}`);
        // Notifique o frontend (exemplo: use WebSocket, SSE ou outro método)
        return NextResponse.json({ success: true, message: 'Pagamento aprovado' });
      } else if (paymentData.status === 'pending') {
        console.log(`Pagamento pendente: ${paymentId}`);
        return NextResponse.json({ success: false, message: 'Pagamento pendente' });
      }

      console.log(`Pagamento rejeitado: ${paymentId}`);
      return NextResponse.json({ success: false, message: `Pagamento não aprovado. Status: ${paymentData.status}` });
    }

    console.log('Ação inválida no webhook.');
    return NextResponse.json({ success: false, message: 'Ação ou tipo inválidos no webhook.' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
  }
}




