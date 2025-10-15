import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as baseSimulacaoApi from '../../../api/base-simulacao.api';
import type { CriarBaseDto, AdicionarLinhasDto } from '../../../api/base-simulacao.api';

// Keys para cache
export const BASE_SIMULACAO_KEYS = {
  all: ['base-simulacao'] as const,
  lists: () => [...BASE_SIMULACAO_KEYS.all, 'list'] as const,
  list: (params?: any) => [...BASE_SIMULACAO_KEYS.lists(), params] as const,
  details: () => [...BASE_SIMULACAO_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BASE_SIMULACAO_KEYS.details(), id] as const,
};

// ==================== HOOKS DE LISTAGEM ====================

export const useBases = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: BASE_SIMULACAO_KEYS.list(params),
    queryFn: () => baseSimulacaoApi.listarBases(params),
    staleTime: 30000, // 30 segundos
  });
};

export const useBase = (id: number) => {
  const query = useQuery({
    queryKey: BASE_SIMULACAO_KEYS.detail(id),
    queryFn: () => baseSimulacaoApi.buscarBasePorId(id),
    enabled: !!id,

    // Polling: atualiza a cada 2 segundos quando está processando
    refetchInterval: (query) => {
      // Acessa os dados através de query.state.data
      const baseData = query.state.data;
      if (baseData?.status === 'PROCESSANDO') {
        return 2000; // 2 segundos
      }
      return false; // Não fazer polling
    },

    // Configurações de cache para garantir dados atualizados
    staleTime: (query) => {
      // Se está processando, dados ficam "velhos" imediatamente
      const baseData = query.state.data;
      if (baseData?.status === 'PROCESSANDO') {
        return 0; // Dados sempre frescos
      }
      return 30000; // 30 segundos para bases não processando
    },

    // Continua polling mesmo quando a aba está em background
    refetchIntervalInBackground: true,

    // Sempre refetch ao focar a janela (útil quando volta da aba)
    refetchOnWindowFocus: true,

    // Sempre refetch ao montar se estiver processando
    refetchOnMount: (query) => {
      const baseData = query.state.data;
      return baseData?.status === 'PROCESSANDO' ? 'always' : true;
    },
  });

  return query;
};

// ==================== HOOKS DE MUTAÇÃO ====================

export const useCriarBase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CriarBaseDto) => baseSimulacaoApi.criarBase(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useDeletarBase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => baseSimulacaoApi.deletarBase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useAdicionarLinhas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseId, dto }: { baseId: number; dto: AdicionarLinhasDto }) =>
      baseSimulacaoApi.adicionarLinhas(baseId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useAtualizarLinha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      baseId,
      linhaId,
      dadosEntrada,
    }: {
      baseId: number;
      linhaId: number;
      dadosEntrada: Record<string, any>;
    }) => baseSimulacaoApi.atualizarLinha(baseId, linhaId, dadosEntrada),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
    },
  });
};

export const useDeletarLinha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseId, linhaId }: { baseId: number; linhaId: number }) =>
      baseSimulacaoApi.deletarLinha(baseId, linhaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useProcessarBase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseId, apenasErros }: { baseId: number; apenasErros?: boolean }) =>
      baseSimulacaoApi.processarBase(baseId, apenasErros),
    onSuccess: (_, variables) => {
      // Invalidar para atualizar status em tempo real
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useValidarNCMs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (baseId: number) => baseSimulacaoApi.validarNCMs(baseId),
    onSuccess: (_, baseId) => {
      // Invalidar para atualizar linhas com NCMs validados
      queryClient.invalidateQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(baseId) });
    },
  });
};
