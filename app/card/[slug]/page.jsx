//card/[slug]/page.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

// Definindo os estilos keyframes para as animações
const styles = `
@keyframes glow {
  0% {
    box-shadow: 0 0 5px #ff0000,
                0 0 10px #ff0000,
                0 0 15px #ff0000;
  }
  50% {
    box-shadow: 0 0 20px #ff0000,
                0 0 25px #ff0000,
                0 0 30px #ff0000;
  }
  100% {
    box-shadow: 0 0 5px #ff0000,
                0 0 10px #ff0000,
                0 0 15px #ff0000;
  }
}

@keyframes borderGlow {
  0% {
    border-color: #ffd700;
  }
  50% {
    border-color: #ffec8b;
  }
  100% {
    border-color: #ffd700;
  }
}
`;

const CardPreview = ({ params }) => {
  const { slug } = params;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); // Estado para desbloquear
  const audioRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [id, nome] = slug ? slug.split("-") : [];
  const decodedNome = nome ? decodeURIComponent(nome) : "";

  useEffect(() => {
    const fetchCard = async () => {
      try {
        if (!id) return;
        const response = await fetch(`../../api/cardsPreview/${id}/${nome}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao buscar o cartão");
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
  }, [id, nome]);

  useEffect(() => {
    if (card?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === card.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [card?.images]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (loading) return <div className="text-white text-center p-4">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <style>{styles}</style>
      {!isUnlocked ? (
        <button
          onClick={handleUnlock}
          className="relative overflow-hidden px-8 py-3 text-white font-bold text-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(45deg, #ff0000, #ff4444)',
            border: '2px solid #ffd700',
            borderRadius: '8px',
            animation: 'glow 2s infinite, borderGlow 2s infinite',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            transform: 'perspective(1px) translateZ(0)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'perspective(1px) translateZ(0) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'perspective(1px) translateZ(0) scale(1)';
          }}
        >
          ✨ Surpresa ✨
        </button>
      ) : (
        <div
          className="rounded-lg p-8 w-full max-w-2xl"
          style={{ backgroundColor: "#1A0B15", border: "1px solid rgba(255, 0, 0, 0.2)" }}
        >
          <div className="h-full flex flex-col items-center justify-center">
            {card?.images && card.images.length > 0 && (
              <div className="relative w-full max-w-md mb-6 aspect-video">
                <div className="carousel relative w-full h-full rounded-lg overflow-hidden">
                  {card.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Imagem ${index + 1}`}
                      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div
              className="w-full max-w-md p-8 rounded-lg"
              style={{ backgroundColor: "#381021", border: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
              <div className="text-center">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: card?.corTexto || "white",
                    fontFamily: card?.fonte || "inherit",
                  }}
                >
                  {card?.nome || decodedNome || "Seu Nome"}
                </h2>
                <p
                  className="text-lg text-gray-300 mb-6 italic break-words"
                  style={{
                    fontFamily: card?.fonte || "inherit",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {card?.mensagem || "Sua mensagem de amor aparecerá aqui..."}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">❤️</span>
                  <span className="text-sm text-gray-400">{card?.data || "DD/MM/AAAA"}</span>
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

            <p className="text-sm text-gray-400 mt-4">Prévia do seu cartão de amor</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;
