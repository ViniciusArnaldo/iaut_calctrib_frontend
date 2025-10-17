import type { TemplateAnalise } from '../types/analises.types';
import { CAMPOS_HISTORICO } from '../types/analises.types';

/**
 * Templates prontos de análises para facilitar o uso por usuários iniciantes
 */
export const TEMPLATES_ANALISES: TemplateAnalise[] = [
  {
    id: 'cbs-por-mes',
    nome: 'CBS por Mês',
    descricao: 'Evolução mensal do valor de CBS',
    icone: 'TrendingUp',
    categoria: 'tributacao',
    popular: true,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'ano')!,
          ordem: 'asc',
        },
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'mes')!,
          ordem: 'asc',
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorCBS')!,
          agregacao: 'soma',
          label: 'Total CBS (R$)',
        },
      ],
      filtros: [],
      visualizacao: 'linha',
      opcoes: {
        mostrarTotal: true,
      },
    },
  },
  {
    id: 'tributos-por-uf',
    nome: 'Tributos por UF',
    descricao: 'Comparativo de tributos por estado',
    icone: 'BarChart3',
    categoria: 'tributacao',
    popular: true,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'uf')!,
          ordem: 'desc',
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorTotal')!,
          agregacao: 'soma',
          label: 'Total de Tributos (R$)',
        },
      ],
      filtros: [],
      visualizacao: 'barras',
      opcoes: {
        mostrarPercentual: true,
        limitarLinhas: 10,
        ordenacao: {
          campo: 'Total de Tributos (R$)',
          direcao: 'desc',
        },
      },
    },
  },
  {
    id: 'top-10-municipios',
    nome: 'Top 10 Municípios',
    descricao: 'Municípios com maior arrecadação',
    icone: 'Award',
    categoria: 'tributacao',
    popular: true,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'municipio')!,
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorTotal')!,
          agregacao: 'soma',
          label: 'Total de Tributos (R$)',
        },
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'tipo')!,
          agregacao: 'contagem',
          label: 'Quantidade de Operações',
        },
      ],
      filtros: [],
      visualizacao: 'tabela',
      opcoes: {
        limitarLinhas: 10,
        ordenacao: {
          campo: 'Total de Tributos (R$)',
          direcao: 'desc',
        },
      },
    },
  },
  {
    id: 'distribuicao-tipos',
    nome: 'Distribuição por Tipo',
    descricao: 'Participação de cada tipo de cálculo',
    icone: 'PieChart',
    categoria: 'operacional',
    popular: false,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'tipo')!,
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'tipo')!,
          agregacao: 'contagem',
          label: 'Quantidade',
        },
      ],
      filtros: [],
      visualizacao: 'pizza',
      opcoes: {
        mostrarPercentual: true,
      },
    },
  },
  {
    id: 'comparativo-tributos',
    nome: 'Comparativo CBS x IBS x IS',
    descricao: 'Comparação entre os três tributos',
    icone: 'GitCompare',
    categoria: 'tributacao',
    popular: true,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'mes')!,
          ordem: 'asc',
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorCBS')!,
          agregacao: 'soma',
          label: 'CBS',
        },
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorIBS')!,
          agregacao: 'soma',
          label: 'IBS',
        },
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorIS')!,
          agregacao: 'soma',
          label: 'IS',
        },
      ],
      filtros: [],
      visualizacao: 'colunas',
      opcoes: {
        mostrarTotal: true,
      },
    },
  },
  {
    id: 'valor-medio-operacao',
    nome: 'Valor Médio por Operação',
    descricao: 'Ticket médio das operações por mês',
    icone: 'DollarSign',
    categoria: 'financeiro',
    popular: false,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'mes')!,
          ordem: 'asc',
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorBase')!,
          agregacao: 'media',
          label: 'Valor Médio Base (R$)',
        },
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorTotal')!,
          agregacao: 'media',
          label: 'Valor Médio Tributos (R$)',
        },
      ],
      filtros: [],
      visualizacao: 'linha',
    },
  },
  {
    id: 'kpi-total-mes',
    nome: 'Total do Mês Atual',
    descricao: 'KPI com total de tributos do mês',
    icone: 'Target',
    categoria: 'financeiro',
    popular: false,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'valorTotal')!,
          agregacao: 'soma',
          label: 'Total de Tributos',
        },
      ],
      filtros: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'mes')!,
          operador: 'igual',
          valor: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
          label: 'Mês Atual',
        },
      ],
      visualizacao: 'kpi',
    },
  },
  {
    id: 'itens-por-tipo',
    nome: 'Quantidade de Itens por Tipo',
    descricao: 'Volume de itens processados por tipo de cálculo',
    icone: 'Package',
    categoria: 'operacional',
    popular: false,
    configuracao: {
      fonteDados: 'historico',
      agrupamentos: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'tipo')!,
        },
      ],
      valores: [
        {
          campo: CAMPOS_HISTORICO.find(c => c.id === 'numeroItens')!,
          agregacao: 'soma',
          label: 'Total de Itens',
        },
      ],
      filtros: [],
      visualizacao: 'barras',
      opcoes: {
        mostrarTotal: true,
      },
    },
  },
];

/**
 * Retorna templates filtrados por categoria
 */
export const getTemplatesPorCategoria = (categoria: 'tributacao' | 'financeiro' | 'operacional') => {
  return TEMPLATES_ANALISES.filter(t => t.categoria === categoria);
};

/**
 * Retorna apenas templates populares
 */
export const getTemplatesPopulares = () => {
  return TEMPLATES_ANALISES.filter(t => t.popular);
};

/**
 * Busca template por ID
 */
export const getTemplateById = (id: string) => {
  return TEMPLATES_ANALISES.find(t => t.id === id);
};
