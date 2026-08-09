import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.fetchCurrentUser();
      setIsAuthenticated(Boolean(data.authenticated));
      setUser(data.user ?? null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Populate the CSRF cookie once on load, then check session state.
    authApi
      .fetchCsrfCookie()
      .catch(() => {})
      .finally(() => refreshUser());
  }, [refreshUser]);

  const login = useCallback((userData) => {
    setUser(userData ?? null);
    setIsAuthenticated(Boolean(userData));
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Keep the UI in sync even if the server rejects the logout request.
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isLoading, login, logout, refreshUser }),
    [user, isAuthenticated, isLoading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
