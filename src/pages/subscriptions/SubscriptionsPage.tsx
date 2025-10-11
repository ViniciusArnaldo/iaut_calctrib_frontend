import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { PlanCard } from '../../features/subscriptions/components/PlanCard';
import {
  usePlans,
  useSubscription,
  useUsage,
  useUpgrade,
} from '../../features/subscriptions/hooks/useSubscriptions';
import type { SubscriptionPlan } from '../../features/subscriptions/types/subscriptions.types';

export const SubscriptionsPage: React.FC = () => {
  const { data: plans, isLoading: loadingPlans } = usePlans();
  const { data: subscription } = useSubscription();
  const { data: usage } = useUsage();
  const upgradeMutation = useUpgrade();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === subscription?.plano) return;
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      await upgradeMutation.mutateAsync({ novoPlano: selectedPlan });
      setShowConfirm(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Erro ao alterar plano:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Assinaturas e Planos</h1>

        {/* Uso Atual */}
        {usage && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uso Atual</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plano</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{usage.plano}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cálculos Realizados</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{usage.calculosRealizados}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Limite</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {usage.limiteCalculos === -1 ? 'Ilimitado' : usage.limiteCalculos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Restantes</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {usage.calculosRestantes === -1 ? 'Ilimitado' : usage.calculosRestantes}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {usage.limiteCalculos !== -1 && usage.percentualUso !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uso do mês</span>
                  <span>{usage.percentualUso.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usage.percentualUso >= 90
                        ? 'bg-red-500 dark:bg-red-400'
                        : usage.percentualUso >= 70
                        ? 'bg-yellow-500 dark:bg-yellow-400'
                        : 'bg-green-500 dark:bg-green-400'
                    }`}
                    style={{ width: `${Math.min(usage.percentualUso, 100)}%` }}
                  ></div>
                </div>
                {usage.resetEm && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Reset em: {formatDate(usage.resetEm)}
                  </p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Planos Disponíveis */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Planos Disponíveis</h2>
          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={subscription?.plano}
                  onSelect={handleSelectPlan}
                  isLoading={upgradeMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* Informações da Assinatura Atual */}
        {subscription && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informações da Assinatura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="ml-2 font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      subscription.status === 'ACTIVE'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Data de Início:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatDate(subscription.dataInicio)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Próxima Renovação:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {subscription.dataFim ? formatDate(subscription.dataFim) : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Modal de Confirmação */}
        {showConfirm && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirmar Alteração de Plano
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você está prestes a alterar seu plano para <strong>{selectedPlan}</strong>. Esta
                alteração entrará em vigor imediatamente.
              </p>
              {upgradeMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Erro ao alterar plano. Tente novamente.
                  </p>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmUpgrade}
                  disabled={upgradeMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                >
                  {upgradeMutation.isPending ? 'Processando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedPlan(null);
                  }}
                  disabled={upgradeMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
