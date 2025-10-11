import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useValidarXml } from '../hooks/useCalculadora';

export const ValidarXmlForm: React.FC = () => {
  const [tipo, setTipo] = useState('ROC');
  const [subtipo, setSubtipo] = useState('REGIME_GERAL');
  const [xmlContent, setXmlContent] = useState('');
  const [resultado, setResultado] = useState<boolean | null>(null);

  const validarXmlMutation = useValidarXml();

  const handleValidar = async () => {
    if (!xmlContent.trim()) {
      alert('Por favor, insira o conteúdo XML');
      return;
    }

    try {
      const isValido = await validarXmlMutation.mutateAsync({
        tipo,
        subtipo,
        xmlContent,
      });
      setResultado(isValido);
    } catch (error) {
      setResultado(false);
      console.error('Erro ao validar XML:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setXmlContent(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Validar XML do ROC</h2>

      <div className="space-y-4">
        {/* Tipo e Subtipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: 'ROC', label: 'ROC - Registro de Operação de Consumo' },
            ]}
          />

          <Select
            label="Subtipo"
            value={subtipo}
            onChange={(e) => setSubtipo(e.target.value)}
            options={[
              { value: 'REGIME_GERAL', label: 'Regime Geral' },
              { value: 'PEDAGIO', label: 'Pedágio' },
              { value: 'IS_MERCADORIAS', label: 'IS Mercadorias' },
              { value: 'CBS_IBS_MERCADORIAS', label: 'CBS/IBS Mercadorias' },
            ]}
          />
        </div>

        {/* Upload de Arquivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carregar Arquivo XML
          </label>
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </div>

        {/* Textarea para XML */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo XML
          </label>
          <textarea
            value={xmlContent}
            onChange={(e) => setXmlContent(e.target.value)}
            placeholder="Cole aqui o conteúdo XML ou use o botão acima para carregar um arquivo..."
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              font-mono text-sm"
          />
        </div>

        {/* Botão Validar */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleValidar}
            isLoading={validarXmlMutation.isPending}
            disabled={!xmlContent.trim()}
          >
            Validar XML
          </Button>
        </div>

        {/* Resultado */}
        {resultado !== null && (
          <div
            className={`p-4 rounded-lg ${
              resultado
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <div className={`text-2xl mr-3 ${resultado ? 'text-green-600' : 'text-red-600'}`}>
                {resultado ? '✓' : '✗'}
              </div>
              <div>
                <p className={`font-semibold ${resultado ? 'text-green-800' : 'text-red-800'}`}>
                  {resultado ? 'XML Válido' : 'XML Inválido'}
                </p>
                <p className={`text-sm ${resultado ? 'text-green-700' : 'text-red-700'}`}>
                  {resultado
                    ? 'O XML está em conformidade com o schema do ROC.'
                    : 'O XML possui erros de validação. Verifique o conteúdo e tente novamente.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {validarXmlMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Erro ao validar XML. Verifique se o conteúdo está correto e tente novamente.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
