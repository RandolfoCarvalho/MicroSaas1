"use client"

import { useEffect, useState } from 'react';

export default function CardPreview({ params }) {
  const { id } = params; // Obtém o ID diretamente das props
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`../../api/cardsPreview/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar o cartão');
        }
        const cardData = await response.json();
        setCard(cardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Pré-visualização do Cartão</h1>
      {card ? (
        <div>
          <h2>{card.nome}</h2>
          <p>{card.mensagem}</p>
          <p>Data: {card.data}</p>
          <p>Fonte: {card.fonte}</p>
          <p>
            Cor do Texto: <span style={{ color: card.corTexto }}>{card.corTexto}</span>
          </p>
          {card.musicUrl && (
            <div>
              <p>Música:</p>
              <audio controls src={card.musicUrl}></audio>
            </div>
          )}
          {card.images && card.images.length > 0 && (
            <div>
              <p>Imagens:</p>
              {card.images.map((image) => (
                <img key={image.id} src={image.url} alt="Imagem do cartão" style={{ maxWidth: '200px' }} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Cartão não encontrado</p>
      )}
    </div>
  );
}
