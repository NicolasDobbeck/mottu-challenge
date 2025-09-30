import api from './api';

// As interfaces e tipos de dados que definem uma Filial
export interface Filial {
  idFilial: string;
  nome: string;
  cnpj: string;
  cdPais: string;
  dataAbertura: string;
}

export interface FilialFormData {
  nome: string;
  cnpj: string;
  cdPais: string;
}

// READ: Busca a lista de filiais
export const getFiliais = async (): Promise<Filial[]> => {
  try {
    const response = await api.get('/filial/all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar filiais:', error);
    throw error;
  }
};

// CREATE: Cria uma nova filial
export const createFilial = async (data: FilialFormData) => {
  try {
    // Adiciona a data atual ao payload antes de enviar
    const payload = {
      ...data,
      dataAbertura: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    };

    // O backend espera um objeto que contém uma lista
    const requestBody = {
      filialRequests: [payload],
    };

    const response = await api.post('/filial', requestBody);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar filial:', error);
    throw error;
  }
};

// UPDATE: Atualiza uma filial existente
export const updateFilial = async (id: string, data: FilialFormData & { dataAbertura: string }) => {
  try {
    const response = await api.put(`/filial/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar filial ${id}:`, error);
    throw error;
  }
};

// DELETE: Exclui uma filial
export const deleteFilial = async (id: string) => {
  try {
    const response = await api.delete(`/filial/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir filial ${id}:`, error);
    throw error;
  }
};