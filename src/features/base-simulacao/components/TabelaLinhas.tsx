import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Loader, Save, X, AlertCircle, Edit, Trash } from 'lucide-react';
import { ModalPreenchimentoLote } from './ModalPreenchimentoLote';

interface Linha {
  id: number;
  numeroLinha: number;
  tipoCalculadora: string;
  status: 'PENDENTE' | 'PROCESSANDO' | 'SUCESSO' | 'ERRO';
  mensagemErro?: string;
  erroValidacao?: string; // Erro de validação (ex: NCM não encontrado)

  // Campos de entrada
  uf?: string;
  municipio?: number;
  dataOperacao?: string;
  item?: number;
  cfop?: string;
  ncm?: string;
  ncmAntigo?: string;
  nbs?: string;
  nbsAntigo?: string;
  cst?: string;
  cstAntigo?: string;
  baseCalculo?: number;
  quantidade?: number;
  unidadeMedida?: string;
  classificacaoTributaria?: string;

  // Valores calculados
  valorTotal?: number;
  valorCBS?: number;
  valorIBS?: number;
  valorIS?: number;
}

interface TabelaLinhasProps {
  linhas: Linha[];
  onDelete?: (linhaId: number) => void;
  onDeleteMultiple?: (linhaIds: number[]) => void;
  onUpdate?: (linhaId: number, dadosAtualizados: Partial<Linha>) => void;
  onUpdateMultiple?: (updates: Array<{ id: number; dados: Partial<Linha> }>) => void;
  isProcessing?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'SUCESSO':
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case 'ERRO':
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    case 'PROCESSANDO':
      return <Loader className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
  }
};

const formatCurrency = (value?: number | string | object) => {
  // Se for null ou undefined, retorna '-'
  if (value === null || value === undefined) return '-';

  // Converter Decimal/objeto do Prisma para number
  let numValue: number;
  if (typeof value === 'object') {
    // Prisma Decimal vem como objeto, precisa converter
    numValue = Number(value);
  } else if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    numValue = value;
  }

  // Se não for um número válido, retorna '-'
  if (isNaN(numValue)) return '-';

  // Formatar como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('pt-BR');
  } catch {
    return dateString;
  }
};

