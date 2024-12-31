"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useSession } from "next-auth/react";
import { Share, Download, QrCode, Eye } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import QRCodeGenerator from './QRCodeGenerator';
const CartoesPage = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [selectedCardUrl, setSelectedCardUrl] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    const fetchCards = async () => {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch(`/api/cards?userId=${session.user.id}`);
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }
        const data = await res.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCards();
  }, [session?.user?.id]);

  const handleViewCard = (id, nome) => {
    const slug = `${id}-${nome.toLowerCase().replace(/\s+/g, '-')}`;
    const url = `/card/${slug}`;
    window.open(url, '_blank');
  };

  const handleQrCodeGeneration = (card) => {
    const cardUrl = `${window.location.origin}/card/${card.id}-${card.nome.toLowerCase().replace(/\s+/g, '-')}`;
    setSelectedCardUrl(cardUrl);
  };

  const handleShareWhatsApp = (url) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isClient) {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0B15]">
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
                <div className="w-full bg-[#381021] p-8 rounded-lg border border-red-500/10 backdrop-blur-md">
                  {card.images && card.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {card.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                          onError={(e) => e.target.src = '/default-image.jpg'}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ 
                      color: card.corTexto || 'white',
                      fontFamily: card.fonte || 'sans-serif'
                    }}>
                      {card.nome}
                    </h2>
                    
                    <p className="text-lg text-gray-300 mb-6 italic break-words" style={{ 
                      fontFamily: card.fonte || 'sans-serif',
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
                    <div className="mt-4 flex items-center justify-center">
                      <audio controls className="w-full max-w-md">
                        <source src={card.musicUrl} type="audio/mp3" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    </div>
                  )}

                  <div className="mt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full bg-red-500 hover:bg-red-600 text-white border-none flex items-center justify-center gap-2"
                        >
                          <Share size={16} />
                          <span>Compartilhar</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-white text-black shadow-lg border border-gray-300 rounded-md"
                      >
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleQrCodeGeneration(card)}
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          <span>QR Code</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleViewCard(card.id, card.nome)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver Cartão</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedCardUrl && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <h3 className="text-xl text-center text-white mb-4">QR Code do Cartão</h3>
                      <div className="flex justify-center mb-4">
                        <QRCodeGenerator url={selectedCardUrl} />
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full bg-green-500 hover:bg-green-600 text-white border-none flex items-center justify-center gap-2"
                        onClick={() => handleShareWhatsApp(selectedCardUrl)}
                      >
                        Compartilhar no WhatsApp
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartoesPage;