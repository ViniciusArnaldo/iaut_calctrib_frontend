import apiClient from './axios-instance';
import type {
  Subscription,
  Plan,
  SubscriptionHistory,
  UsageStats,
  UpgradeRequest,
} from '../features/subscriptions/types/subscriptions.types';

export const subscriptionsApi = {
  /**
   * Obter assinatura atual
   */
  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get<Subscription>('/subscriptions');
    return response.data;
  },

  /**
   * Obter histórico de assinaturas
   */
  async getHistory(): Promise<SubscriptionHistory[]> {
    const response = await apiClient.get<SubscriptionHistory[]>('/subscriptions/history');
    return response.data;
  },

  /**
   * Obter planos disponíveis
   */
  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<Plan[]>('/subscriptions/plans');
    return response.data;
  },

  /**
   * Obter estatísticas de uso
   */
  async getUsage(): Promise<UsageStats> {
    const response = await apiClient.get<UsageStats>('/subscriptions/usage');
    return response.data;
  },

  /**
   * Fazer upgrade/downgrade de plano
   */
  async upgrade(data: UpgradeRequest): Promise<Subscription> {
    const response = await apiClient.patch<Subscription>('/subscriptions/upgrade', data);
    return response.data;
  },

  /**
   * Cancelar assinatura
   */
  async cancel(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/subscriptions/cancel');
    return response.data;
  },
};
