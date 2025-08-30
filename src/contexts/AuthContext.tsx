import React, { createContext, useContext, useState, useEffect } from 'react';
import { emailService } from '../utils/emailService';

// Backend base URL - if you run the backend locally, this points to it.
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || '';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institution' | 'verifier';
  institutionName?: string;
  companyName?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  clearAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);

    // If backend is configured, call it
    if (BACKEND_BASE) {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const payload = await res.json();
        if (!res.ok) {
          console.log('Backend login failed', payload);
          setLoading(false);
          return null;
        }

        const { token, user: userPayload } = payload;
        localStorage.setItem('ec_token', token);
        setUser(userPayload);
        localStorage.setItem('user', JSON.stringify(userPayload));
        setLoading(false);
        return userPayload;
      } catch (err) {
        console.error('Login error contacting backend', err);
        setLoading(false);
        return null;
      }
    }

    // Fallback: local demo users
    setLoading(true);
    const demoUsers = [
      {
        id: '1',
        email: 'student@demo.com',
        name: 'Alice Johnson',
        role: 'student' as const,
        password: 'demo123'
      },
      {
        id: '2',
        email: 'institution@demo.com',
        name: 'Dr. Michael Smith',
        role: 'institution' as const,
        institutionName: 'Stanford University',
        isVerified: true,
        password: 'demo123'
      },
      {
        id: '3',
        email: 'verifier@demo.com',
        name: 'Sarah Wilson',
        role: 'verifier' as const,
        companyName: 'Google Inc.',
        password: 'demo123'
      }
    ];

    let foundUser = demoUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        try {
          const users = JSON.parse(registeredUsers);
          foundUser = users.find((u: any) => u.email === email && u.password === password);
        } catch (error) {
          console.error('Error parsing registered users:', error);
        }
      }
    }

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return userWithoutPassword;
    }

    setLoading(false);
    return null;
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);

    // If backend is available, call it
    if (BACKEND_BASE) {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!res.ok) {
          const payload = await res.json();
          console.error('Backend register failed', payload);
          setLoading(false);
          return false;
        }

        // After registering, auto-login
        const loginRes = await login(userData.email, userData.password);
        // send welcome email from frontend service if desired
        try { await emailService.sendWelcomeEmail(userData); } catch (e) { /* ignore */ }
        setLoading(false);
        return !!loginRes;
      } catch (err) {
        console.error('Register error contacting backend', err);
        setLoading(false);
        return false;
      }
    }

    // Fallback: local registration
    setLoading(true);
    const registeredUsers = localStorage.getItem('registeredUsers');
    let users = [];
    if (registeredUsers) {
      try {
        users = JSON.parse(registeredUsers);
      } catch (error) {
        console.error('Error parsing registered users:', error);
        users = [];
      }
    }

    const existingUser = users.find((u: any) => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isVerified: userData.role === 'student' ? true : false
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    try { await emailService.sendWelcomeEmail(userWithoutPassword); } catch (e) { /* ignore */ }

    setLoading(false);
    return true;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };


  const clearAllData = () => {
    console.log('Clearing all data');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('registeredUsers');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      loading,
      clearAllData
    }}>
      {children}
    </AuthContext.Provider>
  );
};