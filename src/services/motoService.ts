import api from './api';

// ==== 1. INTERFACE 'Moto' ATUALIZADA ====
// Atualizei esta interface para bater com o 'MotoResponse' do seu backend.
// Adicionei chassi, idPatio, e idOperador.
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

// ==== 2. NOVA INTERFACE 'MotoFormData' ====
// Este é o 'molde' para criar ou atualizar uma moto (baseado no seu MotoRequest)
export interface MotoFormData {
  placa: string;
  modelo: string;
  chassi: string;
  status: 'LIVRE' | 'PROBLEMA' | 'MANUTENCAO';
  setor: 'A' | 'B' | 'C' | 'D';
  idPatio: string; // Uma moto deve pertencer a um pátio
  idOperador: string | null; // Podemos mandar 'null'
}

/**
 * Busca TODAS as motos de TODOS os pátios (GET /moto/all)
 */
export const getMotos = async (): Promise<Moto[]> => {
  try {
    const response = await api.get('/moto/all'); 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar motos:', error);
    throw error;
  }
};

// ==== 3. NOVA FUNÇÃO 'getMotosByPatio' ====
/**
 * Busca apenas as motos de um PÁTIO específico.
 * (GET /patio/{idPatio}/motos)
 */
export const getMotosByPatio = async (idPatio: string): Promise<Moto[]> => {
  try {
    const response = await api.get(`/patio/${idPatio}/motos`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar motos para o pátio ${idPatio}:`, error);
    throw error;
  }
};


// ==== 4. NOVA FUNÇÃO 'createMoto' ====
/**
 * Cria uma nova moto.
 * (POST /moto)
 */
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


// ==== 5. FUNÇÃO 'updateMoto' ATUALIZADA ====
/**
 * Atualiza os dados de uma moto específica.
 * O backend espera o corpo completo (MotoRequest), por isso usamos MotoFormData.
 * (PUT /moto/{id})
 */
export const updateMoto = async (motoId: string, motoData: MotoFormData): Promise<Moto> => {
  try {
    const response = await api.put(`/moto/${motoId}`, { ...motoData, idOperador: null });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a moto ${motoId}:`, error);
    throw error;
  }
};

// ==== 6. NOVA FUNÇÃO 'deleteMoto' ====
/**
 * Deleta uma moto específica.
 * (DELETE /moto/{id})
 */
export const deleteMoto = async (motoId: string): Promise<void> => {
  try {
    await api.delete(`/moto/${motoId}`);
  } catch (error) {
    console.error(`Erro ao deletar a moto ${motoId}:`, error);
    throw error;
  }
};