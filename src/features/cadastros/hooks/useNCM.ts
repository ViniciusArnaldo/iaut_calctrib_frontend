import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ncmApi } from '../api/cadastrosApi';
import type { NCMFilters, CreateNCMDto, UpdateNCMDto } from '../types';

const NCM_QUERY_KEY = 'ncm';

export const useNCMList = (filters?: NCMFilters) => {
  return useQuery({
    queryKey: [NCM_QUERY_KEY, 'list', filters],
    queryFn: () => ncmApi.list(filters),
  });
};

export const useNCMById = (id: number) => {
  return useQuery({
    queryKey: [NCM_QUERY_KEY, 'detail', id],
    queryFn: () => ncmApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateNCM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNCMDto) => ncmApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NCM_QUERY_KEY] });
    },
  });
};

export const useUpdateNCM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateNCMDto }) =>
      ncmApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NCM_QUERY_KEY] });
    },
  });
};

export const useDeleteNCM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ncmApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NCM_QUERY_KEY] });
    },
  });
};

export const useImportNCMFromGoverno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ncmApi.importFromGoverno(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NCM_QUERY_KEY] });
    },
  });
};

export const useImportNCMFromLocal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ncmApi.importFromLocal(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NCM_QUERY_KEY] });
    },
  });
};
