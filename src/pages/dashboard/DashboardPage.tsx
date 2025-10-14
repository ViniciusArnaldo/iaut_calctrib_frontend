import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, History, FileCheck, BookOpen, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatsCard } from '../../features/dashboard/components/StatsCard';
import { useEstatisticas } from '../../features/dashboard/hooks/useStats';
import { useHistorico } from '../../features/calculadora/hooks/useCalculadora';
import { useUsage } from '../../features/subscriptions/hooks/useSubscriptions';
import { ROUTES } from '../../utils/constants';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: loadingStats } = useEstatisticas();
  const { data: historico } = useHistorico({ limit: 5 });
  const { data: usage } = useUsage();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

        {/* Estatísticas */}
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Cálculos Realizados"
              value={stats?.totalCalculos || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              }
              description="Este mês"
              color="blue"
            />

            <StatsCard
              title="Limite do Plano"
              value={stats?.limite === -1 ? 'Ilimitado' : stats?.limite || '-'}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
              description={stats?.plano || 'Plano atual'}
              color="green"
            />

            <StatsCard
              title="Disponível"
              value={stats?.calculosRestantes || '-'}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              description="Cálculos restantes"
              color="purple"
            />

            <StatsCard
              title="Este mês"
              value={stats?.calculosEsteMes || 0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              description="Atividade recente"
              color="orange"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ações Rápidas - Expandido */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(ROUTES.CALCULADORA)}
                className="w-full flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors text-left"
              >
                <Calculator className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium text-sm">Nova Calculadora</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Calcular CBS, IBS e IS</p>
                </div>
              </button>

              <button
                onClick={() => navigate(ROUTES.HISTORICO)}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-left"
              >
                <History className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium text-sm">Ver Histórico</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Cálculos realizados</p>
                </div>
              </button>

              <button
                onClick={() => navigate(ROUTES.FERRAMENTAS)}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-left"
              >
                <FileCheck className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium text-sm">Validar XML</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Verificar ROC</p>
                </div>
              </button>

              <button
                onClick={() => navigate(`${ROUTES.FERRAMENTAS}?tab=fundamentacoes`)}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-left"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium text-sm">Fundamentações Legais</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Consultar legislação</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Gráfico de Cálculos por Tipo */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cálculos por Tipo</h3>
            <div className="space-y-3">
              {stats?.calculosPorTipo && stats.calculosPorTipo.length > 0 ? (
                stats.calculosPorTipo.map((item: any) => (
                  <div key={item.tipo} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-3"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.tipo}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
                          style={{
                            width: `${stats.totalCalculos > 0 ? (item.quantidade / stats.totalCalculos) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                        {item.quantidade}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Nenhum cálculo realizado ainda
                </p>
              )}
            </div>
          </Card>

          {/* Alertas e Avisos */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              Alertas
            </h3>
            <div className="space-y-3">
              {/* Alerta de Limite */}
              {usage && usage.limiteCalculos !== -1 && usage.percentualUso >= 80 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-300">
                        Limite próximo
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                        Você usou {usage.percentualUso.toFixed(0)}% do seu plano mensal
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Aviso Informativo */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Reforma Tributária
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Sistema atualizado conforme LC 214/2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Histórico Recente */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              Cálculos Recentes
            </h3>
            <button
              onClick={() => navigate(ROUTES.HISTORICO)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Ver todos →
            </button>
          </div>

          {historico && historico.itens && historico.itens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Município
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      UF
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Valor Base
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {historico.itens.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.municipio || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {item.uf || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right">
                        {item.valorBase ? `R$ ${item.valorBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum cálculo realizado ainda</p>
              <button
                onClick={() => navigate(ROUTES.CALCULADORA)}
                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Realizar primeiro cálculo →
              </button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
