"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const CardPreview = ({ params }) => {
  const { slug } = params;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Extrair ID e nome do slug
  const [id, nome] = slug ? slug.split('-') : [];
  const decodedNome = nome ? decodeURIComponent(nome) : '';

  useEffect(() => {
    const fetchCard = async () => {
      try {
        if (!id) return;
        const response = await fetch(`../../api/cardsPreview/${id}/${nome}`);
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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div className="text-white text-center p-4">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Erro: {error}</div>;

  return (
    <div className="rounded-lg border border-red-500/20 bg-gradient-to-r from-red-600/10 to-pink-600/10 backdrop-blur-sm p-8">
      <div className="h-full flex flex-col items-center justify-center">
        {card?.images && card.images.length > 0 && (
          <div className="carousel w-full max-w-md mb-6">
            {card.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="rounded-lg shadow-md w-full"
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-md bg-gradient-to-r from-red-500/5 to-pink-500/5 p-8 rounded-lg border border-red-500/10 backdrop-blur-md">
          <div className="text-center">
            <h2 
              className="text-2xl font-bold mb-4" 
              style={{ 
                color: card?.corTexto || 'white', 
                fontFamily: card?.fonte || 'inherit' 
              }}
            >
              {card?.nome || decodedNome || 'Seu Nome'}
            </h2>
            <p 
              className="text-lg text-gray-300 mb-6 italic break-words"
              style={{
                fontFamily: card?.fonte || 'inherit',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {card?.mensagem || 'Sua mensagem de amor aparecerá aqui...'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">❤️</span>
              <span className="text-sm text-gray-400">
                {card?.data || 'DD/MM/AAAA'}
              </span>
              <span className="text-xl">❤️</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={togglePlay}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          {card?.musicUrl && (
            <audio
              ref={audioRef}
              src={card.musicUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
        
        <p className="text-sm text-gray-400 mt-4">
          Prévia do seu cartão de amor
        </p>
      </div>
    </div>
  );
};

export default CardPreview;