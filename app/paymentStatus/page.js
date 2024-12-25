'use client';

import { useState } from 'react';

export default function PaymentStatus() {
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!paymentId.trim()) {
      setError('Digite um ID de pagamento');
      return;
    }

    setError('');
    setPaymentStatus(null);
    setLoading(true);

    try {
      const response = await fetch(`../api/getPaymentStatus?id=${encodeURIComponent(paymentId.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar o pagamento');
      }

      const data = await response.json();
      setPaymentStatus(data);
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err.message || 'Erro na requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Consulta de Status de Pagamento</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Digite o ID do pagamento"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button 
          onClick={handleCheckStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {paymentStatus && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Detalhes do Pagamento</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(paymentStatus, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}