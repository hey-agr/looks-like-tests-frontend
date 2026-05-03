export interface UserCreateDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  authorities: string[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface JWTToken {
  value: string;
}

export interface UserResource {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string | null;
  activated: boolean;
  authorities: string[];
}

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phone?: string;
}

export interface UsersFilter {
  username?: string;
  authority?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'SUPERVISOR' | 'STUDENT';

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Администратор',
  TEACHER: 'Учитель',
  SUPERVISOR: 'Наблюдатель',
  STUDENT: 'Студент',
};

export const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  TEACHER: 'bg-blue-100 text-blue-800',
  SUPERVISOR: 'bg-orange-100 text-orange-800',
  STUDENT: 'bg-green-100 text-green-800',
};
