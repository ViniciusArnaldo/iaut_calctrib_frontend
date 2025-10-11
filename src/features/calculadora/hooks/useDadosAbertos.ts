import { useQuery } from '@tanstack/react-query';
import { calculadoraApi } from '../../../api/calculadora.api';

/**
 * Hook para buscar UFs
 */
export const useUFs = () => {
  return useQuery({
    queryKey: ['ufs'],
    queryFn: () => calculadoraApi.consultarUfs(),
    staleTime: 24 * 60 * 60 * 1000, // 24 horas - dados não mudam
  });
};

/**
 * Hook para buscar municípios de uma UF
 */
export const useMunicipios = (siglaUf: string | undefined) => {
  return useQuery({
    queryKey: ['municipios', siglaUf],
    queryFn: () => calculadoraApi.consultarMunicipios(siglaUf!),
    enabled: !!siglaUf, // Só executa se siglaUf estiver definida
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};

/**
 * Hook para consultar NCM
 */
export const useNCM = (ncm: string | undefined, data: string) => {
  return useQuery({
    queryKey: ['ncm', ncm, data],
    queryFn: () => calculadoraApi.consultarNcm(ncm!, data),
    enabled: !!ncm && ncm.length >= 8, // Só executa se NCM tiver pelo menos 8 dígitos
    staleTime: 60 * 60 * 1000, // 1 hora
  });
};

/**
 * Hook para consultar classificações tributárias por situação
 */
export const useClassificacoesPorSituacao = (idSituacaoTributaria: number | undefined, data: string) => {
  return useQuery({
    queryKey: ['classificacoes-situacao', idSituacaoTributaria, data],
    queryFn: () => calculadoraApi.consultarClassificacoesPorSituacao(idSituacaoTributaria!, data),
    enabled: !!idSituacaoTributaria,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};

/**
 * Hook para consultar fundamentações legais
 */
export const useFundamentacoesLegais = (data: string) => {
  return useQuery({
    queryKey: ['fundamentacoes-legais', data],
    queryFn: () => calculadoraApi.consultarFundamentacoesLegais(data),
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};
