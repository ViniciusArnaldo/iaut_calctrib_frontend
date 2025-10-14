export type SubscriptionPlan = 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: number;
  tenantId: number;
  plano: SubscriptionPlan;
  status: SubscriptionStatus;
  dataInicio: string;
  dataFim: string | null;
  limiteCalculos: number;
  calculosRealizados: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  nome: string;
  plano: SubscriptionPlan;
  limiteCalculos: number;
  preco: number;
  features?: string[];
  popular?: boolean;
}

export interface SubscriptionHistory {
  id: number;
  plano: SubscriptionPlan;
  status: SubscriptionStatus;
  dataInicio: string;
  dataFim: string | null;
}

export interface UsageStats {
  plano: SubscriptionPlan;
  limiteCalculos: number;
  calculosRealizados: number;
  calculosRestantes: number;
  percentualUso: number;
  resetEm: string;
}

export interface UpgradeRequest {
  novoPlano: SubscriptionPlan;
}
