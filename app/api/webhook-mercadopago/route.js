import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Notificação recebida:', body);

    if (body.type === 'payment' && body.data.id) {
      const paymentId = body.data.id;

      // Consultar detalhes do pagamento na API do Mercado Pago
      const paymentDetails = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
        }
      }).then(res => res.json());

      if (paymentDetails.status === 'approved') {
        console.log('Pagamento aprovado:', paymentDetails);

        // Lógica para criar o cartão
        const createCardResponse = await fetch('http://localhost:3000/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: paymentDetails.user_id, // ou outro campo relevante
            nome: 'Cartão após pagamento',
            mensagem: 'Obrigado pela compra!',
            data: new Date().toISOString(),
            corTexto: '#000000',
            fonte: 'sans',
            musicUrl: '',
            images: [], // Adicione imagens se necessário
          }),
        });

        if (!createCardResponse.ok) {
          console.error('Erro ao criar cartão:', await createCardResponse.json());
        } else {
          console.log('Cartão criado com sucesso!');
        }
      }
    }
    return NextResponse.json({ message: 'Notificação processada' });
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    );
  }
}
