import apiClient from './axios-instance';

export interface BaseSimulacao {
  id: number;
  tenantId: number;
  userId: number;
  nome: string;
  descricao?: string;
  status: 'RASCUNHO' | 'PROCESSANDO' | 'PROCESSADA' | 'ERRO' | 'CANCELADA';
  totalLinhas: number;
  linhasProcessadas: number;
  linhasComSucesso: number;
  linhasComErro: number;
  dataInicioProcessamento?: string;
  dataFimProcessamento?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  linhas?: any[];
}

export interface CriarBaseDto {
  nome: string;
  descricao?: string;
}

export interface AdicionarLinhasDto {
  linhas: {
    tipoCalculadora: string;
    dadosEntrada: Record<string, any>;
  }[];
}

// ==================== BASES ====================

export const criarBase = async (dto: CriarBaseDto): Promise<BaseSimulacao> => {
  const response = await apiClient.post('/base-simulacao', dto);
  return response.data;
};

export const listarBases = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ itens: BaseSimulacao[]; meta: any }> => {
  const response = await apiClient.get('/base-simulacao', { params });
  return response.data;
};

export const buscarBasePorId = async (id: number): Promise<BaseSimulacao> => {
  const response = await apiClient.get(`/base-simulacao/${id}`);
  return response.data;
};

export const deletarBase = async (id: number): Promise<void> => {
  await apiClient.delete(`/base-simulacao/${id}`);
};

// ==================== LINHAS ====================

export const adicionarLinhas = async (
  baseId: number,
  dto: AdicionarLinhasDto
): Promise<any> => {
  const response = await apiClient.post(`/base-simulacao/${baseId}/linhas`, dto);
  return response.data;
};

export const atualizarLinha = async (
  baseId: number,
  linhaId: number,
  dadosEntrada: Record<string, any>
): Promise<any> => {
  const response = await apiClient.put(`/base-simulacao/${baseId}/linhas/${linhaId}`, {
    dadosEntrada,
  });
  return response.data;
};

export const deletarLinha = async (baseId: number, linhaId: number): Promise<void> => {
  await apiClient.delete(`/base-simulacao/${baseId}/linhas/${linhaId}`);
};

// ==================== PROCESSAMENTO ====================

export const processarBase = async (
  baseId: number
): Promise<any> => {
  const response = await apiClient.post(`/base-simulacao/${baseId}/processar`, {});
  return response.data;
};

// ==================== VALIDAÇÃO ====================

export const validarNCMs = async (baseId: number): Promise<{
  message: string;
  totalValidados: number;
  totalEncontrados: number;
  totalNaoEncontrados: number;
}> => {
  const response = await apiClient.post(`/base-simulacao/${baseId}/validar-ncms`);
  return response.data;
};
