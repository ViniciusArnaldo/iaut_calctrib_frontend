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

/**
 * Hook para buscar classificações tributárias por CST (com cache no backend)
 * Só executa quando CST tiver 3 dígitos
 */
export const useClassificacoesPorCST = (cst: string | undefined, data: string) => {
  return useQuery({
    queryKey: ['classificacoes-cst', cst, data],
    queryFn: () => calculadoraApi.consultarClassificacoesPorCST(cst!, data),
    enabled: !!cst && cst.length === 3, // Só executa se CST tiver 3 dígitos
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};

/**
 * Hook para buscar NCMs do banco (para select no formulário)
 */
export const useNCMsBanco = (search?: string) => {
  return useQuery({
    queryKey: ['ncm-banco', search],
    queryFn: () => calculadoraApi.buscarNCMs(search),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar NBS do banco (para select no formulário)
 */
export const useNBSBanco = (search?: string) => {
  return useQuery({
    queryKey: ['nbs-banco', search],
    queryFn: () => calculadoraApi.buscarNBS(search),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar CSTs do banco (para select no formulário)
 */
export const useCSTsBanco = () => {
  return useQuery({
    queryKey: ['cst-banco'],
    queryFn: () => calculadoraApi.buscarCSTs(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar classificações tributárias por CST do banco
 * Só executa quando CST tiver 3 dígitos
 */
export const useClassificacoesPorCSTBanco = (cst: string | undefined) => {
  return useQuery({
    queryKey: ['classificacoes-cst-banco', cst],
    queryFn: () => calculadoraApi.buscarClassificacoesPorCSTBanco(cst!),
    enabled: !!cst && cst.length === 3,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
