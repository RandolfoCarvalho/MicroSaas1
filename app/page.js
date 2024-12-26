"use client"

import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import useAuthVerification from './hooks/useAuthVerification';
import LoginModal from './components/loginModal';
import PaymentForm from './components/PaymentForm';
import SuccessMessage from './components/ui/SuccessMessage';


export default function Home() {
  console.log("Componente renderizado");
  const {
    isAuthenticated,
    isModalVisible,
    verifyAuth,
    closeModal,
    setIsModalVisible,
  } = useAuthVerification();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    mensagem: '',
    data: '',
    corTexto: '#ff0000',
    fonte: 'sans',
    musicUrl: '',
  });

  const [images, setImages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Função para lidar com upload de música
  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        musicUrl: url
      }));
    }
  };

  // Função para controlar play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const VerifyPayment = async (paymentId) => {
    try {
      console.log('Iniciando verificação para paymentId:', paymentId);
      
      const paymentResponse = await fetch(`/api/getPaymentStatus?id=${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!paymentResponse.ok) {
        console.error('Resposta não ok do getPaymentStatus');
        throw new Error('Erro ao consultar o pagamento');
      }
  
      const paymentData = await paymentResponse.json();
      console.log('Status do pagamento:', paymentData.status);
  
      if (paymentData.status === 'approved') {
        console.log('Pagamento aprovado!');
        console.log('deu certo'); // Novo console.log adicionado
        await createCard();
        return true;
      }
      console.log('Pagamento ainda pendente');
      return false;
      
    } catch (error) {
      console.error('Erro em VerifyPayment:', error);
      return false;
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    console.log('Iniciando checkPaymentStatus para ID:', paymentId);
    let attempts = 0;
    const maxAttempts = 100;
  
    const pollStatus = () => {
      return new Promise((resolve, reject) => {
        console.log('Iniciando polling');
        const interval = setInterval(async () => {
          try {
            attempts++;
            console.log(`Tentativa ${attempts} de ${maxAttempts}`);
            console.log(`Status pagamento: ${paymentId}`)
            const paymentApproved = await VerifyPayment(paymentId);
            
            if (paymentApproved) {
              console.log('Pagamento aprovado - encerrando polling');
              clearInterval(interval);
              resolve(true);
            } else if (attempts >= maxAttempts) {
              console.log('Tempo limite excedido');
              clearInterval(interval);
              reject(new Error('Tempo limite de verificação excedido'));
            }
          } catch (error) {
            console.error('Erro no polling:', error);
            clearInterval(interval);
            reject(error);
          }
        }, 2000);
      });
    };
  
    return pollStatus();
  };

  const handleGenerateQrCode = async (data) => {
    try {
      console.log("Iniciando geração de QR Code...");
      console.log("Payment id finalmente: " + data.paymentId)
      const paymentResponse = await fetch('/api/webhook-mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          totalAmount: 0.10,
        }),
      });

      console.log("Chamando verifyStatus");
      checkPaymentStatus(data.paymentId);
      if (!paymentResponse.ok || !paymentData.qrCode) {
        throw new Error('Erro ao gerar o QR Code.');
      }
  
      console.log('QR Code gerado com sucesso:', paymentData.qrCode);
      alert('QR Code gerado. Aguarde a confirmação do pagamento.');
  
      // Exiba o QR Code na interface (exemplo simples)
      setQrCode(paymentData.qrCode);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      alert(`Erro ao gerar QR Code: ${error.message}`);
    }
  };
  
  // Função para criar o cartão
  const createCard = async () => {
    try {
      // Primeiro, fazer upload das imagens se houverem
      let imageUrls = [];
      if (images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          const response = await fetch(img.url);
          const blob = await response.blob();
          formData.append('file', blob, img.name);
  
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
  
          if (!uploadResponse.ok) {
            throw new Error('Erro ao fazer upload da imagem');
          }
  
          const data = await uploadResponse.json();
          imageUrls.push(data.url);
        }
      }
  
      // Upload da música se existir
      let musicUrl = '';
      if (formData.musicUrl) {
        const musicResponse = await fetch(formData.musicUrl);
        const musicBlob = await musicResponse.blob();
        const musicFormData = new FormData();
        musicFormData.append('file', musicBlob, 'music.mp3');
  
        const uploadMusicResponse = await fetch('/api/upload', {
          method: 'POST',
          body: musicFormData
        });
  
        if (!uploadMusicResponse.ok) {
          throw new Error('Erro ao fazer upload da música');
        }
  
        const musicData = await uploadMusicResponse.json();
        musicUrl = musicData.url;
      }
  
      // Criar o cartão com as URLs dos arquivos já upados
      const cardResponse = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // Certifique-se que este userId existe no banco
          nome: formData.nome,
          mensagem: formData.mensagem,
          data: formData.data,
          corTexto: formData.corTexto,
          fonte: formData.fonte,
          musicUrl: musicUrl,
          images: imageUrls,
        }),
      });
  
      if (!cardResponse.ok) {
        const errorData = await cardResponse.json();
        throw new Error(errorData.error || 'Erro ao criar cartão');
      }
  
      // Se chegou aqui, deu tudo certo
      setShowSuccessMessage(true);

      // Limpar o formulário
      setFormData({
        nome: '',
        mensagem: '',
        data: '',
        corTexto: '#ff0000',
        fonte: 'sans',
        musicUrl: '',
      });
      setImages([]);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert(`Erro ao criar cartão: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    verifyAuth();
    verifyAuth();
    if (!isAuthenticated) {
      setIsModalVisible(true);
      console.log(isAuthenticated)
      return;
    }
    await setShowPaymentModal(true);
    handleGenerateQrCode();
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert('Máximo de 6 imagens permitido');
      return;
    }

    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };
 
  useEffect(() => {
    //verifyAuth();
    const createHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'absolute animate-float text-red-500';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${Math.random() * 3 + 3}s`;
      
      const heartIcon = document.createElement('div');
      heartIcon.innerHTML = '❤️';
      heartIcon.className = 'w-6 h-6';
      
      heart.appendChild(heartIcon);
      document.getElementById('hearts-container').appendChild(heart);

      setTimeout(() => heart.remove(), 6000);
    };

    const interval = setInterval(createHeart, 300);
    return () => clearInterval(interval);
  }, []);

  // Componente Carrossel separado e corrigido
  const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoPlayInterval, setAutoPlayInterval] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalTime = 7000;
    
    const nextSlide = () => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 7000);
      }
    };
  
    const prevSlide = () => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setTimeout(() => setIsTransitioning(false), 7000); // Reduzido para 500ms
      }
    };
  
    const startAutoPlay = () => {
      stopAutoPlay();
      const interval = setInterval(nextSlide, intervalTime);
      setAutoPlayInterval(interval);
    };
  
    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  
    useEffect(() => {
      startAutoPlay();
      if (images.length > 1) {
        startAutoPlay();
      }
      return () => stopAutoPlay();
    }, [images.length]);
  
    if (images.length === 0) return null;
  
    return (
      <div className="w-full max-w-md mb-6 relative overflow-hidden">
        <div 
          className="relative w-full"
          style={{
            height: "288px",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute w-full h-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`, // Alterado para 100%
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none',
              }}
            >
              <img
                src={image.url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ))}
        </div>
  
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
                startAutoPlay();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              disabled={isTransitioning}
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
                startAutoPlay();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              disabled={isTransitioning}
            >
              →
            </button>
  
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      startAutoPlay();
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />
      {showSuccessMessage && (
      <SuccessMessage 
        onClose={() => setShowSuccessMessage(false)} 
      />
    )}
      {/* Hearts container */}
      <div id="hearts-container" className="fixed inset-0 pointer-events-none z-10" />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-6 animate-fadeIn">
            Eternize Seu Amor
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Crie uma página especial para celebrar sua história de amor. 
            Compartilhe seus momentos mais doces com quem você ama.
          </p>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Side */}
          <div className="rounded-lg border border-red-500/20 bg-gradient-to-r from-red-600/10 to-pink-600/10 backdrop-blur-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-red-500/20 text-white focus:outline-none focus:border-red-500"
                  placeholder="Digite seu nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Sua Mensagem de Amor
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-red-500/20 text-white focus:outline-none focus:border-red-500"
                  placeholder="Escreva sua mensagem..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Data Especial
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-red-500/20 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Cor do Texto
                </label>
                <input
                  type="color"
                  name="corTexto"
                  value={formData.corTexto}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg bg-black/30 border border-red-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Suas Fotos Especiais (máximo 6)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-red-500/20 text-white focus:outline-none focus:border-red-500"
                />
                
                {/* Preview das miniaturas */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>


              <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Música de Fundo
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="w-full px-4 py-2 rounded-lg bg-black/30 border border-red-500/20 text-white focus:outline-none focus:border-red-500"
              />
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Estilo da Fonte
                </label>
                <select
                  name="fonte"
                  value={formData.fonte}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-red-500/20 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="sans">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="cursive">Cursive</option>
                </select>
              </div>



              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-colors"
              >
                Criar Cartão de Amor ❤️
              </button>
            </form>
            {isModalVisible && (
            <LoginModal isVisible={isModalVisible} closeModal={closeModal} />
          )}
          {showPaymentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Por favor, complete o pagamento</h3>
              <PaymentForm onSuccess={handleGenerateQrCode} />
              <button onClick={() => setShowPaymentModal(false)}>Fechar</button>
            </div>
          </div>
        )}
          </div>

          {/* Preview Side */}
          <div className="rounded-lg border border-red-500/20 bg-gradient-to-r from-red-600/10 to-pink-600/10 backdrop-blur-sm p-8">
            <div className="h-full flex flex-col items-center justify-center">
              {/* Carrossel de Imagens */}
              <Carousel images={images} />
              
              <div className="w-full max-w-md bg-gradient-to-r from-red-500/5 to-pink-500/5 p-8 rounded-lg border border-red-500/10 backdrop-blur-md">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: formData.corTexto, fontFamily: formData.fonte }}>
                    {formData.nome || 'Seu Nome'}
                  </h2>
                  <p className="text-lg text-gray-300 mb-6 italic break-words" 
                    style={{ 
                      fontFamily: formData.fonte,
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}>
                    {formData.mensagem || 'Sua mensagem de amor aparecerá aqui...'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">❤️</span>
                    <span className="text-sm text-gray-400">
                      {formData.data || 'DD/MM/AAAA'}
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
              {formData.musicUrl && (
                <audio
                  ref={audioRef}
                  src={formData.musicUrl}
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
        </div>
        {/* Footer */}
        <footer className="text-center mt-16">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <span className="text-2xl">❤️</span>
            <span className="text-lg">Feito com amor</span>
            <span className="text-2xl">❤️</span>
          </div>
        </footer>
      </div>
    </main>
  );
}