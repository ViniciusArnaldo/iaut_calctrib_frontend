import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { LinhaBaseSimulacao, TipoCalculadora } from '../types/base-simulacao.types';
import * as XLSX from 'xlsx';

interface UploadExcelCsvProps {
  onDataParsed: (linhas: Partial<LinhaBaseSimulacao>[]) => void;
  isUploading?: boolean;
}

export const UploadExcelCsv: React.FC<UploadExcelCsvProps> = ({ onDataParsed, isUploading = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validar tipo de arquivo
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Por favor, selecione um arquivo CSV ou Excel (.xlsx, .xls)');
      return;
    }

    setFile(file);
  };

  const processFile = async () => {
    if (!file) return;

    setError(null);

    try {
      // Ler arquivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Usar XLSX para ler o arquivo (funciona com CSV, XLS e XLSX)
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Pegar a primeira aba
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Converter para JSON (cada linha vira um objeto com as colunas como propriedades)
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (data.length === 0) {
        setError('O arquivo não contém dados');
        return;
      }

      // Validar se tem coluna tipoCalculadora
      const firstRow = data[0];
      const hastipoCalculadora =
        'tipoCalculadora' in firstRow ||
        'TipoCalculadora' in firstRow ||
        'tipocalculadora' in firstRow ||
        'TIPOCALCULADORA' in firstRow;

      if (!hastipoCalculadora) {
        setError('O arquivo deve conter uma coluna "tipoCalculadora"');
        return;
      }

      // Processar linhas de dados
      const linhas: Partial<LinhaBaseSimulacao>[] = data.map((row) => {
        // Normalizar o nome da coluna tipoCalculadora
        const tipoCalculadora =
          row.tipoCalculadora ||
          row.TipoCalculadora ||
          row.tipocalculadora ||
          row.TIPOCALCULADORA;

        // Criar objeto com todos os campos do Excel
        const linha: any = {
          tipoCalculadora: tipoCalculadora as TipoCalculadora,
        };

        // Copiar todos os outros campos
        Object.keys(row).forEach((key) => {
          if (key.toLowerCase() !== 'tipocalculadora') {
            linha[key] = row[key];
          }
        });

        return linha;
      });

      if (linhas.length === 0) {
        setError('Nenhuma linha válida foi encontrada no arquivo');
        return;
      }

      console.log('Linhas processadas:', linhas);
      onDataParsed(linhas);
      setFile(null);
    } catch (err) {
      console.error('Erro ao processar arquivo:', err);
      setError('Erro ao processar arquivo. Verifique o formato.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Arraste e solte seu arquivo aqui ou
          </p>
          <label className="cursor-pointer">
            <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              clique para selecionar
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Formatos aceitos: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      ) : (
        // Arquivo Selecionado
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="mt-4 flex space-x-2">
            <Button
              variant="primary"
              onClick={processFile}
              className="flex-1"
              disabled={isUploading}
            >
              {isUploading ? 'Salvando...' : 'Importar e Salvar'}
            </Button>
            <Button variant="secondary" onClick={removeFile} disabled={isUploading}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Formato do Arquivo
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <li>• A primeira linha deve conter os nomes das colunas</li>
          <li>• Obrigatório: coluna "tipoCalculadora" com valores: REGIME_GERAL, PEDAGIO, BASE_CALCULO_IS ou BASE_CALCULO_CBS_IBS</li>
          <li>• Outras colunas devem corresponder aos campos necessários para cada tipo de calculadora</li>
          <li>• Use vírgula (,) como separador no CSV</li>
        </ul>
      </div>
    </div>
  );
};
