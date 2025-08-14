import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Eye, EyeOff, ArrowLeft, Sparkles, GraduationCap, Building, Search } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user, logout, clearAllData } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'student':
          navigate('/student');
          break;
        case 'institution':
          navigate('/institution');
          break;
        case 'verifier':
          navigate('/verifier');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        // Navigate to appropriate dashboard based on user role
        switch (user.role) {
          case 'student':
            navigate('/student');
            break;
          case 'institution':
            navigate('/institution');
            break;
          case 'verifier':
            navigate('/verifier');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: string) => {
    switch (role) {
      case 'student':
        setEmail('student@demo.com');
        setPassword('demo123');
        break;
      case 'institution':
        setEmail('institution@demo.com');
        setPassword('demo123');
        break;
      case 'verifier':
        setEmail('verifier@demo.com');
        setPassword('demo123');
        break;
    }
  };

  return (
    <div className="min-h-screen gradient-bg-light flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              EduChain
            </span>
          </Link>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">Sign in to your EduChain account</p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Try Demo Accounts</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => fillDemoCredentials('student')}
              className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Student Account</div>
                <div className="text-sm text-gray-500">student@demo.com</div>
              </div>
            </button>
            
            <button
              onClick={() => fillDemoCredentials('institution')}
              className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Institution Account</div>
                <div className="text-sm text-gray-500">institution@demo.com</div>
              </div>
            </button>
            
            <button
              onClick={() => fillDemoCredentials('verifier')}
              className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Verifier Account</div>
                <div className="text-sm text-gray-500">verifier@demo.com</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in to EduChain'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Don't have an account? Create one now
            </Link>
          </div>
        </div>

        {/* Back to home and Clear Session */}
        <div className="text-center space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => {
                logout();
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium block w-full"
            >
              Clear session and start fresh
            </button>
            <button
              onClick={() => {
                clearAllData();
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium block w-full"
            >
              Clear all data (including registered users)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;