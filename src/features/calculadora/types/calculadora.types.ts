// ============================================
// DADOS ABERTOS (do governo)
// ============================================

export interface UF {
  codigo: number;
  sigla: string;
  nome: string;
}

export interface Municipio {
  codigo: number;
  nome: string;
}

export interface NCM {
  codigo: string;
  descricao: string;
  aliquotaIS?: number;
}

// ============================================
// REGIME GERAL - INPUT (conforme API do governo)
// ============================================

export interface ImpostoSeletivoInput {
  cst: string;
  baseCalculo: number;
  quantidade: number;
  unidade: string;
  impostoInformado: number;
  cClassTrib: string;
}

export interface TributacaoRegularInput {
  cst: string;
  cClassTrib: string;
}

export interface ItemOperacaoInput {
  numero: number;
  ncm?: string;
  nbs?: string;
  cst: string;
  baseCalculo: number;
  quantidade?: number;
  unidade?: string;
  cClassTrib: string;
  impostoSeletivo?: ImpostoSeletivoInput;
  tributacaoRegular?: TributacaoRegularInput;
}

export interface CalcularRegimeGeralDTO {
  id: string;
  versao: string;
  dataHoraEmissao: string;
  municipio: number;
  uf: string;
  itens: ItemOperacaoInput[];
}

// ============================================
// REGIME GERAL - RESPONSE
// ============================================

export interface ItemResultado {
  ncm: string;
  descricao?: string;
  baseCalculo: number;
  valorCBS: number;
  valorIBS: number;
  valorIS: number;
  aliquotaCBS: number;
  aliquotaIBS: number;
  aliquotaIS: number;
}

export interface ResultadoCalculoRegimeGeral {
  itens: ItemResultado[];
  totais: {
    baseCalculo: number;
    valorCBS: number;
    valorIBS: number;
    valorIS: number;
    valorTotal: number;
  };
  municipio: string;
  uf: string;
  dataOperacao: string;
}

// ============================================
// HISTÓRICO
// ============================================

export interface CalculoHistorico {
  id: number;
  tipo: 'REGIME_GERAL' | 'PEDAGIO' | 'BASE_CALCULO_IS' | 'BASE_CALCULO_CIBS';
  request: any;
  response: any;
  municipio?: number;
  uf?: string;
  valorBase?: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface HistoricoResponse {
  itens: CalculoHistorico[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// PEDAGIO - INPUT
// ============================================

export interface TrechoPedagio {
  numero: number;
  municipio: number;
  uf: string;
  extensao: number;
}

export interface CalcularPedagioDTO {
  dataHoraEmissao: string;
  codigoMunicipioOrigem: number;
  ufMunicipioOrigem: string;
  cst: string;
  baseCalculo: number;
  cClassTrib: string;
  trechos: TrechoPedagio[];
}

// ============================================
// BASE CALCULO IS - INPUT
// ============================================

export interface CalcularBaseCalculoISDTO {
  valorIntegralCobrado?: number;
  ajusteValorOperacao?: number;
  juros?: number;
  multas?: number;
  acrescimos?: number;
  encargos?: number;
  descontosCondicionais?: number;
  fretePorDentro?: number;
  outrosTributos?: number;
  demaisImportancias?: number;
  icms?: number;
  iss?: number;
  pis?: number;
  cofins?: number;
  bonificacao?: number;
  devolucaoVendas?: number;
}

// ============================================
// BASE CALCULO CBS/IBS - INPUT
// ============================================

export interface CalcularBaseCalculoCBSIBSDTO {
  valorFornecimento?: number;
  ajusteValorOperacao?: number;
  juros?: number;
  multas?: number;
  acrescimos?: number;
  encargos?: number;
  descontosCondicionais?: number;
  fretePorDentro?: number;
  outrosTributos?: number;
  impostoSeletivo?: number;
  demaisImportancias?: number;
  icms?: number;
  iss?: number;
  pis?: number;
  cofins?: number;
}

// ============================================
// ESTATÍSTICAS
// ============================================

export interface EstatisticasResponse {
  totalCalculos: number;
  calculosEsteMes: number;
  calculosRestantes: number;
  plano: string | null;
  limite: number;
  usado: number;
  percentualUso: number;
  calculosPorTipo: Array<{
    tipo: string;
    quantidade: number;
  }>;
}
