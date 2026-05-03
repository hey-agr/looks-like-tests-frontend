import apiClient from './client';

export interface CreateStudentToTeacherAssignation {
  studentId: number;
  teacherId: number;
}

export interface CreateStudentToTestAssignation {
  studentId: number;
  testId: number;
}

export interface StudentToTeacherAssignationResource {
  id: number;
  studentId: number;
  teacherId: number;
}

export interface StudentToTestAssignationResource {
  id: number;
  studentId: number;
  testId: number;
}

export const assignationsApi = {
  createStudentToTeacher: (data: CreateStudentToTeacherAssignation) =>
    apiClient.post<StudentToTeacherAssignationResource>('/assignations/student-to-teacher', data),
  createStudentToTest: (data: CreateStudentToTestAssignation) =>
    apiClient.post<StudentToTestAssignationResource>('/assignations/student-to-test', data),
};
