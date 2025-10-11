import apiClient from './axios-instance';
import type {
  CalcularRegimeGeralDTO,
  CalcularPedagioDTO,
  CalcularBaseCalculoISDTO,
  CalcularBaseCalculoCBSIBSDTO,
  ResultadoCalculoRegimeGeral,
  HistoricoResponse,
  EstatisticasResponse,
  UF,
  Municipio,
  NCM,
} from '../features/calculadora/types/calculadora.types';

export const calculadoraApi = {
  // ============================================
  // CÁLCULOS
  // ============================================

  /**
   * Calcular tributos regime geral (CBS, IBS, IS)
   */
  async calcularRegimeGeral(data: CalcularRegimeGeralDTO): Promise<ResultadoCalculoRegimeGeral> {
    const response = await apiClient.post<ResultadoCalculoRegimeGeral>(
      '/calculadora/regime-geral',
      data
    );
    return response.data;
  },

  /**
   * Calcular pedágio
   */
  async calcularPedagio(data: CalcularPedagioDTO): Promise<any> {
    const response = await apiClient.post('/calculadora/pedagio', data);
    return response.data;
  },

  /**
   * Calcular base de cálculo do Imposto Seletivo
   */
  async calcularBaseCalculoIS(data: CalcularBaseCalculoISDTO): Promise<any> {
    const response = await apiClient.post('/calculadora/base-calculo/is-mercadorias', data);
    return response.data;
  },

  /**
   * Calcular base de cálculo CBS/IBS
   */
  async calcularBaseCalculoCBSIBS(data: CalcularBaseCalculoCBSIBSDTO): Promise<any> {
    const response = await apiClient.post('/calculadora/base-calculo/cbs-ibs-mercadorias', data);
    return response.data;
  },

  // ============================================
  // HISTÓRICO
  // ============================================

  /**
   * Buscar histórico de cálculos
   */
  async buscarHistorico(params?: {
    tipo?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }): Promise<HistoricoResponse> {
    const response = await apiClient.get<HistoricoResponse>('/calculadora/historico', {
      params,
    });
    return response.data;
  },

  /**
   * Buscar cálculo por ID
   */
  async buscarCalculoPorId(id: number): Promise<any> {
    const response = await apiClient.get(`/calculadora/historico/${id}`);
    return response.data;
  },

  /**
   * Obter estatísticas de uso
   */
  async obterEstatisticas(): Promise<EstatisticasResponse> {
    const response = await apiClient.get<EstatisticasResponse>('/calculadora/estatisticas');
    return response.data;
  },

  // ============================================
  // DADOS ABERTOS (para popular dropdowns)
  // ============================================

  /**
   * Listar UFs
   */
  async consultarUfs(): Promise<UF[]> {
    const response = await apiClient.get<UF[]>('/calculadora/dados-abertos/ufs');
    return response.data;
  },

  /**
   * Listar municípios de uma UF
   */
  async consultarMunicipios(siglaUf: string): Promise<Municipio[]> {
    const response = await apiClient.get<Municipio[]>('/calculadora/dados-abertos/municipios', {
      params: { siglaUf },
    });
    return response.data;
  },

  /**
   * Consultar NCM
   */
  async consultarNcm(ncm: string, data: string): Promise<NCM> {
    const response = await apiClient.get<NCM>('/calculadora/dados-abertos/ncm', {
      params: { ncm, data },
    });
    return response.data;
  },

  /**
   * Consultar classificações tributárias por ID de situação tributária
   */
  async consultarClassificacoesPorSituacao(idSituacaoTributaria: number, data: string): Promise<any[]> {
    const response = await apiClient.get(`/calculadora/dados-abertos/classificacoes-tributarias/${idSituacaoTributaria}`, {
      params: { data },
    });
    return response.data;
  },

  /**
   * Consultar fundamentações legais
   */
  async consultarFundamentacoesLegais(data: string): Promise<any[]> {
    const response = await apiClient.get('/calculadora/dados-abertos/fundamentacoes-legais', {
      params: { data },
    });
    return response.data;
  },

  // ============================================
  // XML - VALIDAÇÃO E GERAÇÃO
  // ============================================

  /**
   * Validar XML do ROC
   */
  async validarXml(tipo: string, subtipo: string, xmlContent: string): Promise<boolean> {
    const response = await apiClient.post<boolean>('/calculadora/validar-xml', xmlContent, {
      params: { tipo, subtipo },
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    return response.data;
  },

  /**
   * Gerar XML do ROC
   */
  async gerarXml(roc: any): Promise<any> {
    const response = await apiClient.post('/calculadora/gerar-xml', roc);
    return response.data;
  },

  /**
   * Limpar cache
   */
  async limparCache(): Promise<void> {
    await apiClient.post('/calculadora/cache/limpar');
  },
};
