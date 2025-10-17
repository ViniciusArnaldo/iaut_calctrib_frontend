import { useMutation } from '@tanstack/react-query';
import { analisesApi } from '../api/analisesApi';
import type {
  ExecutarAnaliseDTO,
  ConfiguracaoAnalise,
} from '../types/analises.types';

/**
 * Hook para executar análise
 */
export const useExecutarAnalise = () => {
  return useMutation({
    mutationFn: (dados: ExecutarAnaliseDTO) => analisesApi.executar(dados),
  });
};

/**
 * Hook para exportar análise
 */
export const useExportarAnalise = () => {
  return useMutation({
    mutationFn: ({ configuracao, formato }: { configuracao: ConfiguracaoAnalise; formato: 'xlsx' | 'csv' | 'pdf' }) =>
      analisesApi.exportar(configuracao, formato),
    onSuccess: (blob, variables) => {
      // Cria link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `analise-${timestamp}.${variables.formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
