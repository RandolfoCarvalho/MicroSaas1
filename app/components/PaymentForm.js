"use client";

import { useState } from 'react';
import './PaymentForm.css';

export default function PaymentForm() {
  const [pixUrl, setPixUrl] = useState(null);
  const [pixCode, setPixCode] = useState(null);
  const [loading, setLoading] = useState(false);
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
          amount: fixedAmount, // Usando o valor fixo de 9,90
          email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro do servidor: ${response.status}`);
      }

      if (data.url) {
        setPixUrl(data.url);
        setPixCode(data.qrCode);
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
    <div className="payment-form">
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          <span>Valor: {fixedAmount}</span>
        </label>

        <label>
          <span>E-mail:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </label>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Carregando...' : 'Gerar pagamento PIX'}
        </button>
      </form>

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {pixUrl && (
        <div className="pix-url">
          <h3>QR Code do PIX</h3>
          <img
            src={`data:image/jpeg;base64,${pixUrl}`}
            alt="QR Code do PIX"
            className="pix-image"
          />
          {pixCode && (
            <div className="pix-code">
              <h4>Código PIX:</h4>
              <textarea
                readOnly
                value={pixCode}
                className="pix-code-text"
                onClick={(e) => e.target.select()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
