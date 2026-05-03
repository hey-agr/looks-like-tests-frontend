import apiClient from './client';
import type { UsersFilter, UserResource } from '@/types/auth';

export const usersApi = {
  getFiltered: (filter: UsersFilter) =>
    apiClient.get<{ users: UserResource[]; totalPages: number; totalElements: number }>('/users', {
      params: filter,
    }),

  getCurrent: () =>
    apiClient.get<UserResource>('/user'),

  updateCurrent: (data: Record<string, string | undefined>) =>
    apiClient.patch<UserResource>('/user', data),
};
