import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';
import { useUFs, useMunicipios } from '../hooks/useDadosAbertos';
import { useCalcularRegimeGeral } from '../hooks/useCalculadora';
import type { ResultadoCalculoRegimeGeral } from '../types/calculadora.types';

const itemSchema = z.object({
  ncm: z.string().min(8, 'NCM deve ter 8 dígitos').max(8, 'NCM deve ter 8 dígitos'),
  cst: z.string().min(3, 'CST deve ter 3 dígitos').max(3, 'CST deve ter 3 dígitos'),
  baseCalculo: z.string().min(1, 'Base de cálculo é obrigatória'),
  cClassTrib: z.string().min(6, 'Classificação tributária deve ter 6 dígitos').max(6, 'Classificação tributária deve ter 6 dígitos'),
  quantidade: z.string().optional(),
  unidade: z.string().optional(),
  nbs: z.string().optional(),
});

const regimeGeralSchema = z.object({
  uf: z.string().min(2, 'Selecione uma UF'),
  municipio: z.string().min(1, 'Selecione um município'),
  dataHoraEmissao: z.string().min(1, 'Data é obrigatória'),
  itens: z.array(itemSchema).min(1, 'Adicione pelo menos um item'),
});

type FormData = z.infer<typeof regimeGeralSchema>;

interface Props {
  onSuccess?: (resultado: ResultadoCalculoRegimeGeral) => void;
}

export const RegimeGeralForm: React.FC<Props> = ({ onSuccess }) => {
  const calcularMutation = useCalcularRegimeGeral();
  const { data: ufs, isLoading: loadingUfs } = useUFs();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(regimeGeralSchema),
    defaultValues: {
      dataHoraEmissao: new Date().toISOString().split('T')[0],
      itens: [
        {
          ncm: '',
          cst: '',
          baseCalculo: '',
          cClassTrib: '',
          quantidade: '',
          unidade: '',
          nbs: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itens',
  });

  const selectedUf = watch('uf');
  const { data: municipios, isLoading: loadingMunicipios } = useMunicipios(selectedUf);

  // Reset município quando UF mudar
  useEffect(() => {
    if (selectedUf) {
      setValue('municipio', '');
    }
  }, [selectedUf, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Gerar ID único para o ROC
      const rocId = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') :
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Converter data para ISO 8601 com timezone
      const dataISO = new Date(data.dataHoraEmissao + 'T00:00:00').toISOString();

      const payload = {
        id: rocId,
        versao: '0.0.1',
        dataHoraEmissao: dataISO,
        municipio: Number(data.municipio),
        uf: data.uf,
        itens: data.itens.map((item, index) => ({
          numero: index + 1,
          ncm: item.ncm || undefined,
          nbs: item.nbs || undefined,
          cst: item.cst,
          baseCalculo: Number(item.baseCalculo),
          quantidade: item.quantidade ? Number(item.quantidade) : undefined,
          unidade: item.unidade || undefined,
          cClassTrib: item.cClassTrib,
        })),
      };

      const resultado = await calcularMutation.mutateAsync(payload);

      if (onSuccess) {
        onSuccess(resultado);
      }
    } catch (error) {
      console.error('Erro ao calcular:', error);
    }
  };

  const adicionarItem = () => {
    append({
      ncm: '',
      cst: '',
      baseCalculo: '',
      cClassTrib: '',
      quantidade: '',
      unidade: '',
      nbs: '',
    });
  };

  const removerItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Cálculo de Tributos - Regime Geral</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Localização */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Localização</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="UF"
              placeholder="Selecione a UF"
              options={
                ufs?.map((uf) => ({
                  value: uf.sigla,
                  label: `${uf.sigla} - ${uf.nome}`,
                })) || []
              }
              error={errors.uf?.message}
              disabled={loadingUfs}
              {...register('uf')}
            />

            <Select
              label="Município"
              placeholder="Selecione o município"
              options={
                municipios?.map((mun) => ({
                  value: mun.codigo.toString(),
                  label: mun.nome,
                })) || []
              }
              error={errors.municipio?.message}
              disabled={!selectedUf || loadingMunicipios}
              {...register('municipio')}
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <Input
            label="Data da Operação"
            type="date"
            error={errors.dataHoraEmissao?.message}
            {...register('dataHoraEmissao')}
          />
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Itens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Itens</h3>
            <Button type="button" variant="secondary" size="sm" onClick={adicionarItem}>
              + Adicionar Item
            </Button>
          </div>

          {errors.itens?.root && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{errors.itens.root.message}</p>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="NCM"
                    type="text"
                    placeholder="12345678"
                    maxLength={8}
                    helperText="8 dígitos"
                    error={errors.itens?.[index]?.ncm?.message}
                    {...register(`itens.${index}.ncm`)}
                  />

                  <Input
                    label="CST (Código Situação Tributária)"
                    type="text"
                    placeholder="000"
                    maxLength={3}
                    helperText="3 dígitos"
                    error={errors.itens?.[index]?.cst?.message}
                    {...register(`itens.${index}.cst`)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Base de Cálculo (R$)"
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    error={errors.itens?.[index]?.baseCalculo?.message}
                    {...register(`itens.${index}.baseCalculo`)}
                  />

                  <Input
                    label="Classificação Tributária"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    helperText="6 dígitos (obrigatório)"
                    error={errors.itens?.[index]?.cClassTrib?.message}
                    {...register(`itens.${index}.cClassTrib`)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Quantidade (Opcional)"
                    type="number"
                    step="0.01"
                    placeholder="1"
                    error={errors.itens?.[index]?.quantidade?.message}
                    {...register(`itens.${index}.quantidade`)}
                  />

                  <Input
                    label="Unidade (Opcional)"
                    type="text"
                    placeholder="UN, KG, LT"
                    maxLength={6}
                    error={errors.itens?.[index]?.unidade?.message}
                    {...register(`itens.${index}.unidade`)}
                  />

                  <Input
                    label="NBS (Opcional)"
                    type="text"
                    placeholder="109052100"
                    maxLength={9}
                    error={errors.itens?.[index]?.nbs?.message}
                    {...register(`itens.${index}.nbs`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagem de erro */}
        {calcularMutation.isError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Erro ao realizar cálculo. Verifique os dados e tente novamente.
            </p>
          </div>
        )}

        {/* Botão */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={calcularMutation.isPending}
        >
          Calcular Tributos
        </Button>
      </form>
    </Card>
  );
};
