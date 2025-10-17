import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Table2,
  Grid3x3,
  Target,
  Edit,
  Copy,
  Trash2,
  Play,
  MoreVertical,
} from 'lucide-react';
import type { Analise, TipoVisualizacao } from '../types/analises.types';

interface AnaliseCardProps {
  analise: Analise;
  onEdit: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  onExecute: (id: number) => void;
}

const getIconeVisualizacao = (tipo: TipoVisualizacao) => {
  const iconClasses = "w-5 h-5";

  switch (tipo) {
    case 'linha':
      return <TrendingUp className={iconClasses} />;
    case 'barras':
    case 'colunas':
      return <BarChart3 className={iconClasses} />;
    case 'pizza':
      return <PieChart className={iconClasses} />;
    case 'tabela':
      return <Table2 className={iconClasses} />;
    case 'kpi':
      return <Target className={iconClasses} />;
    default:
      return <Grid3x3 className={iconClasses} />;
  }
};

const getLabelVisualizacao = (tipo: TipoVisualizacao) => {
  const labels = {
    linha: 'Gráfico de Linha',
    barras: 'Gráfico de Barras',
    colunas: 'Gráfico de Colunas',
    pizza: 'Gráfico de Pizza',
    tabela: 'Tabela',
    kpi: 'KPI',
  };
  return labels[tipo] || tipo;
};

export const AnaliseCard: React.FC<AnaliseCardProps> = ({
  analise,
  onEdit,
  onDuplicate,
  onDelete,
  onExecute,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Fecha menu ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const dataAtualizacao = new Date(analise.updatedAt);
  const tempoDecorrido = getTempoDecorrido(dataAtualizacao);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {analise.nome}
            </h3>
            {analise.descricao && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {analise.descricao}
              </p>
            )}
          </div>

          {/* Menu */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(analise.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDuplicate(analise.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 mr-3" />
                  Duplicar
                </button>
                <button
                  onClick={() => {
                    onDelete(analise.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Tipo de visualização */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          {getIconeVisualizacao(analise.configuracao.visualizacao)}
          <span className="ml-2 text-sm">
            {getLabelVisualizacao(analise.configuracao.visualizacao)}
          </span>
        </div>

        {/* Metadados */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Atualizado {tempoDecorrido}</span>
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
            {analise.configuracao.fonteDados === 'historico' ? 'Histórico' : 'Base Simulação'}
          </span>
        </div>
      </div>

      {/* Footer - Botão de executar */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onExecute(analise.id)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          Visualizar Análise
        </button>
      </div>
    </div>
  );
};

// Helper para calcular tempo decorrido
function getTempoDecorrido(data: Date): string {
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMins / 60);
  const diffDias = Math.floor(diffHoras / 24);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHoras < 24) return `há ${diffHoras}h`;
  if (diffDias < 7) return `há ${diffDias}d`;

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
