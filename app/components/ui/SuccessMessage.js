import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './alert';

const SuccessMessage = ({ onClose }) => {
  const [show, setShow] = useState(true);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setHearts(newHearts);

    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute animate-float text-pink-500"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              opacity: 0
            }}
            size={24}
          />
        ))}
        <Alert className="shadow-lg max-w-md mx-4 animate-bounce-slow bg-background border-pink-500">
          <AlertTitle className="text-2xl font-bold text-pink-500 mb-2">
            Cartão Criado! 💝
          </AlertTitle>
          <AlertDescription className="text-foreground">
            Seu cartão especial foi criado com sucesso! Obrigado por compartilhar seu amor.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SuccessMessage;