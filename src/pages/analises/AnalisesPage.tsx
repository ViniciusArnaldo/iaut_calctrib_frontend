import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { TemplateCard } from '../../features/analises/components/TemplateCard';
import { getTemplatesPopulares } from '../../features/analises/utils/templates';
import { ROUTES } from '../../utils/constants';
import type { TemplateAnalise } from '../../features/analises/types/analises.types';

export const AnalisesPage: React.FC = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  // Templates populares
  const templatesPopulares = getTemplatesPopulares();

  // Filtrar templates pela busca
  const templatesFiltrados = busca
    ? templatesPopulares.filter(
        (t) =>
          t.nome.toLowerCase().includes(busca.toLowerCase()) ||
          t.descricao.toLowerCase().includes(busca.toLowerCase())
      )
    : templatesPopulares;

  // Handlers
  const handleNovaAnalise = () => {
    navigate(ROUTES.ANALISES_NOVA);
  };

  const handleUsarTemplate = (template: TemplateAnalise) => {
    // Navega para criação passando o template via state
    navigate(ROUTES.ANALISES_NOVA, { state: { template } });
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análises</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Escolha um template pronto ou crie análises personalizadas dos seus dados tributários
            </p>
          </div>

          <button
            onClick={handleNovaAnalise}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Análise
          </button>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Templates de Análises
            </h2>
            {busca && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {templatesFiltrados.length} resultado(s) encontrado(s)
              </p>
            )}
          </div>

          {templatesFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templatesFiltrados.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleUsarTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tente buscar com outros termos ou crie uma análise personalizada
              </p>
              <button
                onClick={handleNovaAnalise}
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Análise Personalizada
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
