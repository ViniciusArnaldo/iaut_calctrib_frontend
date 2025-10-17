import React from 'react';
import { Settings } from 'lucide-react';
import type { ConfiguracaoAnalise } from '../types/analises.types';

interface OpcoesAvancadasProps {
  opcoes: ConfiguracaoAnalise['opcoes'];
  onOpcoesChange: (opcoes: ConfiguracaoAnalise['opcoes']) => void;
}

export const OpcoesAvancadas: React.FC<OpcoesAvancadasProps> = ({ opcoes, onOpcoesChange }) => {
  const handleChange = (campo: string, valor: any) => {
    onOpcoesChange({
      ...opcoes,
      [campo]: valor,
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Opções Avançadas</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mostrar Percentual */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="mostrarPercentual"
            checked={opcoes?.mostrarPercentual || false}
            onChange={(e) => handleChange('mostrarPercentual', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="mostrarPercentual"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Mostrar Percentual (%)
          </label>
        </div>

        {/* Mostrar Total */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="mostrarTotal"
            checked={opcoes?.mostrarTotal || false}
            onChange={(e) => handleChange('mostrarTotal', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="mostrarTotal" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Mostrar Total
          </label>
        </div>

        {/* Limitar Linhas (Top N) */}
        <div className="flex items-center space-x-2">
          <label htmlFor="limitarLinhas" className="text-sm text-gray-700 dark:text-gray-300">
            Top N:
          </label>
          <select
            id="limitarLinhas"
            value={opcoes?.limitarLinhas || ''}
            onChange={(e) =>
              handleChange('limitarLinhas', e.target.value ? Number(e.target.value) : undefined)
            }
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Todos</option>
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
            <option value="50">Top 50</option>
            <option value="100">Top 100</option>
          </select>
        </div>

        {/* Ordenação */}
        <div className="flex items-center space-x-2">
          <label htmlFor="ordenacaoCampo" className="text-sm text-gray-700 dark:text-gray-300">
            Ordenar por:
          </label>
          <select
            id="ordenacaoCampo"
            value={opcoes?.ordenacao?.campo || ''}
            onChange={(e) =>
              handleChange('ordenacao', {
                ...opcoes?.ordenacao,
                campo: e.target.value,
                direcao: opcoes?.ordenacao?.direcao || 'desc',
              })
            }
            className="flex-1 px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Padrão</option>
            <option value="valor">Valor</option>
            <option value="nome">Nome</option>
            <option value="quantidade">Quantidade</option>
          </select>
        </div>

        {/* Direção da Ordenação */}
        {opcoes?.ordenacao?.campo && (
          <div className="flex items-center space-x-2">
            <label htmlFor="ordenacaoDirecao" className="text-sm text-gray-700 dark:text-gray-300">
              Ordem:
            </label>
            <select
              id="ordenacaoDirecao"
              value={opcoes?.ordenacao?.direcao || 'desc'}
              onChange={(e) =>
                handleChange('ordenacao', {
                  ...opcoes?.ordenacao,
                  campo: opcoes?.ordenacao?.campo || 'valor',
                  direcao: e.target.value as 'asc' | 'desc',
                })
              }
              className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="asc">Crescente ↑</option>
              <option value="desc">Decrescente ↓</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <strong>Dica:</strong> Use "Top N" para visualizar apenas os principais resultados e
        "Ordenar" para organizar os dados.
      </div>
    </div>
  );
};
