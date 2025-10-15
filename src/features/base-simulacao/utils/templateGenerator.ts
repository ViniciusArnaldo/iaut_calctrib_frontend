import * as XLSX from 'xlsx';

/**
 * Gera e faz download de um template Excel simplificado para importação de base de simulação
 * Versão inicial focada em REGIME GERAL com campos essenciais
 */
export const downloadTemplateExcel = () => {
  // Dados de exemplo com campos essenciais para REGIME GERAL
  const templateData = [
    {
      tipoCalculadora: 'REGIME_GERAL',
      uf: 'RS',
      municipio: 4314902,
      dataOperacao: '2027-01-01T10:00:00-03:00',
      item: 1,
      ncm: '24021000',
      nbs: '',
      cst: '000',
      baseCalculo: 200.00,
      classificacaoTributaria: '000001',
      quantidade: 10,
      unidadeMedida: 'UN',
    },
    {
      tipoCalculadora: 'REGIME_GERAL',
      uf: 'SP',
      municipio: 3550308,
      dataOperacao: '2027-01-01T14:30:00-03:00',
      item: 2,
      ncm: '84715010',
      nbs: '',
      cst: '000',
      baseCalculo: 1500.00,
      classificacaoTributaria: '000001',
      quantidade: 5,
      unidadeMedida: 'UN',
    },
    {
      tipoCalculadora: 'REGIME_GERAL',
      uf: 'MG',
      municipio: 3106200,
      dataOperacao: '2027-01-02T09:00:00-03:00',
      item: 3,
      ncm: '22030000',
      nbs: '',
      cst: '000',
      baseCalculo: 50.00,
      classificacaoTributaria: '000001',
      quantidade: 100,
      unidadeMedida: 'LT',
    },
  ];

  // Criar worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 18 }, // tipoCalculadora
    { wch: 8 },  // uf
    { wch: 12 }, // municipio
    { wch: 25 }, // dataOperacao
    { wch: 8 },  // item
    { wch: 12 }, // ncm
    { wch: 12 }, // nbs
    { wch: 8 },  // cst
    { wch: 15 }, // baseCalculo
    { wch: 22 }, // classificacaoTributaria
    { wch: 12 }, // quantidade
    { wch: 15 }, // unidadeMedida
  ];
  worksheet['!cols'] = columnWidths;

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Base Simulação');

  // Adicionar aba de instruções
  const instrucoes = [
    ['INSTRUÇÕES PARA PREENCHIMENTO - REGIME GERAL'],
    [''],
    ['DESCRIÇÃO DOS CAMPOS:'],
    [''],
    ['Campo', 'Descrição', 'Exemplo'],
    ['tipoCalculadora', 'Tipo da calculadora (OBRIGATÓRIO)', 'REGIME_GERAL'],
    ['uf', 'Sigla do estado (2 letras)', 'RS, SP, MG'],
    ['municipio', 'Código IBGE do município (7 dígitos)', '4314902 (Porto Alegre)'],
    ['dataOperacao', 'Data e hora da operação no formato ISO', '2027-01-01T10:00:00-03:00'],
    ['item', 'Número do item na nota/operação', '1, 2, 3...'],
    ['ncm', 'Código NCM (8 dígitos) para produtos', '24021000'],
    ['nbs', 'Código NBS para serviços (deixe vazio se for produto)', '114052200'],
    ['cst', 'Código de Situação Tributária', '000, 010, 020...'],
    ['baseCalculo', 'Valor da base de cálculo', '200.00'],
    ['classificacaoTributaria', 'Código de classificação tributária', '000001'],
    ['quantidade', 'Quantidade do item', '10, 5.5, 100'],
    ['unidadeMedida', 'Unidade de medida', 'UN, KG, LT, M2'],
    [''],
    ['OBSERVAÇÕES IMPORTANTES:'],
    ['1. Formato de data: YYYY-MM-DDTHH:mm:ss-03:00'],
    ['2. Valores decimais: use ponto (.) como separador (ex: 1500.00)'],
    ['3. NCM: use para produtos (8 dígitos)'],
    ['4. NBS: use para serviços (deixe vazio se for produto)'],
    ['5. Município: sempre use código IBGE completo com 7 dígitos'],
    ['6. Esta versão é focada em REGIME GERAL - mais campos serão adicionados futuramente'],
  ];

  const wsInstrucoes = XLSX.utils.aoa_to_sheet(instrucoes);
  wsInstrucoes['!cols'] = [{ wch: 25 }, { wch: 50 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, wsInstrucoes, 'Instruções');

  // Gerar arquivo e fazer download
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `template_base_simulacao_${timestamp}.xlsx`);
};

/**
 * Gera e faz download de um template CSV simplificado para REGIME GERAL
 */
export const downloadTemplateCSV = () => {
  const csvContent = `tipoCalculadora,uf,municipio,dataOperacao,item,ncm,nbs,cst,baseCalculo,classificacaoTributaria,quantidade,unidadeMedida
REGIME_GERAL,RS,4314902,2027-01-01T10:00:00-03:00,1,24021000,,000,200.00,000001,10,UN
REGIME_GERAL,SP,3550308,2027-01-01T14:30:00-03:00,2,84715010,,000,1500.00,000001,5,UN
REGIME_GERAL,MG,3106200,2027-01-02T09:00:00-03:00,3,22030000,,000,50.00,000001,100,LT`;

  // Criar blob e fazer download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split('T')[0];

  link.setAttribute('href', url);
  link.setAttribute('download', `template_base_simulacao_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
