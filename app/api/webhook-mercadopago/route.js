import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log("Webhook recebido.");

  try {
    // Captura o corpo da requisição
    const body = await request.json();
    console.log('Notificação recebida:', body);

    // Verifica se a notificação é do tipo 'payment.updated' e se contém o 'id' do pagamento
    if (body.action === 'payment.updated') {
      const paymentId = body.data.id;

      // Consultar a API do Mercado Pago para verificar o status do pagamento
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

      // Verifica o status do pagamento
      if (paymentData.status === 'approved') {
        console.log(`Pagamento aprovado com sucesso: ${paymentId}`);
        return NextResponse.json({
          success: true,
          message: 'Pagamento aprovado com sucesso.',
          requestData: {
            action: body.action,
            api_version: body.api_version,
            data: body.data,
            date_created: body.date_created,
            id: body.id,
            live_mode: body.live_mode,
            type: body.type,
            user_id: body.user_id,
          },
        });
      } else if (paymentData.status === 'pending') {
        console.log(`Pagamento pendente: ${paymentId}`);
        return NextResponse.json({
          success: false,
          message: 'Pagamento ainda pendente.',
        });
      } else {
        console.log(`Pagamento não aprovado. Status: ${paymentData.status}`);
        return NextResponse.json({
          success: false,
          message: `Pagamento não aprovado. Status: ${paymentData.status}`,
        });
      }
    }

    // Se a ação ou o tipo não corresponderem, retorna uma resposta com erro
    console.log("Webhook ignorado: ação ou tipo inválidos.");
    return NextResponse.json({ success: false, message: 'Ação ou tipo inválidos no webhook.' });

  } catch (error) {
    // Trata erros no processamento do webhook
    console.error('Erro ao processar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 },
    );
  }
}
