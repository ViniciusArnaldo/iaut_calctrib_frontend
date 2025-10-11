import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import type { UpgradeRequest } from '../types/subscriptions.types';

/**
 * Hook para obter assinatura atual
 */
export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionsApi.getSubscription(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obter histórico de assinaturas
 */
export const useSubscriptionHistory = () => {
  return useQuery({
    queryKey: ['subscription-history'],
    queryFn: () => subscriptionsApi.getHistory(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obter planos disponíveis
 */
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionsApi.getPlans(),
    staleTime: 30 * 60 * 1000, // 30 minutos - dados não mudam muito
  });
};

/**
 * Hook para obter estatísticas de uso
 */
export const useUsage = () => {
  return useQuery({
    queryKey: ['usage'],
    queryFn: () => subscriptionsApi.getUsage(),
    staleTime: 30 * 1000, // 30 segundos
  });
};

/**
 * Hook para fazer upgrade/downgrade
 */
export const useUpgrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpgradeRequest) => subscriptionsApi.upgrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-history'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
    },
  });
};

/**
 * Hook para cancelar assinatura
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionsApi.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-history'] });
    },
  });
};
