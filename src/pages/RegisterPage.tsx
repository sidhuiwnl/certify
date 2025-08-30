import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

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
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        institution_name: formData.role === 'institution' ? formData.institutionName : undefined,
        company_name: formData.role === 'verifier' ? formData.companyName : undefined
      });

      if (success) {
        // after register, AuthContext.register performs login; redirect based on stored user
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          switch (u.role) {
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
          navigate('/');
        }
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create an E-Certify account</h2>
                <p className="text-sm text-gray-500">
                  Get started in minutes and secure credentials with blockchain.
                </p>
              </div>
            </div>
            <div>
              <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
                Back to home
              </Link>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-4 h-2 bg-gray-200 rounded-full"></div>
            <div className="w-4 h-2 bg-gray-200 rounded-full"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 input-field"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Choose role</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { value: 'student', label: 'Student' },
                  { value: 'institution', label: 'Institution' },
                  { value: 'verifier', label: 'Verifier' }
                ].map(o => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: o.value as any }))}
                    className={`p-3 rounded-xl border ${
                      formData.role === o.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } text-sm`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.role === 'institution' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution name</label>
                <input
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  required
                  placeholder="Institution name"
                />
              </div>
            )}
            {formData.role === 'verifier' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Company name</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  required
                  placeholder="Company name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 input-field pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 input-field"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700">
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center rounded-2xl p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Join thousands of institutions</h3>
          <p className="text-white/90">
            Secure, immutable certificates that employers and institutions can verify instantly.
          </p>

          {/* Decorative illustration (inline SVG) */}
          <div className="mt-6 w-full flex justify-center">
            <svg
              className="w-48 h-48"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden
            >
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <rect x="10" y="30" width="140" height="100" rx="8" fill="rgba(255,255,255,0.12)" />
              <rect x="30" y="15" width="120" height="30" rx="6" fill="rgba(255,255,255,0.18)" />
              <path
                d="M24 140c6-10 18-18 32-18s26 8 32 18"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="170" cy="60" r="24" fill="#fff" opacity="0.12" />
              <path
                d="M162 56l6 6 14-14"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <rect x="0" y="0" width="200" height="200" fill="url(#g1)" opacity="0.02" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
