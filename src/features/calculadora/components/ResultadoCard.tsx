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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado do Cálculo</h2>

      {/* Resumo Geral */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Base de Cálculo</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(resultado.totais.baseCalculo)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Tributos</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(resultado.totais.valorCBS + resultado.totais.valorIBS + resultado.totais.valorIS)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Geral</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(resultado.totais.valorTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Detalhamento por Tributo */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhamento de Tributos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CBS */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">CBS (Contribuição Social)</p>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(resultado.totais.valorCBS)}
            </p>
          </div>

          {/* IBS */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">IBS (Imposto sobre Bens e Serviços)</p>
            <p className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(resultado.totais.valorIBS)}
            </p>
          </div>

          {/* IS */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">IS (Imposto Seletivo)</p>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              {formatCurrency(resultado.totais.valorIS)}
            </p>
          </div>
        </div>
      </div>

      {/* Itens Calculados */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Itens Calculados</h3>
        <div className="space-y-4">
          {resultado.itens.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{item.descricao || `NCM ${item.ncm}`}</h4>
                  <p className="text-sm text-gray-600">
                    NCM: {item.ncm}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Base de Cálculo</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.baseCalculo)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-gray-600">CBS</p>
                  <p className="font-semibold text-green-600">{formatCurrency(item.valorCBS)}</p>
                  <p className="text-xs text-gray-500">{formatPercent(item.aliquotaCBS)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">IBS</p>
                  <p className="font-semibold text-purple-600">{formatCurrency(item.valorIBS)}</p>
                  <p className="text-xs text-gray-500">{formatPercent(item.aliquotaIBS)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">IS</p>
                  <p className="font-semibold text-orange-600">{formatCurrency(item.valorIS)}</p>
                  <p className="text-xs text-gray-500">{formatPercent(item.aliquotaIS)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Item</p>
                  <p className="font-bold text-blue-600">{formatCurrency(item.valorCBS + item.valorIBS + item.valorIS)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Informações da Operação</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-600">UF:</span>
            <span className="ml-2 font-medium text-gray-900">{resultado.uf}</span>
          </div>
          <div>
            <span className="text-gray-600">Município:</span>
            <span className="ml-2 font-medium text-gray-900">{resultado.municipio}</span>
          </div>
          <div>
            <span className="text-gray-600">Data:</span>
            <span className="ml-2 font-medium text-gray-900">
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
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ XML gerado e baixado com sucesso!
          </p>
        </div>
      )}

      {gerarXmlMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Erro ao gerar XML. Tente novamente.
          </p>
        </div>
      )}
    </Card>
  );
};
