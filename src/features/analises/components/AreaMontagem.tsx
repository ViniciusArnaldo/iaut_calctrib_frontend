import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Folder, DollarSign, Filter as FilterIcon } from 'lucide-react';
import type {
  CampoAgrupamento,
  CampoValor,
  CampoFiltro,
  TipoAgregacao,
} from '../types/analises.types';

// ============================================
// Campo em área droppable
// ============================================

interface CampoAgrupadoProps {
  campo: CampoAgrupamento;
  onRemove: () => void;
  onOrdemChange: (ordem: 'asc' | 'desc') => void;
}

const CampoAgrupado: React.FC<CampoAgrupadoProps> = ({ campo, onRemove, onOrdemChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `agrupamento-${campo.campo.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800
        rounded-lg ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>

      <span className="flex-1 text-sm font-medium text-blue-900 dark:text-blue-300">
        {campo.campo.label}
      </span>

      <select
        value={campo.ordem || 'asc'}
        onChange={(e) => onOrdemChange(e.target.value as 'asc' | 'desc')}
        className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 rounded text-blue-900 dark:text-blue-300"
        onClick={(e) => e.stopPropagation()}
      >
        <option value="asc">A-Z ↑</option>
        <option value="desc">Z-A ↓</option>
      </select>

      <button
        onClick={onRemove}
        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
      >
        <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </button>
    </div>
  );
};

interface CampoValorItemProps {
  campoValor: CampoValor;
  onRemove: () => void;
  onAgregacaoChange: (agregacao: TipoAgregacao) => void;
}

const CampoValorItem: React.FC<CampoValorItemProps> = ({
  campoValor,
  onRemove,
  onAgregacaoChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `valor-${campoValor.campo.id}-${campoValor.agregacao}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800
        rounded-lg ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>

      <select
        value={campoValor.agregacao}
        onChange={(e) => onAgregacaoChange(e.target.value as TipoAgregacao)}
        className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-700 rounded text-green-900 dark:text-green-300 font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        <option value="soma">Soma</option>
        <option value="contagem">Contagem</option>
        <option value="media">Média</option>
        <option value="minimo">Mínimo</option>
        <option value="maximo">Máximo</option>
      </select>

      <span className="flex-1 text-sm font-medium text-green-900 dark:text-green-300 truncate">
        {campoValor.campo.label}
      </span>

      <button
        onClick={onRemove}
        className="p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded transition-colors"
      >
        <X className="w-4 h-4 text-green-600 dark:text-green-400" />
      </button>
    </div>
  );
};

interface CampoFiltroItemProps {
  campoFiltro: CampoFiltro;
  onRemove: () => void;
  onValorChange: (valor: any) => void;
}

const CampoFiltroItem: React.FC<CampoFiltroItemProps> = ({
  campoFiltro,
  onRemove,
  onValorChange,
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
      <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
        {campoFiltro.campo.label}
      </span>

      <span className="text-xs text-purple-700 dark:text-purple-400">=</span>

      <input
        type={campoFiltro.campo.tipo === 'numero' ? 'number' : 'text'}
        value={campoFiltro.valor}
        onChange={(e) => onValorChange(e.target.value)}
        placeholder="Valor..."
        className="flex-1 text-sm px-2 py-1 bg-white dark:bg-gray-700 border border-purple-300 dark:border-purple-700 rounded text-purple-900 dark:text-purple-300"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={onRemove}
        className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded transition-colors"
      >
        <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </button>
    </div>
  );
};

// ============================================
// Área Droppable
// ============================================

interface AreaDroppableProps {
  id: string;
  titulo: string;
  icone: React.ReactNode;
  placeholder: string;
  cor: 'blue' | 'green' | 'purple';
  children?: React.ReactNode;
}

