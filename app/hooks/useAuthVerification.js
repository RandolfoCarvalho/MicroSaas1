import { useState } from 'react';

const useAuthVerification = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const verifyAuth = () => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      setIsAuthenticated(false);
      setIsModalVisible(true); // Sempre atualiza o estado do modal quando não autenticado
      return false;
    }
    setIsAuthenticated(true);
    return true;
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  return {
    isAuthenticated,
    isModalVisible,
    verifyAuth,
    closeModal,
    setIsModalVisible,
    setIsAuthenticated,
  };
};

export default useAuthVerification;