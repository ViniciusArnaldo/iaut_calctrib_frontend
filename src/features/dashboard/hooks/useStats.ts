import { useQuery } from '@tanstack/react-query';
import { calculadoraApi } from '../../../api/calculadora.api';

export const useEstatisticas = () => {
  return useQuery({
    queryKey: ['estatisticas'],
    queryFn: () => calculadoraApi.obterEstatisticas(),
    staleTime: 30 * 1000, // 30 segundos
  });
};
