import React, { useState, useContext, createContext, useEffect } from 'react';

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

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
      const API_URL = 'http://13.202.152.67:5000/api';
      console.log('Attempting login to:', API_URL);
      const response = await fetch(`${API_URL}/login`, {
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
        let errorMsg = 'Unknown error';
        try {
          const error = await response.json();
          errorMsg = error.error || error.message || errorMsg;
        } catch (e) {
          errorMsg = 'Server error';
        }
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Login error:',err);
      return { success: false, error: 'Network or server error' };
    }
  };

  const register = async (userData) => {
  try {
    console.log("📤 Sending from frontend:", userData);
    const API_URL = 'http://13.202.152.67:5000/api';

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (res.ok) {
      return { success: true, message: 'Registration successful! Please login.' };
    } else {
      let err;
      try {
        err = await res.json(); // 🌐 try to read JSON error
      } catch {
        err = { error: 'Unexpected server response' }; // fallback
      }

      // ✅ Handle both "message" and "error" fields
      return { success: false, error: err.message || err.error || 'Unknown error' };
    }
  } catch (err) {
    console.error('Register error:', err);
    return { success: false, error: 'Network or server error' };
  }
};


  const logout = async () => {
    try {
      const API_URL = 'http://13.202.152.67:5000/api';
      await fetch(`${API_URL}/logout`, {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
