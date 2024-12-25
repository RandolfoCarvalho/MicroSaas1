import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Inicialize o cliente MercadoPago com o accessToken
    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-6663323588277121-122418-03ef4130f63abcc1fdf40a79fd05592b-482914930',
      options: { timeout: 5000 }
    });

    // Inicialize a instância de pagamento
    const payment = new Payment(client);

    // Dados do pagamento, sem o campo 'token' para Pix
    const paymentData = {
      transaction_amount: Number(body.amount),
      description: 'Pagamento via PIX',
      payment_method_id: 'pix', // Especifica o pagamento via Pix
      payer: {
        email: body.email,
        first_name: 'Test',
        last_name: 'User',
        identification: {
          type: 'CPF',
          number: '06523693163'
        }
      },
    };

    console.log('Enviando dados de pagamento:', paymentData);

    try {
      const response = await payment.create({ body: paymentData });
      console.log('Resposta completa do MercadoPago:', JSON.stringify(response, null, 2));

      // Acesse o QR Code da resposta
      const qrCodeBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64;
      const qrCode = response.point_of_interaction?.transaction_data?.qr_code;

      if (qrCodeBase64 && qrCode) {
        return NextResponse.json({
          url: qrCodeBase64,
          qrCode: qrCode,
          paymentId: response.id
        });
      } else {
        console.error('Resposta sem QR code:', response);
        throw new Error('QR Code não encontrado na resposta');
      }
    } catch (paymentError) {
      console.error('Erro detalhado do pagamento:', paymentError);
      console.error('Mensagem de erro:', paymentError.message);
      if (paymentError.cause) {
        console.error('Causa do erro:', paymentError.cause);
      }

      return NextResponse.json(
        {
          error: 'Erro ao criar pagamento no MercadoPago',
          details: paymentError.message,
          cause: paymentError.cause
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error.message
      },
      { status: 500 }
    );
  }
}
