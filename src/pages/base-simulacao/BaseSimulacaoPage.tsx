import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { AlertCircle } from 'lucide-react';
import { UploadExcelCsv } from '../../features/base-simulacao/components/UploadExcelCsv';
import { TabelaLinhas } from '../../features/base-simulacao/components/TabelaLinhas';
import {
  useCriarBase,
  useAdicionarLinhas,
  useAtualizarLinha,
  useDeletarLinha,
  useProcessarBase,
  useValidarNCMs,
  useBases,
  useBase,
} from '../../features/base-simulacao/hooks/useBaseSimulacao';
import type { LinhaBaseSimulacao } from '../../features/base-simulacao/types/base-simulacao.types';
import { downloadTemplateExcel, downloadTemplateCSV } from '../../features/base-simulacao/utils/templateGenerator';

export const BaseSimulacaoPage: React.FC = () => {
  const [nomeBase, setNomeBase] = useState('');
  const [descricaoBase, setDescricaoBase] = useState('');
  const [baseAtualId, setBaseAtualId] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para modais de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Hooks
  const { data: bases, isLoading: loadingBases } = useBases();
  const { data: baseAtual, isLoading: loadingBase } = useBase(baseAtualId!);
  const criarBase = useCriarBase();
  const adicionarLinhas = useAdicionarLinhas();
  const atualizarLinha = useAtualizarLinha();
  const deletarLinha = useDeletarLinha();
  const processar = useProcessarBase();
  const validarNCMs = useValidarNCMs();

  const isProcessing = baseAtual?.status === 'PROCESSANDO';

  // ==================== HANDLERS ====================

  const handleCriarBase = async () => {
    setFeedback(null);

    if (!nomeBase.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, informe um nome para a base' });
      return;
    }

    try {
      const novaBase = await criarBase.mutateAsync({
        nome: nomeBase,
        descricao: descricaoBase || undefined,
      });

      setBaseAtualId(novaBase.id);
      setNomeBase('');
      setDescricaoBase('');
      setFeedback({ type: 'success', message: 'Base criada com sucesso!' });

      // Limpar feedback após 3 segundos
      setTimeout(() => setFeedback(null), 3000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao criar base. Tente novamente.' });
    }
  };

  const handleSelecionarBase = (baseId: number) => {
    setBaseAtualId(baseId);
  };

  const handleDataParsed = async (linhas: Partial<LinhaBaseSimulacao>[]) => {
    if (!baseAtualId) {
      setFeedback({ type: 'error', message: 'Erro: Nenhuma base selecionada' });
      return;
    }

    try {
      // Salvar DIRETO no banco ao importar
      await adicionarLinhas.mutateAsync({
        baseId: baseAtualId,
        dto: {
          linhas: linhas.map((linha) => ({
            tipoCalculadora: linha.tipoCalculadora!,
            dadosEntrada: linha as Record<string, any>,
          })),
        },
      });

      setShowUpload(false);
      setFeedback({ type: 'success', message: `${linhas.length} linhas importadas e salvas com sucesso!` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: 'Erro ao salvar linhas: ' + (error.message || 'Erro desconhecido') });
    }
  };

  const handleAtualizarLinha = async (linhaId: number, dadosAtualizados: any) => {
    if (!baseAtualId) return;

    try {
      await atualizarLinha.mutateAsync({
        baseId: baseAtualId,
        linhaId,
        dadosEntrada: dadosAtualizados,
      });
      setFeedback({ type: 'success', message: 'Linha atualizada com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: 'Erro ao atualizar linha: ' + (error.message || 'Erro desconhecido') });
    }
  };

  const handleDeletarLinha = async (linhaId: number) => {
    if (!baseAtualId) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Deletar Linha',
      message: 'Deseja realmente deletar esta linha?',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deletarLinha.mutateAsync({ baseId: baseAtualId, linhaId });
          setFeedback({ type: 'success', message: 'Linha deletada com sucesso!' });
          setTimeout(() => setFeedback(null), 3000);
        } catch (error: any) {
          setFeedback({ type: 'error', message: 'Erro ao deletar linha: ' + (error.message || 'Erro desconhecido') });
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleDeletarMultiplasLinhas = async (linhaIds: number[]) => {
    if (!baseAtualId) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Deletar Linhas',
      message: `Deseja realmente deletar ${linhaIds.length} linha(s) selecionada(s)? Esta ação não pode ser desfeita.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          // Deletar todas as linhas em sequência
          await Promise.all(
            linhaIds.map((linhaId) => deletarLinha.mutateAsync({ baseId: baseAtualId, linhaId }))
          );
          setFeedback({ type: 'success', message: `${linhaIds.length} linha(s) deletada(s) com sucesso!` });
          setTimeout(() => setFeedback(null), 3000);
        } catch (error: any) {
          setFeedback({ type: 'error', message: 'Erro ao deletar linhas: ' + (error.message || 'Erro desconhecido') });
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleAtualizarMultiplasLinhas = async (updates: Array<{ id: number; dados: Partial<any> }>) => {
    if (!baseAtualId) return;

    try {
      // Atualizar todas as linhas em sequência
      await Promise.all(
        updates.map(({ id, dados }) =>
          atualizarLinha.mutateAsync({
            baseId: baseAtualId,
            linhaId: id,
            dadosEntrada: dados,
          })
        )
      );
      setFeedback({ type: 'success', message: `${updates.length} linha(s) atualizada(s) com sucesso!` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error: any) {
      setFeedback({ type: 'error', message: 'Erro ao atualizar linhas: ' + (error.message || 'Erro desconhecido') });
    }
  };

  const handleValidarNCMs = async () => {
    if (!baseAtualId) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Validar NCMs',
      message: 'Deseja validar os NCMs de todas as linhas? Isso irá comparar os NCMs antigos com a base atualizada do governo.',
      type: 'info',
      onConfirm: async () => {
        try {
          const resultado = await validarNCMs.mutateAsync(baseAtualId);
          setFeedback({
            type: 'success',
            message: `Validação concluída: ${resultado.totalEncontrados} NCMs encontrados, ${resultado.totalNaoEncontrados} não encontrados`
          });
          setTimeout(() => setFeedback(null), 5000);
        } catch (error: any) {
          setFeedback({ type: 'error', message: 'Erro ao validar NCMs: ' + (error.message || 'Erro desconhecido') });
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleProcessar = async () => {
    if (!baseAtualId) {
      setFeedback({ type: 'error', message: 'Selecione uma base primeiro' });
      return;
    }

    if (!baseAtual?.linhas || baseAtual.linhas.length === 0) {
      setFeedback({ type: 'error', message: 'A base não possui linhas para processar' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Processar Base',
      message: `Deseja processar ${baseAtual.linhas.length} linhas? O processamento será feito em lotes de 100 linhas em paralelo.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await processar.mutateAsync({ baseId: baseAtualId });
          setFeedback({ type: 'success', message: 'Processamento iniciado! As linhas serão calculadas em segundo plano.' });
          setTimeout(() => setFeedback(null), 5000);
        } catch (error: any) {
          setFeedback({ type: 'error', message: 'Erro ao iniciar processamento: ' + (error.message || 'Erro desconhecido') });
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // ==================== RENDER ====================

  return (
    <DashboardLayout>
      {/* Modal de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <div>
        {!baseAtualId ? (
          // ==================== TELA DE LISTAGEM ====================
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Base Simulação</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Importe e processe múltiplos cálculos de uma vez
                </p>
              </div>
            </div>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Minhas Bases
              </h3>

              {/* Criar Nova Base */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Nome da Base"
                    value={nomeBase}
                    onChange={(e) => setNomeBase(e.target.value)}
                    placeholder="Ex: NFs Janeiro 2025"
                  />
                  <Input
                    label="Descrição (opcional)"
                    value={descricaoBase}
                    onChange={(e) => setDescricaoBase(e.target.value)}
                    placeholder="Descrição..."
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded-lg border ${
                      feedback.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        feedback.type === 'success'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {feedback.message}
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    onClick={handleCriarBase}
                    disabled={criarBase.isPending}
                    className="px-8"
                  >
                    {criarBase.isPending ? 'Criando...' : 'Nova Base'}
                  </Button>
                </div>
              </div>

              {/* Lista de Bases */}
              <div className="space-y-3">
                {loadingBases ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando bases...</p>
                  </div>
                ) : bases?.itens && bases.itens.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bases.itens.map((base) => (
                      <div
                        key={base.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {base.nome}
                            </h4>
                            {base.descricao && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                                {base.descricao}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              base.status === 'PROCESSANDO'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                : base.status === 'PROCESSADA'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : base.status === 'ERRO'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {base.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{base.totalLinhas}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sucesso</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{base.linhasComSucesso}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Erro</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">{base.linhasComErro}</p>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => handleSelecionarBase(base.id)}
                          className="w-full"
                        >
                          Abrir Base
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nenhuma base criada ainda
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Crie sua primeira base para começar
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          // ==================== TELA DE DETALHES ====================
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setBaseAtualId(null)}
                >
                  ← Voltar
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {baseAtual?.nome || 'Carregando...'}
                  </h1>
                  {baseAtual?.descricao && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {baseAtual.descricao}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
                {/* Estatísticas e Ações em uma linha */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Estatísticas - 5 colunas */}
                  {baseAtual && (
                    <div className="lg:col-span-5 grid grid-cols-4 gap-3">
                      <Card className="p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {baseAtual.totalLinhas}
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Sucesso</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {baseAtual.linhasComSucesso}
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Erro</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                          {baseAtual.linhasComErro}
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Status</p>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          {baseAtual.status}
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* Ações - 7 colunas */}
                  <Card className="lg:col-span-7 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Ações
                      </h3>
                      <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={downloadTemplateExcel}
                        size="sm"
                      >
                        Template Excel
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={downloadTemplateCSV}
                        size="sm"
                      >
                        Template CSV
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setShowUpload(!showUpload)}
                        disabled={isProcessing}
                      >
                        Importar Excel/CSV
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleValidarNCMs}
                        disabled={isProcessing || validarNCMs.isPending || !baseAtual?.linhas || baseAtual.linhas.length === 0}
                      >
                        {validarNCMs.isPending ? 'Validando...' : 'Validar NCMs'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleProcessar}
                        disabled={isProcessing || !baseAtual?.linhas || baseAtual.linhas.length === 0}
                      >
                        {isProcessing ? 'Processando...' : 'Processar Base'}
                      </Button>
                      </div>
                    </div>

                    {/* Upload Area */}
                    {showUpload && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <UploadExcelCsv
                          onDataParsed={handleDataParsed}
                          isUploading={adicionarLinhas.isPending}
                        />
                      </div>
                    )}

                    {/* Feedback de importação */}
                    {feedback && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div
                          className={`p-2 rounded-lg border ${
                            feedback.type === 'success'
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }`}
                        >
                          <p
                            className={`text-xs ${
                              feedback.type === 'success'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {feedback.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Tabela de Linhas */}
                <Card className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Linhas da Base ({baseAtual?.totalLinhas || 0})
                  </h3>
                  {loadingBase ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
                    </div>
                  ) : (
                    <TabelaLinhas
                      linhas={baseAtual?.linhas || []}
                      onUpdate={handleAtualizarLinha}
                      onUpdateMultiple={handleAtualizarMultiplasLinhas}
                      onDelete={handleDeletarLinha}
                      onDeleteMultiple={handleDeletarMultiplasLinhas}
                      isProcessing={isProcessing}
                    />
                  )}
                </Card>
              </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
