import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Session expired:', error);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: userToken, ...userData } = res.data;
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  // Student registration strictly forces user to sign in afterwards
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data; // Does NOT auto-set token or user
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const demoAccounts = {
    student: { email: 'student@demo.com', password: 'password123' },
    Library: { email: 'library@demo.com', password: 'password123' },
    Hostels: { email: 'hostel@demo.com', password: 'password123' },
    Sports: { email: 'sports@demo.com', password: 'password123' },
    Accounts: { email: 'accounts@demo.com', password: 'password123' },
    admin: { email: 'admin@demo.com', password: 'password123' },
  };

  const loginAsDemoRole = async (roleKey) => {
    const creds = demoAccounts[roleKey];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginAsDemoRole,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
