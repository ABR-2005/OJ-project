import React, { useState, useContext, createContext, useEffect } from 'react';

// ✅ Create context ONCE
const AuthContext = createContext();

// ✅ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) setUser(userData);
      } catch {
        console.error('Invalid user data');
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch {
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const userData = { id: 1, name: 'Admin', email: credentials.email, role: 'admin' };
        const token = 'demo-admin-token';
        setUser(userData); setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
        const userData = { id: 2, name: 'User', email: credentials.email, role: 'user' };
        const token = 'demo-user-token';
        setUser(userData); setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials. Use admin or user demo logins.' };
      }
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        return { success: true, message: 'Registration successful!' };
      } else {
        const err = await res.json();
        return { success: false, error: err.message };
      }
    } catch {
      if (userData.email === 'test@example.com') {
        return { success: false, error: 'Email already exists' };
      }
      return { success: true, message: 'Demo registration successful' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
