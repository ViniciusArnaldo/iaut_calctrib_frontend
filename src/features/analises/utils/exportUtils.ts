/**
 * Utilitários para exportação de análises
 */

/**
 * Faz download de um blob como arquivo
 */
export const downloadBlob = (blob: Blob, nomeArquivo: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Exporta um elemento HTML como PNG usando canvas
 */
export const exportarElementoComoPNG = async (
  elementId: string,
  nomeArquivo: string
): Promise<void> => {
  const elemento = document.getElementById(elementId);
  if (!elemento) {
    throw new Error(`Elemento com ID "${elementId}" não encontrado`);
  }

  // Dinamicamente importar html2canvas apenas quando necessário
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(elemento, {
    backgroundColor: '#ffffff',
    scale: 2, // Melhor qualidade
    logging: false,
    useCORS: true,
  });

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, nomeArquivo);
    }
  }, 'image/png');
};

/**
 * Converte dados para CSV
 */
export const converterParaCSV = (dados: any[]): string => {
  if (!dados || dados.length === 0) {
    return '';
  }

  // Obter headers
  const headers = Object.keys(dados[0]);

  // Criar linhas
  const linhas = dados.map((linha) =>
    headers.map((header) => {
      const valor = linha[header];
      // Escapar aspas duplas e envolver em aspas se contiver vírgula
      if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"'))) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return valor;
    }).join(',')
  );

  return [headers.join(','), ...linhas].join('\n');
};

/**
 * Faz download de uma string como CSV
 */
export const downloadCSV = (csvContent: string, nomeArquivo: string): void => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \ufeff = BOM para UTF-8
  downloadBlob(blob, nomeArquivo);
};

/**
 * Gera nome de arquivo baseado no nome da análise e data
 */
export const gerarNomeArquivo = (
  nomeAnalise: string,
  formato: 'xlsx' | 'csv' | 'png'
): string => {
  const dataHora = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const nomeSeguro = nomeAnalise
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9]/g, '_') // Substitui caracteres especiais
    .toLowerCase();

  return `${nomeSeguro}_${dataHora}.${formato}`;
};
