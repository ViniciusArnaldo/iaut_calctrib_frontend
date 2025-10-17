import React from 'react';
import { Table2, BarChart3, TrendingUp, PieChart, Target, Download, Save } from 'lucide-react';
import type { TipoVisualizacao } from '../types/analises.types';

interface BarraAcoesProps {
  visualizacao: TipoVisualizacao;
  onVisualizacaoChange: (tipo: TipoVisualizacao) => void;
  onSalvar?: () => void;
  onExportar: () => void;
  salvando?: boolean;
  exportando?: boolean;
}

const visualizacoes: Array<{
  tipo: TipoVisualizacao;
  label: string;
  icon: React.ReactNode;
}> = [
  { tipo: 'tabela', label: 'Tabela', icon: <Table2 className="w-4 h-4" /> },
  { tipo: 'colunas', label: 'Colunas', icon: <BarChart3 className="w-4 h-4" /> },
  { tipo: 'barras', label: 'Barras', icon: <BarChart3 className="w-4 h-4 rotate-90" /> },
  { tipo: 'linha', label: 'Linha', icon: <TrendingUp className="w-4 h-4" /> },
  { tipo: 'pizza', label: 'Pizza', icon: <PieChart className="w-4 h-4" /> },
  { tipo: 'kpi', label: 'KPI', icon: <Target className="w-4 h-4" /> },
];

export const BarraAcoes: React.FC<BarraAcoesProps> = ({
  visualizacao,
  onVisualizacaoChange,
  onSalvar,
  onExportar,
  salvando,
  exportando,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Visualização */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Visualização:
        </span>
        {visualizacoes.map((vis) => (
          <button
            key={vis.tipo}
            onClick={() => onVisualizacaoChange(vis.tipo)}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                visualizacao === vis.tipo
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            title={vis.label}
          >
            {vis.icon}
            <span className="ml-2 hidden md:inline">{vis.label}</span>
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onExportar}
          disabled={exportando}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          {exportando ? 'Exportando...' : 'Exportar'}
        </button>

        {onSalvar && (
          <button
            onClick={onSalvar}
            disabled={salvando}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        )}
      </div>
    </div>
  );
};
