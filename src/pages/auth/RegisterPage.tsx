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
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  tenantName: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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
            <Input
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              error={errors.name?.message}
              {...register('name')}
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

            <Input
              label="Nome da Empresa"
              type="text"
              placeholder="Minha Empresa Ltda"
              helperText="Este será o nome do seu tenant no sistema"
              error={errors.tenantName?.message}
              {...register('tenantName')}
            />

            {registerMutation.isError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Erro ao criar conta. Email ou empresa já cadastrados.
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
          <p>Plano BASIC: 50 cálculos/mês - R$ 99,90</p>
          <p className="mt-1">Primeiro mês grátis!</p>
        </div>
      </div>
    </div>
  );
};
