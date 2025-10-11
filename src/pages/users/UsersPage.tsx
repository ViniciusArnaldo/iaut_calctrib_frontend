import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Ban, Trash2 } from 'lucide-react';
import {
  useUsers,
  useCreateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
} from '../../features/users/hooks/useUsers';
import type { CreateUserDTO, User } from '../../features/users/types/users.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  role: z.enum(['ADMIN', 'USER']),
});

type FormData = z.infer<typeof userSchema>;

export const UsersPage: React.FC = () => {
  const { data, isLoading } = useUsers();
  const createMutation = useCreateUser();
  const deleteMutation = useDeleteUser();
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await createMutation.mutateAsync(formData as CreateUserDTO);
      setShowModal(false);
      reset();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleToggleClick = (user: User) => {
    setSelectedUser(user);
    setShowToggleConfirm(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.isActive) {
        // Desativar
        await deactivateMutation.mutateAsync(selectedUser.id);
      } else {
        // Ativar
        await activateMutation.mutateAsync(selectedUser.id);
      }
      setShowToggleConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Usuários</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Novo Usuário
          </Button>
        </div>

        <Card>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Carregando usuários...</p>
            </div>
          ) : data?.users && data.users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleToggleClick(user)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium"
                          title={user.isActive ? 'Desativar' : 'Ativar'}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          {user.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="inline-flex items-center text-red-600 hover:text-red-900 font-medium"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando um novo usuário.
              </p>
            </div>
          )}
        </Card>

        {/* Modal de Criação */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Usuário</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Nome"
                  type="text"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Senha"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Select
                  label="Função"
                  options={[
                    { value: 'USER', label: 'Usuário' },
                    { value: 'ADMIN', label: 'Administrador' },
                  ]}
                  error={errors.role?.message}
                  {...register('role')}
                />

                {createMutation.isError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      Erro ao criar usuário. Verifique os dados e tente novamente.
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={createMutation.isPending}
                  >
                    Criar Usuário
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      reset();
                    }}
                    disabled={createMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Modal de Confirmação - Desativar/Ativar */}
        {showToggleConfirm && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedUser.isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja {selectedUser.isActive ? 'desativar' : 'ativar'} o usuário{' '}
                <strong>{selectedUser.name}</strong>?
                {selectedUser.isActive && (
                  <span className="block mt-2 text-sm text-orange-600">
                    O usuário não poderá acessar o sistema enquanto estiver desativado.
                  </span>
                )}
              </p>

              {(activateMutation.isError || deactivateMutation.isError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Erro ao alterar status do usuário. Tente novamente.
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmToggle}
                  disabled={activateMutation.isPending || deactivateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {(activateMutation.isPending || deactivateMutation.isPending) ? 'Processando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => {
                    setShowToggleConfirm(false);
                    setSelectedUser(null);
                  }}
                  disabled={activateMutation.isPending || deactivateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Modal de Confirmação - Deletar */}
        {showDeleteConfirm && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deletar Usuário</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar permanentemente o usuário{' '}
                <strong>{selectedUser.name}</strong>?
                <span className="block mt-2 text-sm text-red-600 font-medium">
                  Esta ação não pode ser desfeita!
                </span>
              </p>

              {deleteMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Erro ao deletar usuário. Tente novamente.
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedUser(null);
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
