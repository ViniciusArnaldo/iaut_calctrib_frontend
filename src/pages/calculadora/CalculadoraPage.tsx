import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { RegimeGeralForm } from '../../features/calculadora/components/RegimeGeralForm';
import { PedagioForm } from '../../features/calculadora/components/PedagioForm';
import { BaseCalculoISForm } from '../../features/calculadora/components/BaseCalculoISForm';
import { BaseCalculoCBSIBSForm } from '../../features/calculadora/components/BaseCalculoCBSIBSForm';
import { ResultadoCard } from '../../features/calculadora/components/ResultadoCard';
import type { ResultadoCalculoRegimeGeral } from '../../features/calculadora/types/calculadora.types';

type TipoCalculo = 'regime-geral' | 'pedagio' | 'base-is' | 'base-cbs-ibs';

export const CalculadoraPage: React.FC = () => {
  const [tipoCalculo, setTipoCalculo] = useState<TipoCalculo>('regime-geral');
  const [resultado, setResultado] = useState<ResultadoCalculoRegimeGeral | null>(null);

  const handleSuccess = (novoResultado: ResultadoCalculoRegimeGeral) => {
    setResultado(novoResultado);
    // Scroll suave para o resultado
    setTimeout(() => {
      document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNovoCalculo = () => {
    setResultado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de Tributos</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => {
                setTipoCalculo('regime-geral');
                setResultado(null);
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  tipoCalculo === 'regime-geral'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Regime Geral
            </button>
            <button
              onClick={() => {
                setTipoCalculo('pedagio');
                setResultado(null);
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  tipoCalculo === 'pedagio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Pedágio
            </button>
            <button
              onClick={() => {
                setTipoCalculo('base-is');
                setResultado(null);
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  tipoCalculo === 'base-is'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Base IS Mercadorias
            </button>
            <button
              onClick={() => {
                setTipoCalculo('base-cbs-ibs');
                setResultado(null);
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  tipoCalculo === 'base-cbs-ibs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Base CBS/IBS Mercadorias
            </button>
          </nav>
        </div>

        {/* Formulários */}
        <div className="mb-8">
          {tipoCalculo === 'regime-geral' && <RegimeGeralForm onSuccess={handleSuccess} />}
          {tipoCalculo === 'pedagio' && <PedagioForm onSuccess={handleSuccess} />}
          {tipoCalculo === 'base-is' && <BaseCalculoISForm onSuccess={handleSuccess} />}
          {tipoCalculo === 'base-cbs-ibs' && <BaseCalculoCBSIBSForm onSuccess={handleSuccess} />}
        </div>

        {/* Resultado */}
        {resultado && (
          <div id="resultado" className="mb-8">
            <ResultadoCard resultado={resultado} />

            {/* Botão para novo cálculo */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleNovoCalculo}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Realizar Novo Cálculo
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
