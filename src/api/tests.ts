import apiClient from './client';
import type { TestCollectionResource, TestResource } from '@/types/test';

export const testsApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<TestCollectionResource>('/tests', { params }),
  getById: (id: number) =>
    apiClient.get<TestResource>(`/tests/${id}`),
};
