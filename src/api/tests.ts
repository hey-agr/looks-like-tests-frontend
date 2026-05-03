import apiClient from './client';
import type {
  TestCollectionResource,
  TestResource,
  CreateTestDto,
  TestProgressResource,
  CreateTestAnswersDto,
  TestResultResource
} from '@/types/test';

export const testsApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<TestCollectionResource>('/tests', { params }),
  getById: (id: number) =>
    apiClient.get<TestResource>(`/tests/${id}`),
  create: (data: CreateTestDto) =>
    apiClient.post<TestResource>('/tests', data),
  startTest: (testId: number) =>
    apiClient.post<TestProgressResource>(`/tests/${testId}/starts`),
  finishTest: (progressId: number, data: CreateTestAnswersDto) =>
    apiClient.post<TestResultResource>(`/tests/progress/${progressId}/finishes`, data),
};
