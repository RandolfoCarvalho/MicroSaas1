// pages/paymentStatus.js

import { useState } from 'react';

export default function PaymentStatus() {
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!paymentId) {
      setError('Digite um ID de pagamento');
      return;
    }

    setError('');
    setPaymentStatus(null);

    try {
      const response = await fetch(`/api/getPaymentStatus?id=${paymentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao consultar o pagamento');
        return;
      }

      const data = await response.json();
      setPaymentStatus(data);
    } catch (err) {
      setError('Erro na requisição');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de Status de Pagamento</h1>
      <input
        type="text"
        placeholder="Digite o ID do pagamento"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleCheckStatus} style={{ marginLeft: '10px', padding: '10px' }}>
        Consultar
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {paymentStatus && (
        <div>
          <h2>Detalhes do Pagamento</h2>
          <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
