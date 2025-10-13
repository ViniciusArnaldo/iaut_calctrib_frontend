import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nbsApi } from '../api/cadastrosApi';
import type { NBSFilters, CreateNBSDto, UpdateNBSDto } from '../types';

const NBS_QUERY_KEY = 'nbs';

export const useNBSList = (filters?: NBSFilters) => {
  return useQuery({
    queryKey: [NBS_QUERY_KEY, 'list', filters],
    queryFn: () => nbsApi.list(filters),
  });
};

export const useNBSById = (id: number) => {
  return useQuery({
    queryKey: [NBS_QUERY_KEY, 'detail', id],
    queryFn: () => nbsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateNBS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNBSDto) => nbsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NBS_QUERY_KEY] });
    },
  });
};

export const useUpdateNBS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateNBSDto }) =>
      nbsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NBS_QUERY_KEY] });
    },
  });
};

export const useDeleteNBS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => nbsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NBS_QUERY_KEY] });
    },
  });
};

export const useImportNBSFromGoverno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => nbsApi.importFromGoverno(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NBS_QUERY_KEY] });
    },
  });
};
