import apiClient from '../../../api/axios-instance';
import type {
  NCM,
  NBS,
  NCMListResponse,
  NBSListResponse,
  ImportResult,
  NCMFilters,
  NBSFilters,
  CreateNCMDto,
  UpdateNCMDto,
  CreateNBSDto,
  UpdateNBSDto,
} from '../types';

const API_BASE = '/cadastros';

// ============================================
// NCM API
// ============================================

export const ncmApi = {
  list: async (filters?: NCMFilters): Promise<NCMListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.origem) params.append('origem', filters.origem);
    if (filters?.ativo !== undefined) params.append('ativo', String(filters.ativo));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const { data } = await apiClient.get<NCMListResponse>(
      `${API_BASE}/ncm?${params.toString()}`
    );
    return data;
  },

  getById: async (id: number): Promise<NCM> => {
    const { data } = await apiClient.get<NCM>(`${API_BASE}/ncm/${id}`);
    return data;
  },

  create: async (dto: CreateNCMDto): Promise<NCM> => {
    const { data } = await apiClient.post<NCM>(`${API_BASE}/ncm`, dto);
    return data;
  },

  update: async (id: number, dto: UpdateNCMDto): Promise<NCM> => {
    const { data } = await apiClient.put<NCM>(`${API_BASE}/ncm/${id}`, dto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/ncm/${id}`);
  },

  importFromGoverno: async (): Promise<ImportResult> => {
    const { data } = await apiClient.post<ImportResult>(
      `${API_BASE}/ncm/importar/governo`
    );
    return data;
  },

  importFromLocal: async (): Promise<ImportResult> => {
    const { data } = await apiClient.post<ImportResult>(
      `${API_BASE}/ncm/importar/local`
    );
    return data;
  },
};

// ============================================
// NBS API
// ============================================

export const nbsApi = {
  list: async (filters?: NBSFilters): Promise<NBSListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.origem) params.append('origem', filters.origem);
    if (filters?.ativo !== undefined) params.append('ativo', String(filters.ativo));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const { data } = await apiClient.get<NBSListResponse>(
      `${API_BASE}/nbs?${params.toString()}`
    );
    return data;
  },

  getById: async (id: number): Promise<NBS> => {
    const { data } = await apiClient.get<NBS>(`${API_BASE}/nbs/${id}`);
    return data;
  },

  create: async (dto: CreateNBSDto): Promise<NBS> => {
    const { data } = await apiClient.post<NBS>(`${API_BASE}/nbs`, dto);
    return data;
  },

  update: async (id: number, dto: UpdateNBSDto): Promise<NBS> => {
    const { data } = await apiClient.put<NBS>(`${API_BASE}/nbs/${id}`, dto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/nbs/${id}`);
  },

  importFromGoverno: async (): Promise<ImportResult> => {
    const { data } = await apiClient.post<ImportResult>(
      `${API_BASE}/nbs/importar/governo`
    );
    return data;
  },
};
