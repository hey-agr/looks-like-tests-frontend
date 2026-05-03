export interface UserCreateDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  authorities: string[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface JWTToken {
  token: string;
}

export interface UserResource {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  active: boolean;
}

export interface UserUpdateDto {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  email?: string;
}

export interface UserResource {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  active: boolean;
}

export interface UsersFilter {
  username?: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  active?: boolean;
  page?: number;
  size?: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
