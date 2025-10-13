import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { NCMTab } from '../../features/cadastros/components/NCMTab';
import { NBSTab } from '../../features/cadastros/components/NBSTab';
import { CSTTab } from '../../features/cadastros/components/CSTTab';
import { ClassificacaoTributariaTab } from '../../features/cadastros/components/ClassificacaoTributariaTab';

type TabType = 'ncm' | 'nbs' | 'cst' | 'classificacao';

export const CadastrosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ncm');

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cadastros</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Gerenciar NCM, NBS, CST e Classificações Tributárias</p>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('ncm')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'ncm'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              NCM
            </button>
            <button
              onClick={() => setActiveTab('nbs')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'nbs'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              NBS
            </button>
            <button
              onClick={() => setActiveTab('cst')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'cst'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              CST
            </button>
            <button
              onClick={() => setActiveTab('classificacao')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'classificacao'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              Classificação Tributária
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'ncm' && <NCMTab />}
          {activeTab === 'nbs' && <NBSTab />}
          {activeTab === 'cst' && <CSTTab />}
          {activeTab === 'classificacao' && <ClassificacaoTributariaTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};
