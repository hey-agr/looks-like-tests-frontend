import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { UserResource, LoginDto, UserCreateDto } from '@/types/auth';
import { authApi } from '@/api/auth';

interface AuthState {
  user: UserResource | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginDto) => Promise<void>;
  register: (data: UserCreateDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    if (state.token) {
      authApi
        .getCurrentUser()
        .then((res) => {
          setState({ user: res.data, token: state.token, isAuthenticated: true, isLoading: false });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const res = await authApi.login(data);
    const token = res.data.token;
    localStorage.setItem('token', token);
    const userRes = await authApi.getCurrentUser();
    setState({ user: userRes.data, token, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (data: UserCreateDto) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
