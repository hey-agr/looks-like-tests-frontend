import apiClient from './client';
import type { UsersFilter, UserResource } from '@/types/auth';

export const usersApi = {
  getFiltered: (filter: UsersFilter) =>
    apiClient.get<{ users: UserResource[]; totalPages: number; totalElements: number }>('/users', {
      params: filter,
    }),

  getCurrent: () =>
    apiClient.get<UserResource>('/user'),

  updateCurrent: (data: Partial<Pick<UserResource, 'firstname' | 'lastname' | 'middlename' | 'email'>>) =>
    apiClient.patch<UserResource>('/user', data),
};
