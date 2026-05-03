import apiClient from './client';
import type { StudentTestAssignationCollectionResource, StudentTestHistoryCollectionResource } from '@/types/test';

export const studentsApi = {
  getAssignations: (params?: { page?: number; size?: number; isActual?: boolean }) =>
    apiClient.get<StudentTestAssignationCollectionResource>('/students/tests/assignations', { params }),
  getResults: (params?: { page?: number; size?: number }) =>
    apiClient.get<StudentTestHistoryCollectionResource>('/students/tests/results', { params }),
};
