import apiClient from './client';
import type { LoginDto, UserCreateDto, UserResource, JWTToken } from '@/types/auth';

export const authApi = {
  register: (data: UserCreateDto) =>
    apiClient.post<UserResource>('/user', data),

  login: (data: LoginDto) =>
    apiClient.post<JWTToken>('/authenticate', data),

  getCurrentUser: () =>
    apiClient.get<UserResource>('/user'),
};
