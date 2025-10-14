import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { useCalcularBaseCalculoCBSIBS } from '../hooks/useCalculadora';
import { ROUTES } from '../../../utils/constants';
import { useAuth } from '../../auth/hooks/useAuth';
import axios from 'axios';

const baseCalculoCBSIBSSchema = z.object({
  valorFornecimento: z.string().optional(),
  ajusteValorOperacao: z.string().optional(),
  juros: z.string().optional(),
  multas: z.string().optional(),
  acrescimos: z.string().optional(),
  encargos: z.string().optional(),
  descontosCondicionais: z.string().optional(),
  fretePorDentro: z.string().optional(),
  outrosTributos: z.string().optional(),
  impostoSeletivo: z.string().optional(),
  demaisImportancias: z.string().optional(),
  icms: z.string().optional(),
  iss: z.string().optional(),
  pis: z.string().optional(),
  cofins: z.string().optional(),
});

type FormData = z.infer<typeof baseCalculoCBSIBSSchema>;

interface Props {
  onSuccess?: (resultado: any) => void;
}

export const BaseCalculoCBSIBSForm: React.FC<Props> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const calcularBaseCBSIBSMutation = useCalcularBaseCalculoCBSIBS();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseCalculoCBSIBSSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Converter apenas os campos preenchidos para número
      const payload: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          payload[key] = Number(value);
        }
      });

      const resultado = await calcularBaseCBSIBSMutation.mutateAsync(payload);
      if (onSuccess) onSuccess(resultado);
    } catch (error) {
      console.error('Erro ao calcular base CBS/IBS:', error);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Base de Cálculo - CBS/IBS (Mercadorias)
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Preencha os valores para calcular a base de cálculo de CBS e IBS. Todos os campos são opcionais.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Valores Base */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Valores da Operação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valor do Fornecimento"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.valorFornecimento?.message}
              {...register('valorFornecimento')}
            />

            <Input
              label="Ajuste Valor Operação"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.ajusteValorOperacao?.message}
              {...register('ajusteValorOperacao')}
            />
          </div>
        </div>

        {/* Acréscimos */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Acréscimos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Juros"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.juros?.message}
              {...register('juros')}
            />

            <Input
              label="Multas"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.multas?.message}
              {...register('multas')}
            />

            <Input
              label="Acréscimos"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.acrescimos?.message}
              {...register('acrescimos')}
            />

            <Input
              label="Encargos"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.encargos?.message}
              {...register('encargos')}
            />

            <Input
              label="Frete Por Dentro"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.fretePorDentro?.message}
              {...register('fretePorDentro')}
            />

            <Input
              label="Demais Importâncias"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.demaisImportancias?.message}
              {...register('demaisImportancias')}
            />
          </div>
        </div>

        {/* Deduções */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Deduções</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Descontos Condicionais"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.descontosCondicionais?.message}
              {...register('descontosCondicionais')}
            />

            <Input
              label="Imposto Seletivo"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.impostoSeletivo?.message}
              {...register('impostoSeletivo')}
            />
          </div>
        </div>

        {/* Tributos */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tributos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Outros Tributos"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.outrosTributos?.message}
              {...register('outrosTributos')}
            />

            <Input
              label="ICMS"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.icms?.message}
              {...register('icms')}
            />

            <Input
              label="ISS"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.iss?.message}
              {...register('iss')}
            />

            <Input
              label="PIS"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.pis?.message}
              {...register('pis')}
            />

            <Input
              label="COFINS"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.cofins?.message}
              {...register('cofins')}
            />
          </div>
        </div>

        {/* Mensagem de erro */}
        {calcularBaseCBSIBSMutation.isError && (
          <div className={`p-4 border rounded-lg ${
            axios.isAxiosError(calcularBaseCBSIBSMutation.error) && calcularBaseCBSIBSMutation.error.response?.status === 403
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            {axios.isAxiosError(calcularBaseCBSIBSMutation.error) && calcularBaseCBSIBSMutation.error.response?.status === 403 ? (
              <div>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-2">
                  Limite de cálculos atingido
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
                  {user?.role === 'ADMIN'
                    ? 'Você atingiu o limite de cálculos do seu plano atual. Faça upgrade para continuar calculando.'
                    : 'O limite de cálculos do plano foi atingido. Entre em contato com o administrador da conta para fazer upgrade do plano.'}
                </p>
                {user?.role === 'ADMIN' && (
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                    className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
                  >
                    Ver planos e fazer upgrade →
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                {axios.isAxiosError(calcularBaseCBSIBSMutation.error) && calcularBaseCBSIBSMutation.error.response?.data?.message
                  ? calcularBaseCBSIBSMutation.error.response.data.message
                  : 'Erro ao realizar cálculo. Verifique os dados e tente novamente.'}
              </p>
            )}
          </div>
        )}

        {/* Botão */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={calcularBaseCBSIBSMutation.isPending}
        >
          {calcularBaseCBSIBSMutation.isPending ? 'Calculando...' : 'Calcular Base de Cálculo CBS/IBS'}
        </Button>
      </form>
    </Card>
  );
};
