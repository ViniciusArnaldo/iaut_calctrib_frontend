import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Search, GripVertical, Hash, Type, Calendar, Database } from 'lucide-react';
import type { CampoAnalise, FonteDados } from '../types/analises.types';
import { getCamposPorFonte } from '../types/analises.types';
import { useBases } from '../../base-simulacao/hooks/useBaseSimulacao';

interface BibliotecaCamposProps {
  fonteDados: FonteDados;
  onFonteChange: (fonte: FonteDados) => void;
  onAdicionarCampo?: (campo: CampoAnalise, tipo: 'agrupar' | 'valores' | 'filtros') => void;
  baseSimulacaoId?: number;
  onBaseSimulacaoChange?: (baseId: number | undefined) => void;
}

// Componente de campo draggable com botões de ação
const CampoDraggable: React.FC<{
  campo: CampoAnalise;
  onAdicionarCampo?: (campo: CampoAnalise, tipo: 'agrupar' | 'valores' | 'filtros') => void;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ campo, onAdicionarCampo, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `campo-${campo.id}`,
    data: {
      campo,
      type: 'campo',
    },
  });

  const [showActions, setShowActions] = useState(false);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getIconeTipo = () => {
    const iconClass = "w-4 h-4 flex-shrink-0";
    switch (campo.tipo) {
      case 'numero':
        return <Hash className={iconClass} />;
      case 'texto':
        return <Type className={iconClass} />;
      case 'data':
        return <Calendar className={iconClass} />;
      default:
        return <Hash className={iconClass} />;
    }
  };

  return (
    <div
      className="relative mb-2"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        ref={setNodeRef}
        style={style}
        onClick={onSelect}
        className={`
          flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
          rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors
          ${isDragging ? 'opacity-50' : ''}
          ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400 border-blue-500 dark:border-blue-400' : ''}
        `}
      >
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
        </div>
        {getIconeTipo()}
        <div className="ml-2 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {campo.label}
          </p>
          {campo.descricao && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {campo.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Botões de ação rápida */}
      {showActions && onAdicionarCampo && (
        <div className="absolute right-0 top-0 flex gap-1 p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdicionarCampo(campo, 'agrupar');
            }}
            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            title="Adicionar a Agrupar Por"
          >
            A
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdicionarCampo(campo, 'valores');
            }}
            className="p-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
            title="Adicionar a Valores"
          >
            V
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdicionarCampo(campo, 'filtros');
            }}
            className="p-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
            title="Adicionar a Filtros"
          >
            F
          </button>
        </div>
      )}
    </div>
  );
};

export const BibliotecaCampos: React.FC<BibliotecaCamposProps> = ({
  fonteDados,
  onFonteChange,
  onAdicionarCampo,
  baseSimulacaoId,
  onBaseSimulacaoChange,
}) => {
  const [busca, setBusca] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const campos = getCamposPorFonte(fonteDados);

  // Buscar bases quando fonte for 'base-simulacao'
  const { data: basesData } = useBases({
    status: 'PROCESSADA',
    limit: 100,
  });

  const camposFiltrados = campos.filter(
    (campo) =>
      campo.label.toLowerCase().includes(busca.toLowerCase()) ||
      campo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      campo.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  // Teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em um input que não seja o de busca
      if (
        document.activeElement instanceof HTMLInputElement &&
        document.activeElement !== searchInputRef.current
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < camposFiltrados.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < camposFiltrados.length && onAdicionarCampo) {
            // Por padrão, adiciona a "valores"
            onAdicionarCampo(camposFiltrados[selectedIndex], 'valores');
          }
          break;
        case 'a':
        case 'A':
          if (e.ctrlKey && selectedIndex >= 0 && selectedIndex < camposFiltrados.length && onAdicionarCampo) {
            e.preventDefault();
            onAdicionarCampo(camposFiltrados[selectedIndex], 'agrupar');
          }
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey && selectedIndex >= 0 && selectedIndex < camposFiltrados.length && onAdicionarCampo) {
            e.preventDefault();
            onAdicionarCampo(camposFiltrados[selectedIndex], 'filtros');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camposFiltrados, selectedIndex, onAdicionarCampo]);

  // Reset selected index quando a busca mudar
  useEffect(() => {
    setSelectedIndex(camposFiltrados.length > 0 ? 0 : -1);
  }, [busca, camposFiltrados.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Campos Disponíveis
        </h3>

        {/* Seletor de fonte de dados */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fonte de Dados
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFonteChange('historico')}
              className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  fonteDados === 'historico'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              Histórico
            </button>
            <button
              onClick={() => onFonteChange('base-simulacao')}
              className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  fonteDados === 'base-simulacao'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              Base Simulação
            </button>
          </div>
        </div>

        {/* Dropdown de Base Simulação */}
        {fonteDados === 'base-simulacao' && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selecione a Base
            </label>
            <select
              value={baseSimulacaoId || ''}
              onChange={(e) => {
                const value = e.target.value;
                onBaseSimulacaoChange?.(value ? Number(value) : undefined);
              }}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">Selecione uma base...</option>
              {basesData?.itens?.map((base) => (
                <option key={base.id} value={base.id}>
                  {base.nome} ({base.totalLinhas} linhas)
                </option>
              ))}
            </select>
            {!baseSimulacaoId && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Selecione uma base para começar a análise
              </p>
            )}
          </div>
        )}

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar campos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Lista de campos */}
      <div className="flex-1 overflow-y-auto p-4">
        {camposFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum campo encontrado
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Arraste os campos ou use os botões A/V/F
            </p>
            {camposFiltrados.map((campo, index) => (
              <CampoDraggable
                key={campo.id}
                campo={campo}
                onAdicionarCampo={onAdicionarCampo}
                isSelected={index === selectedIndex}
                onSelect={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer com dica */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
          <strong>Dica:</strong> Arraste campos ou clique nos botões que aparecem ao passar o mouse.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-300">
          <strong>Atalhos:</strong> ↑↓ para navegar, Enter para adicionar a Valores, Ctrl+A para Agrupar, Ctrl+F para Filtros
        </p>
      </div>
    </div>
  );
};
