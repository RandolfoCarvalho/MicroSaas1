

"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const CardPreview = ({ params }) => {
  const { id } = params;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-red-900/50 to-black border border-red-800/30 backdrop-blur-sm shadow-2xl">
        <div className="p-8">
          {/* Card Content */}
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              {card?.nome || 'Seu Nome'}
            </h2>
            
            <p className="text-lg text-gray-300 italic px-4">
              {card?.mensagem || 'Sua mensagem de amor aparecerá aqui...'}
            </p>

            <div className="flex items-center justify-center gap-3 text-red-500">
              <span className="text-2xl">❤️</span>
              <span className="text-sm text-gray-400">{card?.data || 'DD/MM/AAAA'}</span>
              <span className="text-2xl">❤️</span>
            </div>

            {/* Audio Controls */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={togglePlay}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-lg" />
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
          </div>

          {/* Preview Text */}
          <div className="mt-6 text-center">
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
