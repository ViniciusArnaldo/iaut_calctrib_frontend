import apiClient from './axios-instance';
import type { User, CreateUserDTO, UpdateUserDTO, UsersResponse } from '../features/users/types/users.types';

export const usersApi = {
  /**
   * Listar usuários do tenant
   */
  async getUsers(): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users');
    return response.data;
  },

  /**
   * Buscar usuário por ID
   */
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Criar novo usuário
   */
  async createUser(data: CreateUserDTO): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  /**
   * Atualizar usuário
   */
  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Deletar usuário permanentemente (hard delete)
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Desativar usuário (soft delete)
   */
  async deactivateUser(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Ativar usuário
   */
  async activateUser(id: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`/users/${id}/activate`);
    return response.data;
  },
};
