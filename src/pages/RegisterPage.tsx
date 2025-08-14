import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Eye, EyeOff, ArrowLeft, GraduationCap, Building, Search, CheckCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, user } = useAuth();
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'institution' | 'verifier',
    institutionName: '',
    companyName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        // Navigate to appropriate dashboard based on user role
        switch (formData.role) {
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
        setError('Registration failed. User with this email already exists.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-5 w-5" />;
      case 'institution':
        return <Building className="h-5 w-5" />;
      case 'verifier':
        return <Search className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'from-green-500 to-green-600';
      case 'institution':
        return 'from-blue-500 to-blue-600';
      case 'verifier':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="min-h-screen gradient-bg-light flex items-center justify-center p-4 py-12">
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
            <h2 className="text-3xl font-bold text-gray-900">Join EduChain</h2>
            <p className="text-gray-600">Create your account and start managing credentials securely</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: GraduationCap, color: 'from-green-500 to-green-600' },
                  { value: 'institution', label: 'Institution', icon: Building, color: 'from-blue-500 to-blue-600' },
                  { value: 'verifier', label: 'Verifier', icon: Search, color: 'from-purple-500 to-purple-600' }
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: option.value as any }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.role === option.value
                          ? `border-blue-500 bg-gradient-to-br ${option.color} text-white`
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <IconComponent className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.role === 'institution' && (
              <div>
                <label htmlFor="institutionName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Institution Name
                </label>
                <input
                  id="institutionName"
                  name="institutionName"
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your institution name"
                />
              </div>
            )}

            {formData.role === 'verifier' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your company name"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Create a strong password"
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
              {formData.password.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  {formData.password.length >= 6 ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Password meets requirements</span>
                    </div>
                  ) : (
                    <span>Password must be at least 6 characters</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
              />
              {formData.confirmPassword.length > 0 && (
                <div className="mt-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <span className="text-red-600">Passwords do not match</span>
                  )}
                </div>
              )}
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
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create EduChain Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Already have an account? Sign in here
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;