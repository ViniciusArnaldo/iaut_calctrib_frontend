import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { ArrowLeft, Undo, Redo, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { BibliotecaCampos } from '../../features/analises/components/BibliotecaCampos';
import { AreaMontagem } from '../../features/analises/components/AreaMontagem';
import { OpcoesAvancadas } from '../../features/analises/components/OpcoesAvancadas';
import { VisualizacaoAnalise } from '../../features/analises/components/VisualizacaoAnalise';
import { BarraAcoes } from '../../features/analises/components/BarraAcoes';
import { ModalExportar } from '../../features/analises/components/ModalExportar';
import {
  useExecutarAnalise,
  useExportarAnalise,
} from '../../features/analises/hooks/useAnalises';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../utils/constants';
import {
  exportarElementoComoPNG,
  converterParaCSV,
  downloadCSV,
  gerarNomeArquivo,
} from '../../features/analises/utils/exportUtils';
import type {
  FonteDados,
  CampoAgrupamento,
  CampoValor,
  CampoFiltro,
  TipoVisualizacao,
  CampoAnalise,
  ConfiguracaoAnalise,
  DadosVisualizacao,
  TemplateAnalise,
} from '../../features/analises/types/analises.types';

export const NovaAnalisePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: errorToast } = useToast();

  // Template passado via state (quando vem da listagem)
  const templateInicial = location.state?.template as TemplateAnalise | undefined;

  // Estado da análise
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fonteDados, setFonteDados] = useState<FonteDados>('historico');
  const [baseSimulacaoId, setBaseSimulacaoId] = useState<number | undefined>(undefined);
  const [agrupamentos, setAgrupamentos] = useState<CampoAgrupamento[]>([]);
  const [valores, setValores] = useState<CampoValor[]>([]);
  const [filtros, setFiltros] = useState<CampoFiltro[]>([]);
  const [visualizacao, setVisualizacao] = useState<TipoVisualizacao>('tabela');
  const [opcoes, setOpcoes] = useState<ConfiguracaoAnalise['opcoes']>({});
  const [dadosVisualizacao, setDadosVisualizacao] = useState<DadosVisualizacao | null>(null);

  // Histórico para Desfazer/Refazer
  const [historico, setHistorico] = useState<ConfiguracaoAnalise[]>([]);
  const [indiceHistorico, setIndiceHistorico] = useState(-1);

  // Modal de exportação
  const [modalExportarAberto, setModalExportarAberto] = useState(false);

  // Ocultar sidebar
  const [hideSidebar, setHideSidebar] = useState(false);

  // Hooks
  const executarMutation = useExecutarAnalise();
  const exportarMutation = useExportarAnalise();

  // Carregar template inicial
  useEffect(() => {
    if (templateInicial) {
      console.log('🎨 Template carregado:', {
        nome: templateInicial.nome,
        fonteDados: templateInicial.configuracao.fonteDados,
        baseSimulacaoId: templateInicial.configuracao.baseSimulacaoId,
        agrupamentos: templateInicial.configuracao.agrupamentos,
        valores: templateInicial.configuracao.valores,
        filtros: templateInicial.configuracao.filtros,
        visualizacao: templateInicial.configuracao.visualizacao,
      });
      setNome(templateInicial.nome);
      setDescricao(templateInicial.descricao);
      setFonteDados(templateInicial.configuracao.fonteDados);
      setBaseSimulacaoId(templateInicial.configuracao.baseSimulacaoId);
      setAgrupamentos(templateInicial.configuracao.agrupamentos);
      setValores(templateInicial.configuracao.valores);
      setFiltros(templateInicial.configuracao.filtros);
      setVisualizacao(templateInicial.configuracao.visualizacao);
      setOpcoes(templateInicial.configuracao.opcoes || {});
    }
  }, [templateInicial]);

  // Adicionar ao histórico sempre que mudar a configuração
  const adicionarAoHistorico = useCallback(() => {
    const novaConfiguracao: ConfiguracaoAnalise = {
      fonteDados,
      baseSimulacaoId,
      agrupamentos,
      valores,
      filtros,
      visualizacao,
      opcoes,
    };

    setHistorico((prev) => {
      const novoHistorico = prev.slice(0, indiceHistorico + 1);
      novoHistorico.push(novaConfiguracao);
      return novoHistorico;
    });

    setIndiceHistorico((prev) => prev + 1);
  }, [fonteDados, baseSimulacaoId, agrupamentos, valores, filtros, visualizacao, opcoes, indiceHistorico]);

  // Desfazer
  const desfazer = () => {
    if (indiceHistorico > 0) {
      const novoIndice = indiceHistorico - 1;
      const configuracao = historico[novoIndice];

      setFonteDados(configuracao.fonteDados);
      setBaseSimulacaoId(configuracao.baseSimulacaoId);
      setAgrupamentos(configuracao.agrupamentos);
      setValores(configuracao.valores);
      setFiltros(configuracao.filtros);
      setVisualizacao(configuracao.visualizacao);
      setOpcoes(configuracao.opcoes || {});
      setIndiceHistorico(novoIndice);
    }
  };

  // Refazer
  const refazer = () => {
    if (indiceHistorico < historico.length - 1) {
      const novoIndice = indiceHistorico + 1;
      const configuracao = historico[novoIndice];

      setFonteDados(configuracao.fonteDados);
      setBaseSimulacaoId(configuracao.baseSimulacaoId);
      setAgrupamentos(configuracao.agrupamentos);
      setValores(configuracao.valores);
      setFiltros(configuracao.filtros);
      setVisualizacao(configuracao.visualizacao);
      setOpcoes(configuracao.opcoes || {});
      setIndiceHistorico(novoIndice);
    }
  };

  // Auto-executar análise quando mudar configuração (debounced)
  useEffect(() => {
    console.log('🔄 Configuração mudou:', {
      agrupamentos: agrupamentos.length,
      valores: valores.length,
      filtros: filtros.length,
      visualizacao,
      baseSimulacaoId,
      fonteDados,
    });

    const timer = setTimeout(() => {
      if (agrupamentos.length > 0 || valores.length > 0) {
        console.log('⚡ Disparando handleExecutarAnalise...');
        handleExecutarAnalise();
      } else {
        console.log('⏸️ Não executando: sem agrupamentos ou valores');
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agrupamentos, valores, filtros, visualizacao, baseSimulacaoId]);

  // Adicionar campo programaticamente (para botões e atalhos)
  const handleAdicionarCampo = (campo: CampoAnalise, tipo: 'agrupar' | 'valores' | 'filtros') => {
    adicionarAoHistorico();

    if (tipo === 'agrupar') {
      const jaExiste = agrupamentos.some((a) => a.campo.id === campo.id);
      if (!jaExiste) {
        setAgrupamentos([...agrupamentos, { campo }]);
      }
    } else if (tipo === 'valores') {
      const agregacaoSugerida = campo.tipo === 'numero' ? 'soma' : 'contagem';
      setValores([
        ...valores,
        {
          campo,
          agregacao: agregacaoSugerida,
        },
      ]);
    } else if (tipo === 'filtros') {
      const jaExiste = filtros.some((f) => f.campo.id === campo.id);
      if (!jaExiste) {
        setFiltros([
          ...filtros,
          {
            campo,
            operador: 'igual',
            valor: '',
          },
        ]);
      }
    }
  };

  // Drag and Drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const campoArrastado = active.data.current?.campo as CampoAnalise;
    if (!campoArrastado) return;

    // Reusar a função de adicionar campo
    if (over.id === 'agrupar') {
      handleAdicionarCampo(campoArrastado, 'agrupar');
    } else if (over.id === 'valores') {
      handleAdicionarCampo(campoArrastado, 'valores');
    } else if (over.id === 'filtros') {
      handleAdicionarCampo(campoArrastado, 'filtros');
    }
  };

  // Executar análise
  const handleExecutarAnalise = async () => {
    console.log('🚀 handleExecutarAnalise chamado', {
      valores: valores.length,
      fonteDados,
      baseSimulacaoId,
    });

    if (valores.length === 0) {
      console.log('❌ Bloqueado: sem valores');
      setDadosVisualizacao(null);
      return;
    }

    // Se fonte for base-simulacao, exigir que tenha uma base selecionada
    if (fonteDados === 'base-simulacao' && !baseSimulacaoId) {
      console.log('❌ Bloqueado: fonte é base-simulacao mas sem baseSimulacaoId');
      setDadosVisualizacao(null);
      return;
    }

    try {
      console.log('✅ Executando análise com configuração:', {
        fonteDados,
        baseSimulacaoId,
        agrupamentos: agrupamentos.map(a => a.campo.label),
        valores: valores.map(v => v.campo.label),
        filtros: filtros.length,
      });

      const resultado = await executarMutation.mutateAsync({
        configuracao: {
          fonteDados,
          baseSimulacaoId,
          agrupamentos,
          valores,
          filtros,
          visualizacao,
          opcoes,
        },
      });

      console.log('✅ Resultado recebido:', resultado);
      setDadosVisualizacao(resultado);
    } catch (error) {
      console.error('❌ Erro ao executar análise:', error);
      // Não mostrar toast para não incomodar o usuário durante edição
    }
  };


  // Exportar
  const handleExportar = () => {
    setModalExportarAberto(true);
  };

  const handleExportarFormato = async (formato: 'xlsx' | 'csv' | 'png') => {
    try {
      if (formato === 'png') {
        // Exportar como imagem
        await exportarElementoComoPNG(
          'visualizacao-analise',
          gerarNomeArquivo(nome || 'analise', 'png')
        );
        success('Imagem exportada com sucesso!');
      } else if (formato === 'csv') {
        // Exportar como CSV
        if (!dadosVisualizacao?.dados || dadosVisualizacao.dados.length === 0) {
          errorToast('Nenhum dado para exportar');
          return;
        }
        const csv = converterParaCSV(dadosVisualizacao.dados);
        downloadCSV(csv, gerarNomeArquivo(nome || 'analise', 'csv'));
        success('CSV exportado com sucesso!');
      } else if (formato === 'xlsx') {
        // Exportar como Excel via API
        const configuracao: ConfiguracaoAnalise = {
          fonteDados,
          baseSimulacaoId,
          agrupamentos,
          valores,
          filtros,
          visualizacao,
          opcoes,
        };

        await exportarMutation.mutateAsync({
          configuracao,
          formato: 'xlsx',
        });
        success('Excel exportado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao exportar:', err);
      errorToast('Erro ao exportar análise');
    }
  };

  return (
    <DashboardLayout hideSidebarOnDesktop={hideSidebar}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(ROUTES.ANALISES)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setHideSidebar(!hideSidebar)}
              className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-3"
              title={hideSidebar ? 'Mostrar menu' : 'Ocultar menu'}
            >
              {hideSidebar ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <div>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da análise..."
                className="text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição (opcional)..."
                className="block mt-1 text-sm bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-400 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Desfazer/Refazer */}
            <button
              onClick={desfazer}
              disabled={indiceHistorico <= 0}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30"
              title="Desfazer"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={refazer}
              disabled={indiceHistorico >= historico.length - 1}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30"
              title="Refazer"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Ações */}
        <BarraAcoes
          visualizacao={visualizacao}
          onVisualizacaoChange={setVisualizacao}
          onSalvar={undefined}
          onExportar={handleExportar}
          salvando={false}
        />

        {/* Layout Principal com DnD */}
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden mt-4">
            {/* Sidebar Esquerda - Biblioteca de Campos */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <BibliotecaCampos
                fonteDados={fonteDados}
                onFonteChange={setFonteDados}
                onAdicionarCampo={handleAdicionarCampo}
                baseSimulacaoId={baseSimulacaoId}
                onBaseSimulacaoChange={setBaseSimulacaoId}
              />
            </div>

            {/* Área Central - Montagem e Visualização */}
            <div className="col-span-9 flex flex-col space-y-4 overflow-hidden">
              {/* Área de Montagem */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <AreaMontagem
                  agrupamentos={agrupamentos}
                  valores={valores}
                  filtros={filtros}
                  onAgrupamentosChange={setAgrupamentos}
                  onValoresChange={setValores}
                  onFiltrosChange={setFiltros}
                />
                <OpcoesAvancadas opcoes={opcoes} onOpcoesChange={setOpcoes} />
              </div>

              {/* Visualização */}
              <div className="flex-1 overflow-y-auto">
                <div id="visualizacao-analise">
                  <VisualizacaoAnalise
                    dados={dadosVisualizacao}
                    visualizacao={visualizacao}
                    isLoading={executarMutation.isPending}
                  />
                </div>
              </div>
            </div>
          </div>

          <DragOverlay>{/* Overlay durante drag */}</DragOverlay>
        </DndContext>

        {/* Modal de Exportação */}
        <ModalExportar
          isOpen={modalExportarAberto}
          onClose={() => setModalExportarAberto(false)}
          onExportar={handleExportarFormato}
          nomeAnalise={nome}
        />
      </div>
    </DashboardLayout>
  );
};
