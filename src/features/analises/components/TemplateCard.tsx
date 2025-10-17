import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Target,
  DollarSign,
  Award,
  GitCompare,
  Package,
} from 'lucide-react';
import type { TemplateAnalise } from '../types/analises.types';

interface TemplateCardProps {
  template: TemplateAnalise;
  onSelect: (template: TemplateAnalise) => void;
}

const getIconeTemplate = (icone?: string) => {
  const iconClasses = "w-6 h-6";

  switch (icone) {
    case 'TrendingUp':
      return <TrendingUp className={iconClasses} />;
    case 'BarChart3':
      return <BarChart3 className={iconClasses} />;
    case 'PieChart':
      return <PieChart className={iconClasses} />;
    case 'Target':
      return <Target className={iconClasses} />;
    case 'DollarSign':
      return <DollarSign className={iconClasses} />;
    case 'Award':
      return <Award className={iconClasses} />;
    case 'GitCompare':
      return <GitCompare className={iconClasses} />;
    case 'Package':
      return <Package className={iconClasses} />;
    default:
      return <BarChart3 className={iconClasses} />;
  }
};

const getCategoriaColor = (categoria: string) => {
  const colors = {
    tributacao: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    financeiro: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    operacional: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  };
  return colors[categoria as keyof typeof colors] || colors.operacional;
};

const getCategoriaLabel = (categoria: string) => {
  const labels = {
    tributacao: 'Tributação',
    financeiro: 'Financeiro',
    operacional: 'Operacional',
  };
  return labels[categoria as keyof typeof labels] || categoria;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(template)}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 p-4"
    >
      {/* Header com ícone */}
      <div className="flex items-start mb-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          {getIconeTemplate(template.icone)}
        </div>
      </div>

      {/* Nome e descrição */}
      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
        {template.nome}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {template.descricao}
      </p>

      {/* Categoria */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoriaColor(template.categoria)}`}>
          {getCategoriaLabel(template.categoria)}
        </span>

        {/* Call to action sutil */}
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Usar →
        </span>
      </div>
    </button>
  );
};
