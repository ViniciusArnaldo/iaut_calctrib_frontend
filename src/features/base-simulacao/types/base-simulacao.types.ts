/**
 * Tipo de calculadora para identificar qual API usar
 */
export type TipoCalculadora = 'REGIME_GERAL' | 'PEDAGIO' | 'BASE_CALCULO_IS' | 'BASE_CALCULO_CBS_IBS';

/**
 * Interface unificada para linha da base de simulação
 * Todos os campos são opcionais pois cada calculadora usa campos diferentes
 */
export interface LinhaBaseSimulacao {
  // ID temporário para controle na tabela
  id: string;

  // Tipo de calculadora a ser usada
  tipoCalculadora: TipoCalculadora;

  // Status do processamento
  status?: 'pendente' | 'processando' | 'sucesso' | 'erro';
  mensagemErro?: string;

  // ===== CAMPOS COMUNS =====
  // Usados em várias calculadoras

  dataHoraEmissao?: string; // Regime Geral e Pedágio
  municipio?: number; // Regime Geral (código IBGE)
  uf?: string; // Regime Geral
  cst?: string; // Regime Geral e Pedágio
  baseCalculo?: number; // Regime Geral (por item) e Pedágio

  // ===== CAMPOS ESPECÍFICOS DO REGIME GERAL =====

  // Identificação do ROC
  rocId?: string;
  rocVersao?: string;

  // Item da operação (simplificado - para múltiplos itens, criar múltiplas linhas)
  numeroItem?: number;
  ncm?: string;
  nbs?: string;
  quantidade?: number;
  unidade?: string;
  cClassTrib?: string;

  // Imposto Seletivo (dentro do item)
  impostoSeletivo_cst?: string;
  impostoSeletivo_baseCalculo?: number;
  impostoSeletivo_quantidade?: number;
  impostoSeletivo_unidade?: string;
  impostoSeletivo_impostoInformado?: number;
  impostoSeletivo_cClassTrib?: string;

  // Tributação Regular (dentro do item)
  tributacaoRegular_cst?: string;
  tributacaoRegular_cClassTrib?: string;

  // ===== CAMPOS ESPECÍFICOS DO PEDÁGIO =====

  codigoMunicipioOrigem?: number;
  ufMunicipioOrigem?: string;
  cclassTrib?: string; // Pedágio usa cclassTrib (minúsculo)

  // Trechos do pedágio (JSON string ou campos separados)
  // Para simplificar, vamos usar JSON string que será parseado
  trechosPedagio?: string; // JSON: [{ numero, municipio, uf, extensao }]

  // ===== CAMPOS ESPECÍFICOS DA BASE CÁLCULO IS =====

  valorIntegralCobrado?: number;
  bonificacao?: number;
  devolucaoVendas?: number;

  // ===== CAMPOS ESPECÍFICOS DA BASE CÁLCULO CBS/IBS =====

  valorFornecimento?: number;
  impostoSeletivo?: number; // CBS/IBS usa esse campo diferente do Regime Geral

  // ===== CAMPOS COMUNS ENTRE BASE IS E CBS/IBS =====

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

  // ===== CAMPOS DE RESULTADO =====
  // Preenchidos após o processamento

  resultado?: any; // Resultado completo da API
  valorCBS?: number;
  valorIBS?: number;
  valorIS?: number;
  valorTotal?: number;
}

/**
 * Interface para o estado da base de simulação
 */
export interface BaseSimulacaoState {
  linhas: LinhaBaseSimulacao[];
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
}

/**
 * Mapeamento de colunas do Excel/CSV para os campos da interface
 */
export interface MapeamentoColunas {
  [nomeColuna: string]: keyof LinhaBaseSimulacao;
}

/**
 * Template para download/upload
 */
export const CAMPOS_BASE_SIMULACAO = {
  // Campos obrigatórios
  obrigatorios: [
    'tipoCalculadora',
  ],

  // Campos por tipo de calculadora
  regimeGeral: [
    'rocId',
    'rocVersao',
    'dataHoraEmissao',
    'municipio',
    'uf',
    'numeroItem',
    'ncm',
    'nbs',
    'cst',
    'baseCalculo',
    'quantidade',
    'unidade',
    'cClassTrib',
  ],

  pedagio: [
    'dataHoraEmissao',
    'codigoMunicipioOrigem',
    'ufMunicipioOrigem',
    'cst',
    'baseCalculo',
    'trechosPedagio',
    'cClassTrib',
  ],

  baseCalculoIS: [
    'valorIntegralCobrado',
    'ajusteValorOperacao',
    'juros',
    'multas',
    'acrescimos',
    'encargos',
    'descontosCondicionais',
    'fretePorDentro',
    'outrosTributos',
    'demaisImportancias',
    'icms',
    'iss',
    'pis',
    'cofins',
    'bonificacao',
    'devolucaoVendas',
  ],

  baseCalculoCBSIBS: [
    'valorFornecimento',
    'ajusteValorOperacao',
    'juros',
    'multas',
    'acrescimos',
    'encargos',
    'descontosCondicionais',
    'fretePorDentro',
    'outrosTributos',
    'impostoSeletivo',
    'demaisImportancias',
    'icms',
    'iss',
    'pis',
    'cofins',
  ],
};
