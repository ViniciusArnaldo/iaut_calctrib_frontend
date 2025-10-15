import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface IntervaloPreenchimento {
  id: number;
  linhaInicio: number;
  linhaFim: number;
  valor: string;
  filtroCfop?: string; // Filtro opcional por CFOP
}

interface ModalPreenchimentoLoteProps {
  isOpen: boolean;
  onClose: () => void;
  campo: string;
  totalLinhas: number;
  onConfirm: (intervalos: IntervaloPreenchimento[]) => void;
}

export const ModalPreenchimentoLote: React.FC<ModalPreenchimentoLoteProps> = ({
  isOpen,
  onClose,
  campo,
  totalLinhas,
  onConfirm,
}) => {
  const [intervalos, setIntervalos] = useState<IntervaloPreenchimento[]>([
    { id: 1, linhaInicio: 1, linhaFim: totalLinhas, valor: '', filtroCfop: '' },
  ]);

  if (!isOpen) return null;

  const adicionarIntervalo = () => {
    const novoId = Math.max(...intervalos.map(i => i.id), 0) + 1;
    setIntervalos([
      ...intervalos,
      { id: novoId, linhaInicio: 1, linhaFim: totalLinhas, valor: '', filtroCfop: '' },
    ]);
  };

  const removerIntervalo = (id: number) => {
    if (intervalos.length > 1) {
      setIntervalos(intervalos.filter(i => i.id !== id));
    }
  };

  const atualizarIntervalo = (id: number, field: keyof IntervaloPreenchimento, value: any) => {
    setIntervalos(
      intervalos.map(i =>
        i.id === id ? { ...i, [field]: value } : i
      )
    );
  };

  const handleConfirmar = () => {
    // Validar intervalos
    const intervalosValidos = intervalos.filter(i => {
      // Deve ter valor preenchido
      if (i.valor.trim() === '') return false;

      // Se tiver filtro CFOP, não precisa validar linhas
      if (i.filtroCfop && i.filtroCfop.trim() !== '') return true;

      // Senão, validar intervalo de linhas
      return i.linhaInicio > 0 && i.linhaFim > 0 && i.linhaInicio <= i.linhaFim;
    });

    if (intervalosValidos.length === 0) {
      alert('Por favor, preencha pelo menos um intervalo válido com valor e filtro CFOP ou intervalo de linhas');
      return;
    }

    onConfirm(intervalosValidos);
    onClose();
  };

  const getNomeCampo = (campo: string): string => {
    const nomes: Record<string, string> = {
      uf: 'UF',
      municipio: 'Município',
      item: 'Item',
      cfop: 'CFOP',
      ncm: 'NCM',
      nbs: 'NBS',
      cst: 'CST',
      baseCalculo: 'Base de Cálculo',
      quantidade: 'Quantidade',
      unidadeMedida: 'Unidade de Medida',
      classificacaoTributaria: 'Classificação Tributária',
    };
    return nomes[campo] || campo;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Preencher em Lote: {getNomeCampo(campo)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Define os intervalos de linhas e os valores que deseja preencher. Você pode filtrar por CFOP específico (opcional) e adicionar múltiplos intervalos.
          </p>

          {intervalos.map((intervalo, index) => (
            <div
              key={intervalo.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intervalo {index + 1}
                </span>
                {intervalos.length > 1 && (
                  <button
                    onClick={() => removerIntervalo(intervalo.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>

              {/* Filtro por CFOP */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtro por CFOP (opcional)
                </label>
                <input
                  type="text"
                  value={intervalo.filtroCfop || ''}
                  onChange={(e) =>
                    atualizarIntervalo(intervalo.id, 'filtroCfop', e.target.value)
                  }
                  placeholder="Ex: 5101 (deixe vazio para usar intervalo de linhas)"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Linha Início */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Linha Início
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalLinhas}
                    value={intervalo.linhaInicio}
                    onChange={(e) =>
                      atualizarIntervalo(intervalo.id, 'linhaInicio', Number(e.target.value))
                    }
                    disabled={!!intervalo.filtroCfop}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Linha Fim */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Linha Fim
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalLinhas}
                    value={intervalo.linhaFim}
                    onChange={(e) =>
                      atualizarIntervalo(intervalo.id, 'linhaFim', Number(e.target.value))
                    }
                    disabled={!!intervalo.filtroCfop}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={intervalo.valor}
                    onChange={(e) =>
                      atualizarIntervalo(intervalo.id, 'valor', e.target.value)
                    }
                    placeholder="Digite o valor"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                {intervalo.filtroCfop ? (
                  <>Preencher todas as linhas com CFOP "{intervalo.filtroCfop}" com o valor "{intervalo.valor || '...'}"</>
                ) : (
                  <>Preencher linhas {intervalo.linhaInicio} até {intervalo.linhaFim} com "{intervalo.valor || '...'}"</>
                )}
              </div>
            </div>
          ))}

          {/* Botão Adicionar Intervalo */}
          <button
            onClick={adicionarIntervalo}
            className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Intervalo
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmar}>
            Confirmar Preenchimento
          </Button>
        </div>
      </div>
    </div>
  );
};
