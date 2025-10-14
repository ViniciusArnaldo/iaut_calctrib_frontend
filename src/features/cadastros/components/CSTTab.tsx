import React, { useState } from 'react';
import {
  Search,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import {
  useCSTList,
  useImportCSTFromGoverno
} from '../hooks/useCST';
import type { CSTFilters } from '../types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useAuth } from '../../auth/hooks/useAuth';

export const CSTTab: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<CSTFilters>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data, isLoading, refetch } = useCSTList(filters);
  const importMutation = useImportCSTFromGoverno();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters({ ...filters, search: undefined, page: 1 });
  };

  const handleImportClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = async () => {
    setShowConfirmDialog(false);
    await importMutation.mutateAsync();
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Sincronização Automática"
        message="Deseja sincronizar os CSTs (Situações Tributárias CBS/IBS) com o governo? Isso pode levar alguns minutos e irá atualizar todos os registros."
        confirmText="Sincronizar"
        cancelText="Cancelar"
        type="info"
        onConfirm={handleConfirmImport}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código ou descrição..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {/* Action Buttons - Only for ADMIN */}
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2">
            <button
              onClick={handleImportClick}
              disabled={importMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Sincronização Automática
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : !data?.itens.length ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                data.itens.map((cst) => (
                  <tr key={cst.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {cst.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="max-w-md truncate">{cst.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cst.ativo
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {cst.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(data.meta.page - 1)}
                disabled={data.meta.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(data.meta.page + 1)}
                disabled={data.meta.page === data.meta.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando{' '}
                  <span className="font-medium">
                    {(data.meta.page - 1) * data.meta.limit + 1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium">
                    {Math.min(data.meta.page * data.meta.limit, data.meta.total)}
                  </span>{' '}
                  de <span className="font-medium">{data.meta.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(data.meta.page - 1)}
                    disabled={data.meta.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(data.meta.page + 1)}
                    disabled={data.meta.page === data.meta.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
