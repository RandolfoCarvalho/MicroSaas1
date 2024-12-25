import { useState } from 'react';

const useAuthVerification = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Verifica autenticação
  const [isModalVisible, setIsModalVisible] = useState(false);   // Controla o modal de login/cadastro

  const verifyAuth = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setIsModalVisible(true); // Se não autenticado, exibe o modal
      setIsAuthenticated(false); // Atualiza o estado de autenticação
      return false; // Usuário não autenticado
    }
    setIsAuthenticated(true); // Se autenticado, define como verdadeiro
    return true; // Usuário autenticado
  };

  const closeModal = () => {
    setIsModalVisible(false); // Fecha o modal
  };

  return {
    isAuthenticated,
    isModalVisible,
    verifyAuth,
    closeModal,
    setIsModalVisible,
  };
};

export default useAuthVerification;
