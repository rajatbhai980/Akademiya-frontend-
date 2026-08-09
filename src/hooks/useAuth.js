import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const defaultAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => undefined,
  logout: async () => undefined,
  refreshUser: async () => undefined,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuthState;
}
