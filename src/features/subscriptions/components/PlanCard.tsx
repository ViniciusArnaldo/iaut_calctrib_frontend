import React from 'react';
import type { Plan, SubscriptionPlan } from '../types/subscriptions.types';
import { Button } from '../../../components/ui/Button';

interface Props {
  plan: Plan;
  currentPlan?: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export const PlanCard: React.FC<Props> = ({ plan, currentPlan, onSelect, isLoading }) => {
  // Define a ordem hierárquica dos planos
  const planOrder: Record<SubscriptionPlan, number> = {
    TRIAL: 0,
    BASIC: 1,
    PROFESSIONAL: 2,
    ENTERPRISE: 3,
  };

  const isCurrent = currentPlan === plan.plano;
  const isUpgrade = currentPlan && planOrder[plan.plano] > planOrder[currentPlan];
  const isDowngrade = currentPlan && planOrder[plan.plano] < planOrder[currentPlan];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getButtonText = () => {
    if (isCurrent) return 'Plano Atual';
    if (isUpgrade) return 'Fazer Upgrade';
    if (isDowngrade) return 'Fazer Downgrade';
    return 'Selecionar Plano';
  };

  return (
    <div
      className={`relative rounded-lg border-2 p-4 bg-white dark:bg-gray-800 ${
        plan.popular
          ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105'
          : isCurrent
          ? 'border-green-500 dark:border-green-400'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Mais Popular
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-2.5 right-3">
          <span className="bg-green-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Seu Plano
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.nome}</h3>
        <div className="mt-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(plan.preco)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">/mês</span>
        </div>
        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
          {plan.limiteCalculos === -1
            ? 'Cálculos ilimitados'
            : `${plan.limiteCalculos} cálculos/mês`}
        </p>
      </div>

      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-2 mb-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant={isCurrent ? 'secondary' : plan.popular ? 'primary' : 'secondary'}
        className="w-full"
        onClick={() => onSelect(plan.plano)}
        disabled={isCurrent || isLoading}
        isLoading={isLoading}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};
