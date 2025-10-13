import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios-instance';
import type { ClassificacaoTributariaListResponse, ClassificacaoTributariaFilters } from '../types';

const API_BASE = '/cadastros';

/**
 * Hook para listar Classificações Tributárias
 */
export const useClassificacaoTributariaList = (filters?: ClassificacaoTributariaFilters) => {
  return useQuery({
    queryKey: ['classificacao-tributaria-list', filters],
    queryFn: async (): Promise<ClassificacaoTributariaListResponse> => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.cst) params.append('cst', filters.cst);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const { data } = await apiClient.get<ClassificacaoTributariaListResponse>(
        `${API_BASE}/classificacoes-tributarias?${params.toString()}`
      );
      return data;
    },
  });
};

/**
 * Hook para importar TODAS as classificações tributárias de TODOS os CSTs da API do governo
 */
export const useImportClassificacaoFromGoverno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(`${API_BASE}/classificacoes-tributarias/importar/governo`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classificacao-tributaria-list'] });
    },
  });
};
