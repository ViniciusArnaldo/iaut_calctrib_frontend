import { apiClient } from '../../../api/axios-instance';
import type {
  ExecutarAnaliseDTO,
  DadosVisualizacao,
  ConfiguracaoAnalise,
} from '../types/analises.types';

const BASE_PATH = '/analises';

/**
 * API Client para Análises
 */
export const analisesApi = {
  /**
   * Executa uma análise e retorna os dados processados
   */
  executar: async (dados: ExecutarAnaliseDTO): Promise<DadosVisualizacao> => {
    const response = await apiClient.post<DadosVisualizacao>(`${BASE_PATH}/executar`, dados);
    return response.data;
  },

  /**
   * Executa análise e exporta no formato especificado
   */
  exportar: async (
    configuracao: ConfiguracaoAnalise,
    formato: 'xlsx' | 'csv' | 'pdf'
  ): Promise<Blob> => {
    const response = await apiClient.post(`${BASE_PATH}/exportar`, {
      configuracao,
      formato,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};
