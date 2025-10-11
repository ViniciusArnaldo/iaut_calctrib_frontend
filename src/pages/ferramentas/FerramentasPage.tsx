import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ValidarXmlForm } from '../../features/calculadora/components/ValidarXmlForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useFundamentacoesLegais } from '../../features/calculadora/hooks/useDadosAbertos';

export const FerramentasPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as 'xml' | 'fundamentacoes' | null;
  const [activeTab, setActiveTab] = useState<'xml' | 'fundamentacoes'>(tabFromUrl || 'xml');
  const [dataConsulta, setDataConsulta] = useState(new Date().toISOString().split('T')[0]);

  // Atualizar aba quando o parâmetro da URL mudar
  useEffect(() => {
    if (tabFromUrl === 'fundamentacoes' || tabFromUrl === 'xml') {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const { data: fundamentacoes, isLoading, refetch } = useFundamentacoesLegais(dataConsulta);

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('xml')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'xml'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Validar XML
            </button>
            <button
              onClick={() => setActiveTab('fundamentacoes')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'fundamentacoes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Fundamentações Legais
            </button>
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="mb-8">
          {activeTab === 'xml' && <ValidarXmlForm />}

          {activeTab === 'fundamentacoes' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Fundamentações Legais
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Referência
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={dataConsulta}
                    onChange={(e) => setDataConsulta(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={() => refetch()} isLoading={isLoading}>
                    Consultar
                  </Button>
                </div>
              </div>

              {isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Carregando fundamentações legais...</p>
                </div>
              )}

              {!isLoading && fundamentacoes && fundamentacoes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Nenhuma fundamentação legal encontrada para esta data.
                  </p>
                </div>
              )}

              {!isLoading && fundamentacoes && fundamentacoes.length > 0 && (
                <div className="space-y-4">
                  {fundamentacoes.map((fund: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {fund.codigoClassificacaoTributaria && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Código Classificação:
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {fund.codigoClassificacaoTributaria}
                            </span>
                          </div>
                        )}
                        {fund.codigoSituacaoTributaria && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Código Situação:
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {fund.codigoSituacaoTributaria}
                            </span>
                          </div>
                        )}
                      </div>

                      {fund.descricaoClassificacaoTributaria && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Classificação:
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {fund.descricaoClassificacaoTributaria}
                          </p>
                        </div>
                      )}

                      {fund.descricaoSituacaoTributaria && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Situação:</span>
                          <p className="text-sm text-gray-900 mt-1">
                            {fund.descricaoSituacaoTributaria}
                          </p>
                        </div>
                      )}

                      {fund.conjuntoTributo && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Tributo:</span>
                          <span className="ml-2 text-sm text-gray-900">{fund.conjuntoTributo}</span>
                        </div>
                      )}

                      {fund.textoCurto && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Resumo:</span>
                          <p className="text-sm text-gray-900 mt-1">{fund.textoCurto}</p>
                        </div>
                      )}

                      {fund.texto && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Fundamentação Completa:
                          </span>
                          <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                            {fund.texto}
                          </p>
                        </div>
                      )}

                      {fund.referenciaNormativa && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <span className="text-sm font-medium text-gray-700">
                            Referência Normativa:
                          </span>
                          <p className="text-sm text-blue-600 mt-1">{fund.referenciaNormativa}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
