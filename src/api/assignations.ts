import apiClient from './client';

export interface CreateStudentToTeacherAssignation {
  studentId: number;
  teacherId: number;
}

export interface StudentToTeacherAssignationResource {
  id: number;
  studentId: number;
  teacherId: number;
}

export const assignationsApi = {
  createStudentToTeacher: (data: CreateStudentToTeacherAssignation) =>
    apiClient.post<StudentToTeacherAssignationResource>('/assignations/student-to-teacher', data),
};