export const TabelaLinhas: React.FC<TabelaLinhasProps> = ({
  linhas,
  onDeleteMultiple,
  onUpdateMultiple,
  isProcessing
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editedData, setEditedData] = useState<Map<number, Partial<Linha>>>(new Map());
  const [modalPreenchimento, setModalPreenchimento] = useState<{
    isOpen: boolean;
    campo: string;
  }>({ isOpen: false, campo: '' });

  // Toggle modo de edição - quando ativa, todas as linhas ficam editáveis
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Salvar todas as mudanças ao sair do modo de edição
      if (editedData.size > 0 && onUpdateMultiple) {
        const updates = Array.from(editedData.entries()).map(([id, dadosEditados]) => {
          // Encontrar a linha original para fazer merge
          const linhaOriginal = linhas.find(l => l.id === id);
          if (!linhaOriginal) return null;

          // Merge: dados originais + dados editados
          const dadosCompletos = {
            uf: dadosEditados.uf !== undefined ? dadosEditados.uf : linhaOriginal.uf,
            municipio: dadosEditados.municipio !== undefined ? dadosEditados.municipio : linhaOriginal.municipio,
            dataOperacao: dadosEditados.dataOperacao !== undefined ? dadosEditados.dataOperacao : linhaOriginal.dataOperacao,
            item: dadosEditados.item !== undefined ? dadosEditados.item : linhaOriginal.item,
            cfop: dadosEditados.cfop !== undefined ? dadosEditados.cfop : linhaOriginal.cfop,
            ncm: dadosEditados.ncm !== undefined ? dadosEditados.ncm : linhaOriginal.ncm,
            nbs: dadosEditados.nbs !== undefined ? dadosEditados.nbs : linhaOriginal.nbs,
            cst: dadosEditados.cst !== undefined ? dadosEditados.cst : linhaOriginal.cst,
            baseCalculo: dadosEditados.baseCalculo !== undefined ? dadosEditados.baseCalculo : linhaOriginal.baseCalculo,
            quantidade: dadosEditados.quantidade !== undefined ? dadosEditados.quantidade : linhaOriginal.quantidade,
            unidadeMedida: dadosEditados.unidadeMedida !== undefined ? dadosEditados.unidadeMedida : linhaOriginal.unidadeMedida,
            classificacaoTributaria: dadosEditados.classificacaoTributaria !== undefined ? dadosEditados.classificacaoTributaria : linhaOriginal.classificacaoTributaria,
          };

          return {
            id,
            dados: dadosCompletos
          };
        }).filter(Boolean); // Remove null

        onUpdateMultiple(updates as Array<{ id: number; dados: Partial<any> }>);
      }
      setEditedData(new Map());
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedData(new Map());
  };

  // Selecionar/deselecionar linha clicando nela
  const handleRowClick = (linhaId: number, event: React.MouseEvent) => {
    // Não selecionar se estiver clicando em um input
    if ((event.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    const newSelected = new Set(selectedIds);
    if (newSelected.has(linhaId)) {
      newSelected.delete(linhaId);
    } else {
      newSelected.add(linhaId);
    }
    setSelectedIds(newSelected);
  };

  // Deletar linhas selecionadas
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;

    if (onDeleteMultiple) {
      onDeleteMultiple(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  // Limpar seleção
  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Atualizar campo de uma linha específica
  const handleFieldChange = (linhaId: number, field: keyof Linha, value: any) => {
    setEditedData((prev) => {
      const newMap = new Map(prev);
      const linhaData = newMap.get(linhaId) || {};
      newMap.set(linhaId, { ...linhaData, [field]: value });
      return newMap;
    });
  };

  // Obter dados de uma linha (editados ou originais)
  const getLinhaData = (linha: Linha): Linha => {
    if (isEditMode && editedData.has(linha.id)) {
      return { ...linha, ...editedData.get(linha.id) };
    }
    return linha;
  };

  // Abrir modal de preenchimento em lote
  const handleOpenModalPreenchimento = (campo: string) => {
    setModalPreenchimento({ isOpen: true, campo });
  };

  // Confirmar preenchimento em lote
  const handleConfirmarPreenchimento = (intervalos: Array<{ id: number; linhaInicio: number; linhaFim: number; valor: string; filtroCfop?: string }>) => {
    const novoEditedData = new Map(editedData);

    intervalos.forEach((intervalo) => {
      linhas.forEach((linha) => {
        // Verificar se deve processar esta linha
        let deveProcessar = false;

        if (intervalo.filtroCfop && intervalo.filtroCfop.trim() !== '') {
          // Filtrar por CFOP: apenas linhas com o CFOP especificado
          deveProcessar = linha.cfop === intervalo.filtroCfop;
        } else {
          // Filtrar por intervalo de linhas
          deveProcessar = linha.numeroLinha >= intervalo.linhaInicio && linha.numeroLinha <= intervalo.linhaFim;
        }

        if (deveProcessar) {
          const linhaData = novoEditedData.get(linha.id) || {};

          // Converter valor conforme o tipo do campo
          let valorConvertido: any = intervalo.valor;
          if (modalPreenchimento.campo === 'municipio' || modalPreenchimento.campo === 'item') {
            valorConvertido = intervalo.valor ? Number(intervalo.valor) : null;
          } else if (modalPreenchimento.campo === 'baseCalculo' || modalPreenchimento.campo === 'quantidade') {
            valorConvertido = intervalo.valor ? Number(intervalo.valor) : null;
          } else if (modalPreenchimento.campo === 'cfop') {
            valorConvertido = intervalo.valor || null;
          }

          novoEditedData.set(linha.id, {
            ...linhaData,
            [modalPreenchimento.campo]: valorConvertido,
          });
        }
      });
    });

    setEditedData(novoEditedData);
    setModalPreenchimento({ isOpen: false, campo: '' });

    // Ativar modo de edição se não estiver ativo
    if (!isEditMode) {
      setIsEditMode(true);
    }
  };

  if (linhas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma linha adicionada ainda. Importe um arquivo Excel/CSV para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Modal de Preenchimento em Lote */}
      <ModalPreenchimentoLote
        isOpen={modalPreenchimento.isOpen}
        campo={modalPreenchimento.campo}
        totalLinhas={linhas.length}
        onClose={() => setModalPreenchimento({ isOpen: false, campo: '' })}
        onConfirm={handleConfirmarPreenchimento}
      />

      {/* Menu Flutuante Horizontal - Aparece apenas quando há itens selecionados ou está em modo de edição */}
      {(selectedIds.size > 0 || isEditMode) && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col gap-3">
              {/* Informação de seleção (se houver) */}
              {selectedIds.size > 0 && (
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedIds.size} selecionada(s)
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Limpar
                  </button>
                </div>
              )}

              {/* Botões Horizontais */}
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    {/* Modo Edição: Salvar - Cancelar - Deletar */}
                    <button
                      onClick={handleToggleEditMode}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Salvar alterações"
                    >
                      <Save className="w-4 h-4" />
                      <span className="font-medium text-sm">Salvar</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
                      title="Cancelar edição"
                    >
                      <X className="w-4 h-4" />
                      <span className="font-medium text-sm">Cancelar</span>
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={isProcessing || selectedIds.size === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Deletar selecionadas"
                    >
                      <Trash className="w-4 h-4" />
                      <span className="font-medium text-sm">Deletar</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Modo Normal: Editar - Deletar */}
                    <button
                      onClick={handleToggleEditMode}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Modo de edição"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="font-medium text-sm">Editar</span>
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={isProcessing || selectedIds.size === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Deletar selecionadas"
                    >
                      <Trash className="w-4 h-4" />
                      <span className="font-medium text-sm">Deletar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('uf')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                UF
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('municipio')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                Município
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data</th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('item')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                Item
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('cfop')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                CFOP
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NCM Antigo</th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('ncm')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                NCM
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NBS Antigo</th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('nbs')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                NBS
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CST Antigo</th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('cst')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                CST
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('baseCalculo')}
                className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                Base Cálculo
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('quantidade')}
                className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                Qtd
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('unidadeMedida')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                UN
              </th>
              <th
                onDoubleClick={() => handleOpenModalPreenchimento('classificacaoTributaria')}
                className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Duplo clique para preencher em lote"
              >
                Class. Trib.
              </th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CBS</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">IBS</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">IS</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {linhas.map((linha) => {
              const data = getLinhaData(linha);
              const isSelected = selectedIds.has(linha.id);

              return (
                <tr
                  key={linha.id}
                  onClick={(e) => handleRowClick(linha.id, e)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                      : linha.erroValidacao
                      ? 'border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                <td className="px-2 py-2 whitespace-nowrap text-gray-900 dark:text-gray-300">
                  {linha.numeroLinha}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(linha.status)}
                    {linha.erroValidacao && (
                      <div title="Erro de validação">
                        <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}
                  </div>
                  {linha.status === 'ERRO' && linha.mensagemErro && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[150px] truncate" title={linha.mensagemErro}>
                      {linha.mensagemErro}
                    </p>
                  )}
                  {linha.erroValidacao && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 max-w-[150px] truncate" title={linha.erroValidacao}>
                      {linha.erroValidacao}
                    </p>
                  )}
                </td>

                {/* UF */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.uf || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'uf', e.target.value)}
                      className="w-12 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={2}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.uf || '-'}</span>
                  )}
                </td>

                {/* Município */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={data.municipio || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'municipio', e.target.value ? Number(e.target.value) : null)}
                      className="w-20 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.municipio || '-'}</span>
                  )}
                </td>

                {/* Data Operação */}
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(linha.dataOperacao)}
                </td>

                {/* Item */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={data.item || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'item', e.target.value ? Number(e.target.value) : null)}
                      className="w-16 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.item || '-'}</span>
                  )}
                </td>

                {/* CFOP */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.cfop || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'cfop', e.target.value)}
                      className="w-16 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={4}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.cfop || '-'}</span>
                  )}
                </td>

                {/* NCM Antigo */}
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {linha.ncmAntigo || '-'}
                </td>

                {/* NCM */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.ncm || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'ncm', e.target.value)}
                      className="w-20 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={8}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.ncm || '-'}</span>
                  )}
                </td>

                {/* NBS Antigo */}
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {linha.nbsAntigo || '-'}
                </td>

                {/* NBS */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.nbs || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'nbs', e.target.value)}
                      className="w-20 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={9}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.nbs || '-'}</span>
                  )}
                </td>

                {/* CST Antigo */}
                <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {linha.cstAntigo || '-'}
                </td>

                {/* CST */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.cst || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'cst', e.target.value)}
                      className="w-14 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={3}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.cst || '-'}</span>
                  )}
                </td>

                {/* Base Cálculo */}
                <td className="px-2 py-2 whitespace-nowrap text-right">
                  {isEditMode ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data.baseCalculo || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'baseCalculo', e.target.value ? Number(e.target.value) : null)}
                      className="w-24 px-1 py-0.5 text-xs border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {linha.baseCalculo ? linha.baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                    </span>
                  )}
                </td>

                {/* Quantidade */}
                <td className="px-2 py-2 whitespace-nowrap text-right">
                  {isEditMode ? (
                    <input
                      type="number"
                      step="0.0001"
                      value={data.quantidade || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'quantidade', e.target.value ? Number(e.target.value) : null)}
                      className="w-20 px-1 py-0.5 text-xs border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.quantidade || '-'}</span>
                  )}
                </td>

                {/* Unidade Medida */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.unidadeMedida || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'unidadeMedida', e.target.value)}
                      className="w-16 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={10}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.unidadeMedida || '-'}</span>
                  )}
                </td>

                {/* Classificação Tributária */}
                <td className="px-2 py-2 whitespace-nowrap">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={data.classificacaoTributaria || ''}
                      onChange={(e) => handleFieldChange(linha.id, 'classificacaoTributaria', e.target.value)}
                      className="w-24 px-1 py-0.5 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      maxLength={20}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{linha.classificacaoTributaria || '-'}</span>
                  )}
                </td>

                {/* Valores Calculados (não editáveis) */}
                <td className="px-2 py-2 whitespace-nowrap text-right text-xs font-semibold text-gray-900 dark:text-gray-300">
                  {formatCurrency(linha.valorTotal)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right text-xs text-gray-600 dark:text-gray-400">
                  {formatCurrency(linha.valorCBS)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right text-xs text-gray-600 dark:text-gray-400">
                  {formatCurrency(linha.valorIBS)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right text-xs text-gray-600 dark:text-gray-400">
                  {formatCurrency(linha.valorIS)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
};
