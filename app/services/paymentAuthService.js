// services/paymentAuthService.js
import { useSession, signIn } from 'next-auth/react';

export class PaymentAuthService {
  static async verifyUserAndProcessPayment(formData, onLoginRequired, onPaymentRequired) {
    // Verificar se o usuário está logado
    const session = await useSession();
    
    if (!session || !session.user) {
      // Se não estiver logado, mostrar modal de login
      const loginResult = await new Promise((resolve) => {
        // Chamar callback para mostrar modal
        onLoginRequired(() => resolve(true));
      });

      if (!loginResult) {
        throw new Error('Login cancelado pelo usuário');
      }
    }

    // Gerar pagamento PIX
    try {
      const paymentResponse = await fetch('../api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 29.90, // Valor fixo do cartão
          email: session.user.email
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Erro ao gerar pagamento');
      }

      const paymentData = await paymentResponse.json();
      
      // Mostrar QR Code e aguardar confirmação
      const paymentResult = await new Promise((resolve) => {
        onPaymentRequired(paymentData, () => resolve(true));
      });

      if (!paymentResult) {
        throw new Error('Pagamento não concluído');
      }

      return true;
    } catch (error) {
      console.error('Erro no processo de pagamento:', error);
      throw error;
    }
  }
}