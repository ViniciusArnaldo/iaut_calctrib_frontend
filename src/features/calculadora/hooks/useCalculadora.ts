import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calculadoraApi } from '../../../api/calculadora.api';
import type {
  CalcularRegimeGeralDTO,
  CalcularPedagioDTO,
  CalcularBaseCalculoISDTO,
  CalcularBaseCalculoCBSIBSDTO
} from '../types/calculadora.types';

/**
 * Hook para calcular regime geral
 */
export const useCalcularRegimeGeral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalcularRegimeGeralDTO) => calculadoraApi.calcularRegimeGeral(data),
    onSuccess: () => {
      // Invalida cache de histórico e estatísticas após novo cálculo
      queryClient.invalidateQueries({ queryKey: ['historico'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
  });
};

/**
 * Hook para calcular pedágio
 */
export const useCalcularPedagio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalcularPedagioDTO) => calculadoraApi.calcularPedagio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
  });
};

/**
 * Hook para calcular base de cálculo do Imposto Seletivo
 */
export const useCalcularBaseCalculoIS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalcularBaseCalculoISDTO) => calculadoraApi.calcularBaseCalculoIS(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
  });
};

/**
 * Hook para calcular base de cálculo CBS/IBS
 */
export const useCalcularBaseCalculoCBSIBS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalcularBaseCalculoCBSIBSDTO) => calculadoraApi.calcularBaseCalculoCBSIBS(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
  });
};

/**
 * Hook para buscar estatísticas
 */
export const useEstatisticas = () => {
  return useQuery({
    queryKey: ['estatisticas'],
    queryFn: () => calculadoraApi.obterEstatisticas(),
    staleTime: 30 * 1000, // 30 segundos
  });
};

/**
 * Hook para buscar histórico
 */
export const useHistorico = (params?: {
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['historico', params],
    queryFn: () => calculadoraApi.buscarHistorico(params),
    staleTime: 10 * 1000, // 10 segundos
  });
};

/**
 * Hook para buscar cálculo por ID
 */
export const useCalculoPorId = (id: number | undefined) => {
  return useQuery({
    queryKey: ['calculo', id],
    queryFn: () => calculadoraApi.buscarCalculoPorId(id!),
    enabled: !!id,
  });
};

/**
 * Hook para validar XML
 */
export const useValidarXml = () => {
  return useMutation({
    mutationFn: ({ tipo, subtipo, xmlContent }: { tipo: string; subtipo: string; xmlContent: string }) =>
      calculadoraApi.validarXml(tipo, subtipo, xmlContent),
  });
};

/**
 * Hook para gerar XML
 */
export const useGerarXml = () => {
  return useMutation({
    mutationFn: (roc: any) => calculadoraApi.gerarXml(roc),
  });
};
