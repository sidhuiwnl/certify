import React, { createContext, useContext, useState, useEffect } from 'react';
import { emailService } from '../utils/emailService';

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
    // Simulate API call
    setLoading(true);
    
    // Demo users for different roles
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

    // First check demo users
    let foundUser = demoUsers.find(u => u.email === email && u.password === password);
    
    // If not found in demo users, check registered users
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
      console.log('Login successful for:', userWithoutPassword);
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return userWithoutPassword;
    }
    
    console.log('Login failed - no user found for:', email);
    setLoading(false);
    return null;
  };

  const register = async (userData: any): Promise<boolean> => {
    // Simulate registration
    setLoading(true);
    
    // Check if user already exists
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
    
    // Check if email already exists
    const existingUser = users.find((u: any) => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false; // User already exists
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isVerified: userData.role === 'student' ? true : false
    };
    
    // Add to registered users list
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(userWithoutPassword);
      console.log('Welcome email sent successfully to:', userData.email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  const clearAuthState = () => {
    console.log('Clearing authentication state');
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