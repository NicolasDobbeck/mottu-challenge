import api from './api';

export interface Moto {
  idMoto: string;
  placa: string;
  status: 'LIVRE' | 'PROBLEMA' | 'MANUTENCAO';
  setor: 'A' | 'B' | 'C' | 'D';
  modelo: string; // Ex: 'MOTTUPOP', 'MOTTUE'
  chassi: string;
  idPatio: string | null;
  idOperador: string | null;
}


export interface MotoFormData {
  placa: string;
  modelo: string;
  chassi: string;
  status: 'LIVRE' | 'PROBLEMA' | 'MANUTENCAO';
  setor: 'A' | 'B' | 'C' | 'D';
  idPatio: string;
  idOperador: string | null; 
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

export const getMotosByPatio = async (idPatio: string): Promise<Moto[]> => {
  try {
    const response = await api.get(`/patio/${idPatio}/motos`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar motos para o pátio ${idPatio}:`, error);
    throw error;
  }
};

export const createMoto = async (motoData: MotoFormData): Promise<Moto> => {
  try {
    // Como combinado, idOperador será null
    const response = await api.post('/moto', { ...motoData, idOperador: null });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar moto:', error);
    throw error;
  }
};

export const updateMoto = async (motoId: string, motoData: MotoFormData): Promise<Moto> => {
  try {
    const response = await api.put(`/moto/${motoId}`, { ...motoData, idOperador: null });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a moto ${motoId}:`, error);
    throw error;
  }
};

export const deleteMoto = async (motoId: string): Promise<void> => {
  try {
    await api.delete(`/moto/${motoId}`);
  } catch (error) {
    console.error(`Erro ao deletar a moto ${motoId}:`, error);
    throw error;
  }
};