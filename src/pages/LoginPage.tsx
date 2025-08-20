import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
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
  <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: marketing/visual */}
  <div className="hidden lg:flex flex-col justify-center rounded-2xl p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 rounded-lg p-3">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold">E-Certify</h3>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">Secure. Verifiable. Universal.</h1>
          <p className="mt-4 text-white/90 max-w-lg">Issue blockchain-backed certificates, verify instantly, and simplify credential workflows for institutions and students worldwide.</p>

          <ul className="mt-8 space-y-3 text-white/90">
            <li className="flex items-center space-x-3"><CheckCircle className="h-5 w-5" /> Instant verification</li>
            <li className="flex items-center space-x-3"><CheckCircle className="h-5 w-5" /> Tamper-proof records</li>
            <li className="flex items-center space-x-3"><CheckCircle className="h-5 w-5" /> Global access</li>
          </ul>

          {/* Decorative illustration */}
          <div className="mt-6 flex items-center justify-center">
            <svg className="w-44 h-44" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
              <defs>
                <linearGradient id="lg2" x1="0" x2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              <rect x="12" y="40" width="140" height="90" rx="10" fill="rgba(255,255,255,0.12)" />
              <circle cx="150" cy="50" r="18" fill="rgba(255,255,255,0.16)" />
              <path d="M40 140c8-12 22-20 40-20s32 8 40 20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6" strokeLinecap="round" />
              <rect x="0" y="0" width="200" height="200" fill="url(#lg2)" opacity="0.02" />
            </svg>
          </div>

          <div className="mt-auto text-sm text-white/80">Demo accounts available below for quick testing.</div>
        </div>

        {/* Right: form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Welcome back</h2>
                <p className="text-sm text-gray-500">Sign in to your E-Certify account</p>
              </div>
            </div>
            <div>
              <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">Back to home</Link>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => fillDemoCredentials('student')} className="p-3 rounded-xl border border-gray-100 hover:shadow-md text-sm">Student demo</button>
              <button onClick={() => fillDemoCredentials('institution')} className="p-3 rounded-xl border border-gray-100 hover:shadow-md text-sm">Institution demo</button>
              <button onClick={() => fillDemoCredentials('verifier')} className="p-3 rounded-xl border border-gray-100 hover:shadow-md text-sm">Verifier demo</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 input-field" placeholder="you@domain.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 input-field pr-12" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">{error}</div>}

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center space-x-3">
              {loading ? (<div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Signing in...</span></div>) : (<><span>Sign in</span><ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;