const AreaDroppable: React.FC<AreaDroppableProps> = ({
  id,
  titulo,
  icone,
  placeholder,
  cor,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const cores = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      borderOver: 'border-blue-500 dark:border-blue-400',
      text: 'text-blue-700 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-300 dark:border-green-700',
      borderOver: 'border-green-500 dark:border-green-400',
      text: 'text-green-700 dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-300 dark:border-purple-700',
      borderOver: 'border-purple-500 dark:border-purple-400',
      text: 'text-purple-700 dark:text-purple-400',
    },
  };

  const corConfig = cores[cor];

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <div className={`${corConfig.text}`}>{icone}</div>
        <h4 className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">{titulo}</h4>
      </div>

      <div
        ref={setNodeRef}
        className={`
          min-h-[100px] p-3 border-2 border-dashed rounded-lg transition-all
          ${corConfig.bg}
          ${isOver ? corConfig.borderOver + ' ring-2 ring-offset-2' : corConfig.border}
        `}
      >
        {React.Children.count(children) === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {placeholder}
            </p>
          </div>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Componente Principal
// ============================================

interface AreaMontagemProps {
  agrupamentos: CampoAgrupamento[];
  valores: CampoValor[];
  filtros: CampoFiltro[];
  onAgrupamentosChange: (agrupamentos: CampoAgrupamento[]) => void;
  onValoresChange: (valores: CampoValor[]) => void;
  onFiltrosChange: (filtros: CampoFiltro[]) => void;
}

export const AreaMontagem: React.FC<AreaMontagemProps> = ({
  agrupamentos,
  valores,
  filtros,
  onAgrupamentosChange,
  onValoresChange,
  onFiltrosChange,
}) => {
  const handleRemoverAgrupamento = (index: number) => {
    onAgrupamentosChange(agrupamentos.filter((_, i) => i !== index));
  };

  const handleOrdemAgrupamentoChange = (index: number, ordem: 'asc' | 'desc') => {
    const novosAgrupamentos = [...agrupamentos];
    novosAgrupamentos[index] = { ...novosAgrupamentos[index], ordem };
    onAgrupamentosChange(novosAgrupamentos);
  };

  const handleRemoverValor = (index: number) => {
    onValoresChange(valores.filter((_, i) => i !== index));
  };

  const handleAgregacaoChange = (index: number, agregacao: TipoAgregacao) => {
    const novosValores = [...valores];
    novosValores[index] = { ...novosValores[index], agregacao };
    onValoresChange(novosValores);
  };

  const handleRemoverFiltro = (index: number) => {
    onFiltrosChange(filtros.filter((_, i) => i !== index));
  };

  const handleValorFiltroChange = (index: number, valor: any) => {
    const novosFiltros = [...filtros];
    novosFiltros[index] = { ...novosFiltros[index], valor };
    onFiltrosChange(novosFiltros);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Área de Montagem</h3>
      </div>

      {/* Agrupar Por */}
      <AreaDroppable
        id="agrupar"
        titulo="Agrupar Por"
        icone={<Folder className="w-5 h-5" />}
        placeholder="Arraste campos aqui para agrupar os dados"
        cor="blue"
      >
        <SortableContext
          items={agrupamentos.map((a) => `agrupamento-${a.campo.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {agrupamentos.map((agrupamento, index) => (
            <CampoAgrupado
              key={`agrupamento-${agrupamento.campo.id}`}
              campo={agrupamento}
              onRemove={() => handleRemoverAgrupamento(index)}
              onOrdemChange={(ordem) => handleOrdemAgrupamentoChange(index, ordem)}
            />
          ))}
        </SortableContext>
      </AreaDroppable>

      {/* Valores */}
      <AreaDroppable
        id="valores"
        titulo="Valores"
        icone={<DollarSign className="w-5 h-5" />}
        placeholder="Arraste campos aqui para calcular valores (soma, contagem, etc.)"
        cor="green"
      >
        <SortableContext
          items={valores.map((v) => `valor-${v.campo.id}-${v.agregacao}`)}
          strategy={verticalListSortingStrategy}
        >
          {valores.map((valor, index) => (
            <CampoValorItem
              key={`valor-${valor.campo.id}-${valor.agregacao}`}
              campoValor={valor}
              onRemove={() => handleRemoverValor(index)}
              onAgregacaoChange={(agregacao) => handleAgregacaoChange(index, agregacao)}
            />
          ))}
        </SortableContext>
      </AreaDroppable>

      {/* Filtros */}
      <AreaDroppable
        id="filtros"
        titulo="Filtros"
        icone={<FilterIcon className="w-5 h-5" />}
        placeholder="Arraste campos aqui para filtrar os dados"
        cor="purple"
      >
        {filtros.map((filtro, index) => (
          <CampoFiltroItem
            key={`filtro-${filtro.campo.id}-${index}`}
            campoFiltro={filtro}
            onRemove={() => handleRemoverFiltro(index)}
            onValorChange={(valor) => handleValorFiltroChange(index, valor)}
          />
        ))}
      </AreaDroppable>
    </div>
  );
};
