"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useSession } from "next-auth/react";
import { Share, Download, QrCode } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

const CartoesPage = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`../../api/cards?userId=${session.user.id}`) // Usa o ID dinâmico do usuário
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erro na API: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('API Response:', data);
          setCards(data);
        })
        .catch((err) => {
          console.error('API Error:', err); // Debug
          setError(err.message);
        });
    }
  }, [session]);
  

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-500">Seus Cartões</h1>
      
      {cards.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          Nenhum cartão encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="rounded-lg border border-red-500/20 bg-gradient-to-r from-red-600/10 to-pink-600/10 backdrop-blur-sm p-8">
              <div className="w-full bg-gradient-to-r from-red-500/5 to-pink-500/5 p-8 rounded-lg border border-red-500/10 backdrop-blur-md">
              {card.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {card.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image.url} // Verifique se o caminho da URL está correto
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => e.target.src = '/default-image.jpg'} // Exemplo de fallback de imagem
                    />
                  ))}
                </div>
              )}
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: card.corTexto, fontFamily: card.fonte }}>
                    {card.nome}
                  </h2>
                  
                  <p className="text-lg text-gray-300 mb-6 italic break-words" style={{ 
                    fontFamily: card.fonte,
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}>
                    {card.mensagem}
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">❤️</span>
                    <span className="text-sm text-gray-400">
                      {new Date(card.data).toLocaleDateString()}
                    </span>
                    <span className="text-xl">❤️</span>
                  </div>
                </div>

                {card.musicUrl && (
                  <div className="mt-4 flex justify-center">
                    <audio controls className="w-full max-w-md">
                      <source src={card.musicUrl} type="audio/mp3" />
                    </audio>
                  </div>
                )}

                <div className="mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full bg-red-500 hover:bg-red-600 text-white border-none">
                        <Share className="mr-2 h-4 w-4" />
                        Compartilhar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartoesPage;