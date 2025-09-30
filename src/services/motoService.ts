import api from './api';

export interface Moto {
  idMoto: string;
  placa: string;
  status: 'LIVRE' | 'PROBLEMA' | 'MANUTENCAO';
  setor: 'A' | 'B' | 'C' | 'D';
  modelo: string; 
}

export const getMotos = async (): Promise<Moto[]> => {
  try {
    const response = await api.get('/moto/all'); 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar motos:', error);
    throw error;
  }
};

/**
 * Atualiza os dados de uma moto específica.
 * @param motoId O ID da moto a ser atualizada.
 * @param motoData O corpo completo da requisição para o PUT.
 */
export const updateMoto = async (motoId: string, motoData: Partial<Moto>): Promise<Moto> => {
  try {
    const response = await api.put(`/moto/${motoId}`, motoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a moto ${motoId}:`, error);
    throw error;
  }
};