import api from './api';

export interface Patio {
  idPatio: string; 
  nome: string;
  descricao: string;
  flagAberto: string; 
  timestampCreated: string; 
  timestampUpdated: string; 
  idFilial: string;
}

export interface PatioFormData {
  nome: string;
  descricao: string;
  idFilial: string;
}

/**
 * Busca todos os pátios
 * GET /patio/all
 */
export const getPatios = async (): Promise<Patio[]> => {
  const { data } = await api.get('/patio/all');
  return data;
};

/**
 * Cria um novo pátio
 * POST /patio
 */
export const createPatio = async (patioData: PatioFormData): Promise<Patio> => {
  const { data } = await api.post('/patio', patioData);
  return data;
};

/**
 * Atualiza um pátio existente
 * PUT /patio/{id}
 */
export const updatePatio = async (id: string, patioData: PatioFormData): Promise<Patio> => {
  const { data } = await api.put(`/patio/${id}`, patioData);
  return data;
};

/**
 * Deleta um pátio
 * DELETE /patio/{id}
 */
export const deletePatio = async (id: string): Promise<void> => {
  await api.delete(`/patio/${id}`);
};