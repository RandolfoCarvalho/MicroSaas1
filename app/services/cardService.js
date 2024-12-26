// services/cardService.js
export const getCardById = async (id) => {
    try {
      const response = await fetch(`../api/cardsPreview/${id}`);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar o cartão');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar o cartão:', error);
      throw error;
    }
  };
  