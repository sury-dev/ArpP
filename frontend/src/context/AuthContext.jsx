import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    return savedUser && savedToken ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (requiredRole === 'admin') return false;
    if (user.role === 'user' && requiredRole === 'user') return true;
    if (user.role === 'read-only' && requiredRole === 'read-only') return true;
    return false;
  }, [user]);

  const canEdit = useMemo(() => {
    return user && (user.role === 'admin' || user.role === 'user');
  }, [user]);

  const canDelete = useMemo(() => {
    return user && (user.role === 'admin' || user.role === 'user');
  }, [user]);

  const canAdd = useMemo(() => {
    return user && (user.role === 'admin' || user.role === 'user');
  }, [user]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    canEdit,
    canDelete,
    canAdd
  }), [user, token, loading, login, logout, isAuthenticated, hasRole, canEdit, canDelete, canAdd]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
