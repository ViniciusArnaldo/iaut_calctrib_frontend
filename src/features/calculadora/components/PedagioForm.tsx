import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';
import { useUFs, useMunicipios } from '../hooks/useDadosAbertos';
import { useCalcularPedagio } from '../hooks/useCalculadora';

const trechoSchema = z.object({
  municipio: z.string().min(1, 'Selecione um município'),
  uf: z.string().min(2, 'Selecione uma UF'),
  extensao: z.string().min(1, 'Extensão é obrigatória'),
});

const pedagioSchema = z.object({
  dataHoraEmissao: z.string().min(1, 'Data é obrigatória'),
  codigoMunicipioOrigem: z.string().min(1, 'Município de origem é obrigatório'),
  ufMunicipioOrigem: z.string().min(2, 'UF de origem é obrigatória'),
  cst: z.string().min(3, 'CST deve ter 3 dígitos').max(3, 'CST deve ter 3 dígitos'),
  baseCalculo: z.string().min(1, 'Base de cálculo é obrigatória'),
  cClassTrib: z.string().min(6, 'Classificação tributária deve ter 6 dígitos').max(6),
  trechos: z.array(trechoSchema).min(1, 'Adicione pelo menos um trecho'),
});

type FormData = z.infer<typeof pedagioSchema>;

interface Props {
  onSuccess?: (resultado: any) => void;
}

export const PedagioForm: React.FC<Props> = ({ onSuccess }) => {
  const { data: ufs, isLoading: loadingUfs } = useUFs();
  const calcularPedagioMutation = useCalcularPedagio();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(pedagioSchema),
    defaultValues: {
      dataHoraEmissao: new Date().toISOString().split('T')[0],
      cst: '',
      baseCalculo: '',
      cClassTrib: '',
      trechos: [
        {
          municipio: '',
          uf: '',
          extensao: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trechos',
  });

  const selectedUfOrigem = watch('ufMunicipioOrigem');
  const { data: municipiosOrigem, isLoading: loadingMunicipiosOrigem } = useMunicipios(selectedUfOrigem);

  useEffect(() => {
    if (selectedUfOrigem) {
      setValue('codigoMunicipioOrigem', '');
    }
  }, [selectedUfOrigem, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const dataISO = new Date(data.dataHoraEmissao + 'T00:00:00').toISOString();

      const payload = {
        dataHoraEmissao: dataISO,
        codigoMunicipioOrigem: Number(data.codigoMunicipioOrigem),
        ufMunicipioOrigem: data.ufMunicipioOrigem,
        cst: data.cst,
        baseCalculo: Number(data.baseCalculo),
        cClassTrib: data.cClassTrib,
        trechos: data.trechos.map((trecho, index) => ({
          numero: index + 1,
          municipio: Number(trecho.municipio),
          uf: trecho.uf,
          extensao: Number(trecho.extensao),
        })),
      };

      const resultado = await calcularPedagioMutation.mutateAsync(payload);
      if (onSuccess) onSuccess(resultado);
    } catch (error) {
      console.error('Erro ao calcular pedágio:', error);
    }
  };

  const adicionarTrecho = () => {
    append({
      municipio: '',
      uf: '',
      extensao: '',
    });
  };

  const removerTrecho = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Cálculo de Pedágio</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Data */}
        <div>
          <Input
            label="Data da Operação"
            type="date"
            error={errors.dataHoraEmissao?.message}
            {...register('dataHoraEmissao')}
          />
        </div>

        {/* Município de Origem */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Origem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="UF de Origem"
              placeholder="Selecione a UF"
              options={
                ufs?.map((uf) => ({
                  value: uf.sigla,
                  label: `${uf.sigla} - ${uf.nome}`,
                })) || []
              }
              error={errors.ufMunicipioOrigem?.message}
              disabled={loadingUfs}
              {...register('ufMunicipioOrigem')}
            />

            <Select
              label="Município de Origem"
              placeholder="Selecione o município"
              options={
                municipiosOrigem?.map((mun) => ({
                  value: mun.codigo.toString(),
                  label: mun.nome,
                })) || []
              }
              error={errors.codigoMunicipioOrigem?.message}
              disabled={!selectedUfOrigem || loadingMunicipiosOrigem}
              {...register('codigoMunicipioOrigem')}
            />
          </div>
        </div>

        {/* Dados Tributários */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Tributários</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="CST (Código Situação Tributária)"
              type="text"
              placeholder="000"
              maxLength={3}
              helperText="3 dígitos"
              error={errors.cst?.message}
              {...register('cst')}
            />

            <Input
              label="Base de Cálculo (R$)"
              type="number"
              step="0.01"
              placeholder="1000.00"
              error={errors.baseCalculo?.message}
              {...register('baseCalculo')}
            />

            <Input
              label="Classificação Tributária"
              type="text"
              placeholder="000000"
              maxLength={6}
              helperText="6 dígitos (obrigatório)"
              error={errors.cClassTrib?.message}
              {...register('cClassTrib')}
            />
          </div>
        </div>

        <hr className="my-6" />

        {/* Trechos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Trechos</h3>
            <Button type="button" variant="secondary" size="sm" onClick={adicionarTrecho}>
              + Adicionar Trecho
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <TrechoFields
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                ufs={ufs || []}
                loadingUfs={loadingUfs}
                onRemove={() => removerTrecho(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Botão */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={calcularPedagioMutation.isPending}
        >
          {calcularPedagioMutation.isPending ? 'Calculando...' : 'Calcular Pedágio'}
        </Button>
      </form>
    </Card>
  );
};

// Componente auxiliar para campos de trecho
interface TrechoFieldsProps {
  index: number;
  register: any;
  errors: any;
  ufs: any[];
  loadingUfs: boolean;
  onRemove: () => void;
  canRemove: boolean;
}

const TrechoFields: React.FC<TrechoFieldsProps> = ({
  index,
  register,
  errors,
  ufs,
  loadingUfs,
  onRemove,
  canRemove,
}) => {
  const { watch } = useForm();
  const selectedUf = watch(`trechos.${index}.uf`);
  const { data: municipios, isLoading: loadingMunicipios } = useMunicipios(selectedUf);

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-medium text-gray-700">Trecho {index + 1}</h4>
        {canRemove && (
          <Button type="button" variant="danger" size="sm" onClick={onRemove}>
            Remover
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="UF"
          placeholder="Selecione a UF"
          options={
            ufs.map((uf) => ({
              value: uf.sigla,
              label: `${uf.sigla} - ${uf.nome}`,
            }))
          }
          error={errors.trechos?.[index]?.uf?.message}
          disabled={loadingUfs}
          {...register(`trechos.${index}.uf`)}
        />

        <Select
          label="Município"
          placeholder="Selecione o município"
          options={
            municipios?.map((mun: any) => ({
              value: mun.codigo.toString(),
              label: mun.nome,
            })) || []
          }
          error={errors.trechos?.[index]?.municipio?.message}
          disabled={!selectedUf || loadingMunicipios}
          {...register(`trechos.${index}.municipio`)}
        />

        <Input
          label="Extensão (km)"
          type="number"
          step="0.01"
          placeholder="10.5"
          error={errors.trechos?.[index]?.extensao?.message}
          {...register(`trechos.${index}.extensao`)}
        />
      </div>
    </div>
  );
};
