import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useRegister } from '../../features/auth/hooks/useRegister';
import { ROUTES } from '../../utils/constants';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos')
    .min(11, 'CPF inválido')
    .max(11, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  tenantName: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve conter exatamente 14 dígitos')
    .min(14, 'CNPJ inválido')
    .max(14, 'CNPJ inválido'),
  slug: z
    .string()
    .min(3, 'Identificador deve ter pelo menos 3 caracteres')
    .max(50, 'Identificador deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífens'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Função para formatar CPF (xxx.xxx.xxx-xx)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers;
  };

  // Função para formatar CNPJ (xx.xxx.xxx/xxxx-xx)
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers;
  };

  // Função para formatar slug
  const formatSlug = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9-]/g, '-') // Substitui caracteres especiais por hífen
      .replace(/--+/g, '-') // Remove hífens duplicados
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
  };

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calculadora Tributária</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Crie sua conta gratuitamente</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Cadastro</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                Seus Dados
              </h3>

              <Input
                label="Nome Completo"
                type="text"
                placeholder="João Silva"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="CPF"
                type="text"
                placeholder="12345678900"
                helperText="Apenas números (11 dígitos)"
                error={errors.cpf?.message}
                {...register('cpf', {
                  onChange: (e) => {
                    const formatted = formatCPF(e.target.value);
                    setValue('cpf', formatted);
                  },
                })}
                maxLength={11}
              />

              <Input
                label="Email"
                type="email"
                placeholder="joao@empresa.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="********"
                helperText="Mínimo 8 caracteres, com maiúsculas, minúsculas e números"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Seção: Dados da Empresa */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                Dados da Empresa
              </h3>

              <Input
                label="Nome da Empresa"
                type="text"
                placeholder="Minha Empresa Ltda"
                error={errors.tenantName?.message}
                {...register('tenantName')}
              />

              <Input
                label="CNPJ"
                type="text"
                placeholder="12345678000190"
                helperText="Apenas números (14 dígitos)"
                error={errors.cnpj?.message}
                {...register('cnpj', {
                  onChange: (e) => {
                    const formatted = formatCNPJ(e.target.value);
                    setValue('cnpj', formatted);
                  },
                })}
                maxLength={14}
              />

              <Input
                label="Identificador da Empresa (Slug)"
                type="text"
                placeholder="minha-empresa"
                helperText={`Seu link de acesso será: ${watch('slug') || 'seu-identificador'}.calctrib.com.br`}
                error={errors.slug?.message}
                {...register('slug', {
                  onChange: (e) => {
                    const formatted = formatSlug(e.target.value);
                    setValue('slug', formatted);
                  },
                })}
              />
            </div>

            {registerMutation.isError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Erro ao criar conta. Email, CPF, CNPJ ou identificador já cadastrados.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Faça login
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold text-green-600 dark:text-green-400">5 cálculos grátis para testar!</p>
          <p className="mt-1">Depois: Plano BASIC 50 cálculos/mês - R$ 99,90</p>
        </div>
      </div>
    </div>
  );
};
