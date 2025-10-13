import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useHistorico } from '../../features/calculadora/hooks/useCalculadora';
import { ResultadoCard } from '../../features/calculadora/components/ResultadoCard';
import type { CalculoHistorico } from '../../features/calculadora/types/calculadora.types';

export const HistoricoPage: React.FC = () => {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: '',
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [calculoSelecionado, setCalculoSelecionado] = useState<CalculoHistorico | null>(null);

  const { data, isLoading } = useHistorico({
    ...filtros,
    page,
    limit,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderDadosEnviados = (request: any, tipo: string) => {
    if (!request) return null;

    // Regime Geral
    if (tipo === 'REGIME_GERAL') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">UF</p>
              <p className="font-semibold text-gray-900 dark:text-white">{request.uf || '-'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Município</p>
              <p className="font-semibold text-gray-900 dark:text-white">{request.municipio || '-'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Data/Hora Emissão</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {request.dataHoraEmissao ? new Date(request.dataHoraEmissao).toLocaleString('pt-BR') : '-'}
              </p>
            </div>
          </div>

          {request.itens && request.itens.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Itens ({request.itens.length})</h4>
              <div className="space-y-3">
                {request.itens.map((item: any, index: number) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Mostra NCM apenas se não tiver NBS */}
                      {item.ncm && !item.nbs && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">NCM</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.ncm}</p>
                        </div>
                      )}
                      {/* Mostra NBS apenas se tiver NBS */}
                      {item.nbs && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">NBS</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.nbs}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">CST</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.cst || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Base de Cálculo</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.baseCalculo ? formatCurrency(item.baseCalculo) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Base de Cálculo IS
    if (tipo === 'BASE_CALCULO_IS') {
      const campos = [
        { label: 'Valor Integral Cobrado', field: 'valorIntegralCobrado' },
        { label: 'Ajuste Valor Operação', field: 'ajusteValorOperacao' },
        { label: 'Juros', field: 'juros' },
        { label: 'Multas', field: 'multas' },
        { label: 'Acréscimos', field: 'acrescimos' },
        { label: 'Encargos', field: 'encargos' },
        { label: 'Descontos Condicionais', field: 'descontosCondicionais' },
        { label: 'Frete Por Dentro', field: 'fretePorDentro' },
        { label: 'Outros Tributos', field: 'outrosTributos' },
        { label: 'Demais Importâncias', field: 'demaisImportancias' },
        { label: 'ICMS', field: 'icms' },
        { label: 'ISS', field: 'iss' },
        { label: 'PIS', field: 'pis' },
        { label: 'COFINS', field: 'cofins' },
        { label: 'Bonificação', field: 'bonificacao' },
        { label: 'Devolução Vendas', field: 'devolucaoVendas' },
      ];

      const camposPreenchidos = campos.filter(c =>
        request[c.field] !== undefined &&
        request[c.field] !== null &&
        request[c.field] !== 0
      );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {camposPreenchidos.map((campo) => (
            <div key={campo.field} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{campo.label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(request[campo.field])}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Base de Cálculo CBS/IBS
    if (tipo === 'BASE_CALCULO_CIBS') {
      const campos = [
        { label: 'Valor do Fornecimento', field: 'valorFornecimento' },
        { label: 'Ajuste Valor Operação', field: 'ajusteValorOperacao' },
        { label: 'Juros', field: 'juros' },
        { label: 'Multas', field: 'multas' },
        { label: 'Acréscimos', field: 'acrescimos' },
        { label: 'Encargos', field: 'encargos' },
        { label: 'Descontos Condicionais', field: 'descontosCondicionais' },
        { label: 'Frete Por Dentro', field: 'fretePorDentro' },
        { label: 'Outros Tributos', field: 'outrosTributos' },
        { label: 'Imposto Seletivo', field: 'impostoSeletivo' },
        { label: 'Demais Importâncias', field: 'demaisImportancias' },
        { label: 'ICMS', field: 'icms' },
        { label: 'ISS', field: 'iss' },
        { label: 'PIS', field: 'pis' },
        { label: 'COFINS', field: 'cofins' },
      ];

      const camposPreenchidos = campos.filter(c =>
        request[c.field] !== undefined &&
        request[c.field] !== null &&
        request[c.field] !== 0
      );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {camposPreenchidos.map((campo) => (
            <div key={campo.field} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{campo.label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(request[campo.field])}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Pedágio
    if (tipo === 'PEDAGIO') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {request.codigoMunicipioOrigem && (
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Município Origem</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.codigoMunicipioOrigem}</p>
            </div>
          )}
          {request.ufMunicipioOrigem && (
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">UF Origem</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.ufMunicipioOrigem}</p>
            </div>
          )}
          {request.codigoMunicipioDestino && (
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Município Destino</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.codigoMunicipioDestino}</p>
            </div>
          )}
          {request.ufMunicipioDestino && (
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">UF Destino</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.ufMunicipioDestino}</p>
            </div>
          )}
          {request.baseCalculo !== undefined && (
            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Base de Cálculo</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(request.baseCalculo)}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Fallback para outros tipos - mostra JSON formatado
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {JSON.stringify(request, null, 2)}
        </pre>
      </div>
    );
  };

  const handleFilter = () => {
    setPage(1); // Reset para primeira página ao filtrar
  };

  const handleClearFilters = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      tipo: '',
    });
    setPage(1);
  };

  const handleVerDetalhes = (calculo: CalculoHistorico) => {
    setCalculoSelecionado(calculo);
  };

  const handleVoltar = () => {
    setCalculoSelecionado(null);
  };

  // Se há um cálculo selecionado, mostrar detalhes
  if (calculoSelecionado) {
    return (
      <DashboardLayout>
        <div>
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={handleVoltar}
              className="flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Voltar ao Histórico</span>
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Detalhes do Cálculo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Realizado em {formatDate(calculoSelecionado.dataOperacao || calculoSelecionado.createdAt)} por {calculoSelecionado.user.name}
          </p>

          {/* Dados Enviados (Request) */}
          {calculoSelecionado.request && (
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dados Enviados
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                {renderDadosEnviados(calculoSelecionado.request, calculoSelecionado.tipo)}
              </div>
            </Card>
          )}

          {/* Resultado do Cálculo */}
          {calculoSelecionado.response && (
            <ResultadoCard resultado={calculoSelecionado.response} />
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Histórico de Cálculos</h1>

        {/* Filtros */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
            <Input
              label="Data Fim"
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
            <Select
              label="Tipo"
              placeholder="Todos"
              value={filtros.tipo}
              options={[
                { value: '', label: 'Todos' },
                { value: 'REGIME_GERAL', label: 'Regime Geral' },
                { value: 'PEDAGIO', label: 'Pedágio' },
              ]}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            />
            <div className="flex items-end space-x-2">
              <Button variant="primary" onClick={handleFilter} className="flex-1">
                Filtrar
              </Button>
              <Button variant="secondary" onClick={handleClearFilters} className="flex-1">
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabela */}
        <Card>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando histórico...</p>
            </div>
          ) : data?.itens && data.itens.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        UF/Município
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Itens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Tributos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.itens.map((calculo: any) => (
                      <tr key={calculo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {formatDate(calculo.dataOperacao || calculo.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {calculo.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {calculo.uf} / {calculo.municipioNome || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {calculo.numeroItens || 0} item(ns)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-300">
                          {formatCurrency(calculo.totalTributos || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleVerDetalhes(calculo)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="secondary"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= (data?.meta.totalPages || 1)}
                  >
                    Próximo
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Mostrando{' '}
                      <span className="font-medium">{(page - 1) * limit + 1}</span> até{' '}
                      <span className="font-medium">
                        {Math.min(page * limit, data?.meta.total || 0)}
                      </span>{' '}
                      de <span className="font-medium">{data?.meta.total || 0}</span> resultados
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Página {page} de {data?.meta.totalPages || 1}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= (data?.meta.totalPages || 1)}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum cálculo encontrado</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comece realizando um cálculo na calculadora.
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
