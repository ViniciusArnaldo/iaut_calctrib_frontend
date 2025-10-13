import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { ResultadoCalculoRegimeGeral } from '../types/calculadora.types';
import { useGerarXml } from '../hooks/useCalculadora';

interface Props {
  resultado: ResultadoCalculoRegimeGeral;
}

export const ResultadoCard: React.FC<Props> = ({ resultado }) => {
  const [xmlGerado, setXmlGerado] = useState<string | null>(null);
  const gerarXmlMutation = useGerarXml();
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(4)}%`;
  };

  const handleGerarXml = async () => {
    try {
      const xml = await gerarXmlMutation.mutateAsync(resultado);
      setXmlGerado(xml);

      // Download do XML
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ROC_${new Date().toISOString().split('T')[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar XML:', error);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Resultado do Cálculo</h2>

      {/* Resumo Geral */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Base de Cálculo</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(resultado.totais.baseCalculo)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tributos</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(resultado.totais.valorCBS + resultado.totais.valorIBS + resultado.totais.valorIS)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Geral</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(resultado.totais.valorTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Detalhamento por Tributo */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detalhamento de Tributos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CBS */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CBS (Contribuição Social)</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {formatCurrency(resultado.totais.valorCBS)}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mt-2">
              {resultado.totais.vDifCBS > 0 && (
                <p>Diferencial: {formatCurrency(resultado.totais.vDifCBS)}</p>
              )}
              {resultado.totais.vDevTribCBS > 0 && (
                <p>Devolução: {formatCurrency(resultado.totais.vDevTribCBS)}</p>
              )}
              {resultado.totais.vCredPresCBS > 0 && (
                <p>Créd. Presumido: {formatCurrency(resultado.totais.vCredPresCBS)}</p>
              )}
              {resultado.totais.vCredPresCondSusCBS > 0 && (
                <p>Créd. Pres. Cond/Sus: {formatCurrency(resultado.totais.vCredPresCondSusCBS)}</p>
              )}
            </div>
          </div>

          {/* IBS */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IBS (Imposto sobre Bens e Serviços)</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {formatCurrency(resultado.totais.valorIBS)}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mt-2">
              <p>IBS UF: {formatCurrency(resultado.totais.valorIBSUF)}</p>
              <p>IBS Município: {formatCurrency(resultado.totais.valorIBSMun)}</p>
              {(resultado.totais.vDifIBSUF > 0 || resultado.totais.vDifIBSMun > 0) && (
                <p>Diferencial: {formatCurrency(resultado.totais.vDifIBSUF + resultado.totais.vDifIBSMun)}</p>
              )}
              {(resultado.totais.vDevTribIBSUF > 0 || resultado.totais.vDevTribIBSMun > 0) && (
                <p>Devolução: {formatCurrency(resultado.totais.vDevTribIBSUF + resultado.totais.vDevTribIBSMun)}</p>
              )}
              {resultado.totais.vCredPresIBS > 0 && (
                <p>Créd. Presumido: {formatCurrency(resultado.totais.vCredPresIBS)}</p>
              )}
              {resultado.totais.vCredPresCondSusIBS > 0 && (
                <p>Créd. Pres. Cond/Sus: {formatCurrency(resultado.totais.vCredPresCondSusIBS)}</p>
              )}
            </div>
          </div>

          {/* IS */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IS (Imposto Seletivo)</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {formatCurrency(resultado.totais.valorIS)}
            </p>
            {resultado.totais.valorIS === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Não aplicável</p>
            )}
          </div>
        </div>
      </div>

      {/* Itens Calculados */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Itens Calculados</h3>
        <div className="space-y-4">
          {resultado.itens.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Item {item.numero} - {item.descricao || `NCM ${item.ncm}`}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                    <p>NCM: {item.ncm} | CST: {item.cst} | Class. Trib: {item.cClassTrib}</p>
                    {item.nbs && <p>NBS: {item.nbs}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Base de Cálculo</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.baseCalculo)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">CBS</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(item.valorCBS)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alíquota: {formatPercent(item.aliquotaCBS)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">IBS Total</p>
                  <p className="font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(item.valorIBS)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alíquota: {formatPercent(item.aliquotaIBS)}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                    <p>UF: {formatCurrency(item.valorIBSUF)} ({formatPercent(item.aliquotaIBSUF)})</p>
                    <p>Mun: {formatCurrency(item.valorIBSMun)} ({formatPercent(item.aliquotaIBSMun)})</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">IS</p>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(item.valorIS)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alíquota: {formatPercent(item.aliquotaIS)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Item</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.valorCBS + item.valorIBS + item.valorIS)}</p>
                </div>
              </div>

              {/* Informações Adicionais */}
              {(item.impostoSeletivo || item.difCBS || item.difIBSUF || item.difIBSMun ||
                item.devTribCBS || item.devTribIBSUF || item.devTribIBSMun ||
                item.redCBS || item.redIBSUF || item.redIBSMun ||
                item.tribRegular || item.credPresIBS || item.credPresCBS) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      Ver Informações Avançadas
                    </summary>
                    <div className="mt-2 space-y-3 text-xs">
                      {/* Imposto Seletivo */}
                      {item.impostoSeletivo && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded">
                          <p className="font-medium text-orange-700 dark:text-orange-400 mb-2">Imposto Seletivo (IS)</p>
                          <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                            <p>CST IS: {item.impostoSeletivo.CSTIS}</p>
                            <p>Class. Trib. IS: {item.impostoSeletivo.cClassTribIS}</p>
                            <p>Base Cálculo: {formatCurrency(item.impostoSeletivo.vBCIS)}</p>
                            <p>Alíquota: {formatPercent(item.impostoSeletivo.pIS)}</p>
                            {item.impostoSeletivo.pISEspec > 0 && <p>Alíq. Específica: {formatPercent(item.impostoSeletivo.pISEspec)}</p>}
                            <p>Unidade: {item.impostoSeletivo.uTrib}</p>
                            <p>Quantidade: {item.impostoSeletivo.qTrib}</p>
                            <p className="col-span-2 font-semibold">Valor IS: {formatCurrency(item.impostoSeletivo.vIS)}</p>
                          </div>
                          {item.impostoSeletivo.memoriaCalculo && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{item.impostoSeletivo.memoriaCalculo}</p>
                          )}
                        </div>
                      )}

                      {/* Diferencial de Alíquota */}
                      {(item.difCBS || item.difIBSUF || item.difIBSMun) && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded">
                          <p className="font-medium text-blue-700 dark:text-blue-400 mb-2">Diferencial de Alíquota</p>
                          <div className="space-y-1 text-gray-600 dark:text-gray-400">
                            {item.difCBS && <p>CBS: {formatPercent(item.difCBS.pDif)} = {formatCurrency(item.difCBS.vDif)}</p>}
                            {item.difIBSUF && <p>IBS UF: {formatPercent(item.difIBSUF.pDif)} = {formatCurrency(item.difIBSUF.vDif)}</p>}
                            {item.difIBSMun && <p>IBS Mun: {formatPercent(item.difIBSMun.pDif)} = {formatCurrency(item.difIBSMun.vDif)}</p>}
                          </div>
                        </div>
                      )}

                      {/* Devolução de Tributo */}
                      {(item.devTribCBS || item.devTribIBSUF || item.devTribIBSMun) && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded">
                          <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Devolução de Tributo</p>
                          <div className="space-y-1 text-gray-600 dark:text-gray-400">
                            {item.devTribCBS && <p>CBS: {formatCurrency(item.devTribCBS.vDevTrib)}</p>}
                            {item.devTribIBSUF && <p>IBS UF: {formatCurrency(item.devTribIBSUF.vDevTrib)}</p>}
                            {item.devTribIBSMun && <p>IBS Mun: {formatCurrency(item.devTribIBSMun.vDevTrib)}</p>}
                          </div>
                        </div>
                      )}

                      {/* Redução de Alíquota */}
                      {(item.redCBS || item.redIBSUF || item.redIBSMun) && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded">
                          <p className="font-medium text-green-700 dark:text-green-400 mb-2">Redução de Alíquota</p>
                          <div className="space-y-1 text-gray-600 dark:text-gray-400">
                            {item.redCBS && <p>CBS: {formatPercent(item.redCBS.pRedAliq)} → Efetiva: {formatPercent(item.redCBS.pAliqEfet)}</p>}
                            {item.redIBSUF && <p>IBS UF: {formatPercent(item.redIBSUF.pRedAliq)} → Efetiva: {formatPercent(item.redIBSUF.pAliqEfet)}</p>}
                            {item.redIBSMun && <p>IBS Mun: {formatPercent(item.redIBSMun.pRedAliq)} → Efetiva: {formatPercent(item.redIBSMun.pAliqEfet)}</p>}
                          </div>
                        </div>
                      )}

                      {/* Tributação Regular */}
                      {item.tribRegular && (
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded">
                          <p className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">Tributação Regular</p>
                          <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                            <p>CST Reg: {item.tribRegular.CSTReg}</p>
                            <p>Class. Trib: {item.tribRegular.cClassTribReg}</p>
                            <p>IBS UF: {formatPercent(item.tribRegular.pAliqEfetRegIBSUF)} = {formatCurrency(item.tribRegular.vTribRegIBSUF)}</p>
                            <p>IBS Mun: {formatPercent(item.tribRegular.pAliqEfetRegIBSMun)} = {formatCurrency(item.tribRegular.vTribRegIBSMun)}</p>
                            <p className="col-span-2">CBS: {formatPercent(item.tribRegular.pAliqEfetRegCBS)} = {formatCurrency(item.tribRegular.vTribRegCBS)}</p>
                          </div>
                        </div>
                      )}

                      {/* Crédito Presumido */}
                      {(item.credPresIBS || item.credPresCBS) && (
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded">
                          <p className="font-medium text-teal-700 dark:text-teal-400 mb-2">Crédito Presumido</p>
                          <div className="space-y-1 text-gray-600 dark:text-gray-400">
                            {item.credPresIBS && (
                              <div>
                                <p className="font-medium">IBS:</p>
                                <p>Código: {item.credPresIBS.cCredPres} | {formatPercent(item.credPresIBS.pCredPres)}</p>
                                <p>Valor: {formatCurrency(item.credPresIBS.vCredPres)}</p>
                                {item.credPresIBS.vCredPresCondSus > 0 && <p>Condicionado/Suspenso: {formatCurrency(item.credPresIBS.vCredPresCondSus)}</p>}
                              </div>
                            )}
                            {item.credPresCBS && (
                              <div className="mt-2">
                                <p className="font-medium">CBS:</p>
                                <p>Código: {item.credPresCBS.cCredPres} | {formatPercent(item.credPresCBS.pCredPres)}</p>
                                <p>Valor: {formatCurrency(item.credPresCBS.vCredPres)}</p>
                                {item.credPresCBS.vCredPresCondSus > 0 && <p>Condicionado/Suspenso: {formatCurrency(item.credPresCBS.vCredPresCondSus)}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Memórias de Cálculo */}
              {(item.memoriaCalculoCBS || item.memoriaCalculoIBSUF || item.memoriaCalculoIBSMun) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      Ver Memória de Cálculo
                    </summary>
                    <div className="mt-2 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      {item.memoriaCalculoCBS && (
                        <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded">
                          <p className="font-medium text-green-700 dark:text-green-400">CBS:</p>
                          <p>{item.memoriaCalculoCBS}</p>
                        </div>
                      )}
                      {item.memoriaCalculoIBSUF && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded">
                          <p className="font-medium text-purple-700 dark:text-purple-400">IBS UF:</p>
                          <p>{item.memoriaCalculoIBSUF}</p>
                        </div>
                      )}
                      {item.memoriaCalculoIBSMun && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded">
                          <p className="font-medium text-purple-700 dark:text-purple-400">IBS Município:</p>
                          <p>{item.memoriaCalculoIBSMun}</p>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informações da Operação</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">UF:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{resultado.uf}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Município:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{resultado.municipio}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Data:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {new Date(resultado.dataOperacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Botão Gerar XML */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          onClick={handleGerarXml}
          isLoading={gerarXmlMutation.isPending}
        >
          {xmlGerado ? 'Baixar XML Novamente' : 'Gerar e Baixar XML'}
        </Button>
      </div>

      {xmlGerado && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            ✓ XML gerado e baixado com sucesso!
          </p>
        </div>
      )}

      {gerarXmlMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">
            Erro ao gerar XML. Tente novamente.
          </p>
        </div>
      )}
    </Card>
  );
};
