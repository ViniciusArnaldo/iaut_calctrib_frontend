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
      return 0; // SEMPRE buscar dados frescos após mutações
    },

    // Continua polling mesmo quando a aba está em background
    refetchIntervalInBackground: true,

    // Sempre refetch ao focar a janela (útil quando volta da aba)
    refetchOnWindowFocus: true,

    // Sempre refetch ao montar
    refetchOnMount: true,
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
      // Refetch ao invés de invalidate para atualização IMEDIATA
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
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

    // Optimistic Update: Atualiza UI IMEDIATAMENTE antes da resposta do servidor
    onMutate: async (variables) => {
      // Cancelar queries em andamento para evitar sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });

      // Snapshot do valor anterior (para rollback em caso de erro)
      const previousData = queryClient.getQueryData(BASE_SIMULACAO_KEYS.detail(variables.baseId));

      // Atualizar cache otimisticamente
      queryClient.setQueryData(BASE_SIMULACAO_KEYS.detail(variables.baseId), (old: any) => {
        if (!old) return old;

        return {
          ...old,
          linhas: old.linhas.map((linha: any) =>
            linha.id === variables.linhaId
              ? {
                  ...linha,
                  ...variables.dadosEntrada,
                  status: 'PENDENTE', // Resetar status ao editar
                }
              : linha
          ),
        };
      });

      // Retornar snapshot para usar no onError
      return { previousData };
    },

    // Se der erro, fazer rollback
    onError: (_err, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(BASE_SIMULACAO_KEYS.detail(variables.baseId), context.previousData);
      }
    },

    // Após sucesso, refetch para garantir sincronização com servidor
    onSettled: (_, __, variables) => {
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
    },
  });
};

export const useDeletarLinha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseId, linhaId }: { baseId: number; linhaId: number }) =>
      baseSimulacaoApi.deletarLinha(baseId, linhaId),
    onSuccess: (_, variables) => {
      // Refetch ao invés de invalidate para atualização IMEDIATA
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useProcessarBase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseId }: { baseId: number }) =>
      baseSimulacaoApi.processarBase(baseId),
    onSuccess: (_, variables) => {
      // Refetch ao invés de invalidate para atualização IMEDIATA
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(variables.baseId) });
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.lists() });
    },
  });
};

export const useValidarNCMs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (baseId: number) => baseSimulacaoApi.validarNCMs(baseId),
    onSuccess: (_, baseId) => {
      // Refetch ao invés de invalidate para atualização IMEDIATA
      queryClient.refetchQueries({ queryKey: BASE_SIMULACAO_KEYS.detail(baseId) });
    },
  });
};
