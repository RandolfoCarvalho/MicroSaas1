"use client";

import { useState } from 'react';
import './PaymentForm.css';

export default function PaymentForm({ onSuccess }) {
  const [pixUrl, setPixUrl] = useState(null);
  const [pixCode, setPixCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  // Definir o valor fixo de R$ 9,90
  const fixedAmount = 0.5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPixUrl(null);
    setPixCode(null);

    try {
      const response = await fetch('../api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: fixedAmount,
          email
        }),
      });

      const data = await response.json();
      console.log("Data:", JSON.stringify(data.paymentId, null, 2));
      if (!response.ok) {
        throw new Error(data.error || `Erro do servidor: ${response.status}`);
      }

      if (data.url) {
        setPixUrl(data.url);
        setPixCode(data.qrCode);
        setPaymentId(data.paymentId);
        if (onSuccess) {
          onSuccess({ url: data.url, qrCode: data.qrCode, paymentId:  data.paymentId });
        }
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (error) {
      setError(`Erro ao gerar pagamento PIX: ${error.message}`);
      console.error('Erro completo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600">Valor a pagar</div>
          <div className="text-2xl font-bold text-gray-900">R$ {fixedAmount}</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            E-mail para comprovante
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Gerando PIX...' : 'Gerar PIX'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {pixUrl && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code PIX</h3>
            <div className="bg-gray-50 p-4 rounded-lg inline-block">
              <img
                src={`data:image/jpeg;base64,${pixUrl}`}
                alt="QR Code do PIX"
                className="mx-auto w-48 h-48"
              />
            </div>
          </div>

          {pixCode && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Código PIX copia e cola</h4>
              <div className="relative">
                <textarea
                  readOnly
                  value={pixCode}
                  onClick={(e) => e.target.select()}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-black"
                  rows={3}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(pixCode)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
