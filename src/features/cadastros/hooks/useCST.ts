import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios-instance';
import type { CSTListResponse, CSTFilters } from '../types';

const API_BASE = '/cadastros';

/**
 * Hook para listar CSTs
 */
export const useCSTList = (filters?: CSTFilters) => {
  return useQuery({
    queryKey: ['cst-list', filters],
    queryFn: async (): Promise<CSTListResponse> => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.ativo !== undefined) params.append('ativo', String(filters.ativo));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const { data } = await apiClient.get<CSTListResponse>(
        `${API_BASE}/cst?${params.toString()}`
      );
      return data;
    },
  });
};

/**
 * Hook para importar CSTs da API do governo
 */
export const useImportCSTFromGoverno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(`${API_BASE}/cst/importar/governo`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cst-list'] });
    },
  });
};
