import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import type { RegisterFormData } from '../types/auth.types';

export const useRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      await register(data);
    },
    onSuccess: () => {
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
};
