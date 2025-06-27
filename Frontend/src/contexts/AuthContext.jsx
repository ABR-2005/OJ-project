import React, { useState, useContext, createContext, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is logged in on app start
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Invalid user data in localStorage');
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      // Replace with your actual API endpoint
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
    } catch (error) {
      // Demo credentials for development
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const userData = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' };
        const token = 'demo-admin-token';
        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
        const userData = { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user' };
        const token = 'demo-user-token';
        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials. Try admin@example.com/admin123 or user@example.com/user123' };
      }
    }
  };

  const register = async (userData) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      // Demo behavior for development
      if (userData.email === 'test@example.com') {
        return { success: false, error: 'Email already exists' };
      }
      return { success: true, message: 'Registration successful! Please login with your credentials.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

