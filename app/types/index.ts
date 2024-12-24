type User = {
    id: number;
    // outros campos do usuário...
  };
  
  type Card = {
    id: number;
    userId: number;
    nome: string;
    mensagem: string;
    data: string;
    corTexto: string;
    fonte: string;
    musicUrl: string;
    images: string[]; // URLs das imagens
    createdAt: Date;
  };