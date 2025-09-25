import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestAccounts, isEthereumAvailable } from '../utils/blockchain';

// Backend base URL - if you run the backend locally, this points to it.
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institution' | 'verifier';
  institutionName?: string;
  companyName?: string;
  isVerified?: boolean;
  institution_id?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  clearAllData: () => void;
  walletAccount: string | null;
  connectWallet: () => Promise<void>;
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
  const [walletAccount, setWalletAccount] = useState<string | null>(null);

  console.log("user",user)
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
    checkWalletConnection();
    setLoading(false);
  }, []);

  const checkWalletConnection = async () => {
    if (isEthereumAvailable()) {
      const accounts = await requestAccounts();
      if (accounts.length > 0) {
        setWalletAccount(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (isEthereumAvailable()) {
      const accounts = await requestAccounts();
      if (accounts.length > 0) {
        setWalletAccount(accounts[0]);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

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
        // send welcome email
        if (loginRes) {
          try {
            await fetch(`http://localhost:5000/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: userData.email,
                name: userData.name,
                role: userData.role
              })
            });
          } catch (e) {
            console.error('Failed to send welcome email', e);
          }
        }
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

    try {
      await fetch(`http://localhost:5000/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userWithoutPassword.email,
          name: userWithoutPassword.name,
          role: userWithoutPassword.role
        })
      });
    } catch (e) {
      console.error('Failed to send welcome email', e);
    }

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
      clearAllData,
      walletAccount,
      connectWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};