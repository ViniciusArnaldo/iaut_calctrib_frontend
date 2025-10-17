// ============================================
// TIPOS DE ANÁLISE
// ============================================

export type TipoVisualizacao = 'tabela' | 'colunas' | 'barras' | 'linha' | 'pizza' | 'kpi';
export type TipoAgregacao = 'soma' | 'contagem' | 'media' | 'minimo' | 'maximo';
export type TipoCampo = 'texto' | 'numero' | 'data' | 'booleano';
export type FonteDados = 'historico' | 'base-simulacao';

// ============================================
// CAMPO DE DADOS
// ============================================

export interface CampoAnalise {
  id: string;
  nome: string;
  label: string;
  tipo: TipoCampo;
  descricao?: string;
  formatacao?: 'moeda' | 'percentual' | 'numero' | 'data' | 'texto';
}

// ============================================
// CONFIGURAÇÃO DE CAMPO
// ============================================

export interface CampoAgrupamento {
  campo: CampoAnalise;
  ordem?: 'asc' | 'desc';
}

export interface CampoValor {
  campo: CampoAnalise;
  agregacao: TipoAgregacao;
  label?: string; // Label customizado (ex: "Total de CBS")
}

export interface CampoFiltro {
  campo: CampoAnalise;
  operador: 'igual' | 'diferente' | 'contem' | 'maior' | 'menor' | 'entre' | 'em';
  valor: any;
  label?: string; // Para exibição amigável
}

// ============================================
// CONFIGURAÇÃO DA ANÁLISE
// ============================================

export interface ConfiguracaoAnalise {
  fonteDados: FonteDados;
  baseSimulacaoId?: number; // ID da base quando fonteDados = 'base-simulacao'
  agrupamentos: CampoAgrupamento[];
  valores: CampoValor[];
  filtros: CampoFiltro[];
  visualizacao: TipoVisualizacao;
  opcoes?: {
    mostrarPercentual?: boolean;
    mostrarTotal?: boolean;
    limitarLinhas?: number; // Top N
    ordenacao?: {
      campo: string;
      direcao: 'asc' | 'desc';
    };
  };
}

// ============================================
// ANÁLISE (entidade principal)
// ============================================

export interface Analise {
  id: number;
  nome: string;
  descricao?: string;
  configuracao: ConfiguracaoAnalise;
  userId: number;
  createdAt: string;
  updatedAt: string;
  compartilhada?: boolean;
  permissao?: 'viewer' | 'editor';
}

// ============================================
// TEMPLATE DE ANÁLISE
// ============================================

export interface TemplateAnalise {
  id: string;
  nome: string;
  descricao: string;
  icone?: string;
  categoria: 'tributacao' | 'financeiro' | 'operacional';
  configuracao: ConfiguracaoAnalise;
  popular?: boolean; // Templates mais usados
}

// ============================================
// DADOS PROCESSADOS PARA VISUALIZAÇÃO
// ============================================

export interface DadosVisualizacao {
  dados: any[]; // Array de objetos com os dados processados
  totais?: Record<string, number>;
  metadados: {
    totalRegistros: number;
    dataProcessamento: string;
    filtrosAplicados: number;
  };
}

// ============================================
// DASHBOARD DE ANÁLISES
// ============================================

export interface CartaoDashboard {
  id: number;
  analiseId: number;
  analise?: Analise;
  posicao: number;
  largura: 1 | 2 | 3 | 4; // Grid de 4 colunas
  altura: 1 | 2 | 3; // Grid de altura
}

export interface DashboardAnalises {
  id: number;
  nome: string;
  descricao?: string;
  cartoes: CartaoDashboard[];
  filtrosGlobais?: CampoFiltro[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DTOs PARA API
// ============================================

export interface CriarAnaliseDTO {
  nome: string;
  descricao?: string;
  configuracao: ConfiguracaoAnalise;
}

export interface AtualizarAnaliseDTO {
  nome?: string;
  descricao?: string;
  configuracao?: ConfiguracaoAnalise;
}

export interface ExecutarAnaliseDTO {
  configuracao: ConfiguracaoAnalise;
  filtrosAdicionais?: CampoFiltro[];
}

export interface ListarAnalisesResponse {
  itens: Analise[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// CAMPOS DISPONÍVEIS POR FONTE
// ============================================

export const CAMPOS_HISTORICO: CampoAnalise[] = [
  { id: 'data', nome: 'dataOperacao', label: 'Data', tipo: 'data', formatacao: 'data' },
  { id: 'mes', nome: 'mes', label: 'Mês', tipo: 'texto' },
  { id: 'ano', nome: 'ano', label: 'Ano', tipo: 'numero' },
  { id: 'municipio', nome: 'municipioNome', label: 'Município', tipo: 'texto' },
  { id: 'uf', nome: 'uf', label: 'UF', tipo: 'texto' },
  { id: 'tipo', nome: 'tipo', label: 'Tipo de Cálculo', tipo: 'texto' },
  { id: 'valorBase', nome: 'valorBase', label: 'Valor Base', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorCBS', nome: 'totalCBS', label: 'Valor CBS', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorIBS', nome: 'totalIBS', label: 'Valor IBS', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorIS', nome: 'totalIS', label: 'Valor IS', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorTotal', nome: 'totalTributos', label: 'Total de Tributos', tipo: 'numero', formatacao: 'moeda' },
  { id: 'numeroItens', nome: 'numeroItens', label: 'Número de Itens', tipo: 'numero' },
];

export const CAMPOS_BASE_SIMULACAO: CampoAnalise[] = [
  { id: 'linha', nome: 'linha', label: 'Linha', tipo: 'numero' },
  { id: 'descricao', nome: 'descricao', label: 'Descrição', tipo: 'texto' },
  { id: 'ncm', nome: 'ncm', label: 'NCM', tipo: 'texto' },
  { id: 'nbs', nome: 'nbs', label: 'NBS', tipo: 'texto' },
  { id: 'cst', nome: 'cst', label: 'CST', tipo: 'texto' },
  { id: 'cClassTrib', nome: 'cClassTrib', label: 'Classificação Tributária', tipo: 'texto' },
  { id: 'municipio', nome: 'municipio', label: 'Município', tipo: 'texto' },
  { id: 'uf', nome: 'uf', label: 'UF', tipo: 'texto' },
  { id: 'baseCalculo', nome: 'baseCalculo', label: 'Base de Cálculo', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorCBS', nome: 'valorCBS', label: 'Valor CBS', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorIBSUF', nome: 'valorIBSUF', label: 'Valor IBS UF', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorIBSMun', nome: 'valorIBSMun', label: 'Valor IBS Município', tipo: 'numero', formatacao: 'moeda' },
  { id: 'valorIS', nome: 'valorIS', label: 'Valor IS', tipo: 'numero', formatacao: 'moeda' },
  { id: 'aliquotaCBS', nome: 'aliquotaCBS', label: 'Alíquota CBS', tipo: 'numero', formatacao: 'percentual' },
  { id: 'aliquotaIBS', nome: 'aliquotaIBS', label: 'Alíquota IBS', tipo: 'numero', formatacao: 'percentual' },
  { id: 'aliquotaIS', nome: 'aliquotaIS', label: 'Alíquota IS', tipo: 'numero', formatacao: 'percentual' },
];

// Helper para obter campos por fonte de dados
export const getCamposPorFonte = (fonte: FonteDados): CampoAnalise[] => {
  switch (fonte) {
    case 'historico':
      return CAMPOS_HISTORICO;
    case 'base-simulacao':
      return CAMPOS_BASE_SIMULACAO;
    default:
      return [];
  }
};
