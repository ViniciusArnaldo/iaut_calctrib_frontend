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
  impostoSeletivo?: ImpostoSeletivoInput;
  tributacaoRegular?: TributacaoRegularInput;
  cClassTrib: string;
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

// Sub-estruturas da resposta
export interface DiferencialAliquota {
  pDif: number;
  vDif: number;
}

export interface DevolucaoTributo {
  vDevTrib: number;
}

export interface ReducaoAliquota {
  pRedAliq: number;
  pAliqEfet: number;
}

export interface TributacaoRegularResponse {
  CSTReg: number;
  cClassTribReg: string;
  pAliqEfetRegIBSUF: number;
  vTribRegIBSUF: number;
  pAliqEfetRegIBSMun: number;
  vTribRegIBSMun: number;
  pAliqEfetRegCBS: number;
  vTribRegCBS: number;
}

export interface CreditoPresumido {
  cCredPres: number;
  pCredPres: number;
  vCredPres: number;
  vCredPresCondSus: number;
}

export interface ImpostoSeletivoResponse {
  CSTIS: number;
  cClassTribIS: string;
  vBCIS: number;
  pIS: number;
  pISEspec: number;
  uTrib: string;
  qTrib: number;
  vIS: number;
  memoriaCalculo?: string;
}

export interface ItemResultado {
  numero: number;
  ncm: string;
  nbs?: string;
  cst: string;
  cClassTrib: string;
  descricao?: string;
  baseCalculo: number;

  // CBS
  valorCBS: number;
  aliquotaCBS: number;
  memoriaCalculoCBS?: string;

  // IBS UF
  valorIBSUF: number;
  aliquotaIBSUF: number;
  memoriaCalculoIBSUF?: string;

  // IBS Município
  valorIBSMun: number;
  aliquotaIBSMun: number;
  memoriaCalculoIBSMun?: string;

  // IBS Total
  valorIBS: number;
  aliquotaIBS: number;

  // IS (Imposto Seletivo)
  valorIS: number;
  aliquotaIS: number;
  impostoSeletivo?: ImpostoSeletivoResponse;

  // Diferencial de Alíquota
  difCBS?: DiferencialAliquota;
  difIBSUF?: DiferencialAliquota;
  difIBSMun?: DiferencialAliquota;

  // Devolução de Tributo
  devTribCBS?: DevolucaoTributo;
  devTribIBSUF?: DevolucaoTributo;
  devTribIBSMun?: DevolucaoTributo;

  // Redução de Alíquota
  redCBS?: ReducaoAliquota;
  redIBSUF?: ReducaoAliquota;
  redIBSMun?: ReducaoAliquota;

  // Tributação Regular
  tribRegular?: TributacaoRegularResponse;

  // Crédito Presumido
  credPresIBS?: CreditoPresumido;
  credPresCBS?: CreditoPresumido;
}

export interface ResultadoCalculoRegimeGeral {
  itens: ItemResultado[];
  totais: {
    baseCalculo: number;

    // IBS
    valorIBS: number;
    valorIBSUF: number;
    valorIBSMun: number;
    vDifIBSUF: number;
    vDifIBSMun: number;
    vDevTribIBSUF: number;
    vDevTribIBSMun: number;
    vCredPresIBS: number;
    vCredPresCondSusIBS: number;

    // CBS
    valorCBS: number;
    vDifCBS: number;
    vDevTribCBS: number;
    vCredPresCBS: number;
    vCredPresCondSusCBS: number;

    // IS
    valorIS: number;

    // Total Geral
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
  // Campos calculados pelo backend
  numeroItens?: number;
  totalTributos?: number;
  municipioNome?: string;
  dataOperacao?: string;
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
