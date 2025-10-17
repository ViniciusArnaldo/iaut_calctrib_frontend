import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, FileImage, Download } from 'lucide-react';

interface ModalExportarProps {
  isOpen: boolean;
  onClose: () => void;
  onExportar: (formato: 'xlsx' | 'csv' | 'png') => Promise<void>;
  nomeAnalise: string;
}

export const ModalExportar: React.FC<ModalExportarProps> = ({
  isOpen,
  onClose,
  onExportar,
  nomeAnalise,
}) => {
  const [formato, setFormato] = useState<'xlsx' | 'csv' | 'png'>('xlsx');
  const [exportando, setExportando] = useState(false);

  if (!isOpen) return null;

  const handleExportar = async () => {
    setExportando(true);
    try {
      await onExportar(formato);
      onClose();
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setExportando(false);
    }
  };

  const opcoesFormato = [
    {
      id: 'xlsx',
      label: 'Excel (.xlsx)',
      descricao: 'Planilha com formatação e fórmulas',
      icon: FileSpreadsheet,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'csv',
      label: 'CSV (.csv)',
      descricao: 'Arquivo de texto separado por vírgulas',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'png',
      label: 'Imagem (.png)',
      descricao: 'Captura do gráfico ou tabela atual',
      icon: FileImage,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exportar Análise
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            disabled={exportando}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Escolha o formato para exportar: <strong>{nomeAnalise || 'Análise sem título'}</strong>
          </p>

          <div className="space-y-3">
            {opcoesFormato.map((opcao) => {
              const Icon = opcao.icon;
              return (
                <button
                  key={opcao.id}
                  onClick={() => setFormato(opcao.id as 'xlsx' | 'csv' | 'png')}
                  className={`
                    w-full flex items-start p-4 border-2 rounded-lg transition-all
                    ${
                      formato === opcao.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  disabled={exportando}
                >
                  <Icon className={`w-6 h-6 ${opcao.color} mr-3 flex-shrink-0`} />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {opcao.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {opcao.descricao}
                    </p>
                  </div>
                  {formato === opcao.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={exportando}
          >
            Cancelar
          </button>
          <button
            onClick={handleExportar}
            disabled={exportando}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {exportando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
