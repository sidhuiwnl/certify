import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../contexts/CertificateContext';
import { Shield, LogOut, User, Home, Menu, X, ChevronDown, Wallet } from 'lucide-react';
import { Bell, ExternalLink } from 'lucide-react';
import { shortenAddress } from '../utils/blockchain';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, walletAccount, connectWallet } = useAuth();
  const { certificates } = useCertificates();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student':
        return '/student';
      case 'institution':
        return '/institution';
      case 'verifier':
        return '/verifier';
      default:
        return '/';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'institution':
        return 'Institution';
      case 'verifier':
        return 'Verifier';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/?noRedirect=1" onClick={() => navigate('/?noRedirect=1')} className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              E-Certify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Verifier notifications */}
            {isAuthenticated && user?.role === 'verifier' && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {/* badge count */}
                  {certificates && certificates.filter(c => c.verificationStatus === 'pending' && c.verifierRequest && c.verifierRequest.email === user.email).length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                      {certificates.filter(c => c.verificationStatus === 'pending' && c.verifierRequest && c.verifierRequest.email === user.email).length}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 font-semibold">Verification Requests</div>
                    <div className="max-h-72 overflow-auto">
                      {certificates.filter(c => c.verificationStatus === 'pending' && c.verifierRequest && c.verifierRequest.email === user.email).length === 0 ? (
                        <div className="p-4 text-sm text-gray-600">No pending requests</div>
                      ) : (
                        certificates
                          .filter(c => c.verificationStatus === 'pending' && c.verifierRequest && c.verifierRequest.email === user.email)
                          .map((c) => (
                            <div key={c.id} className="flex items-start justify-between px-4 py-3 hover:bg-gray-50">
                              <div className="flex-1 pr-2">
                                <div className="text-sm font-semibold text-gray-900">{c.courseName}</div>
                                <div className="text-xs text-gray-600">Student: {c.studentName}</div>
                                <div className="text-xs text-gray-500 mt-1">Requested: {c.verifierRequest?.requestedAt ? new Date(c.verifierRequest.requestedAt).toLocaleString() : ''}</div>
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                <button
                                  onClick={() => {
                                    setIsNotifOpen(false);
                                    navigate(`/certificate/${c.id}`);
                                  }}
                                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span>Open</span>
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {(!user || user.role !== 'student') && (
              <Link
                to="/verify"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
              >
                Verify Certificate
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user.role === 'institution' && (
                  <>
                    {walletAccount ? (
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                        <Wallet className="h-4 w-4 text-green-600" />
                        <span>{shortenAddress(walletAccount)}</span>
                      </div>
                    ) : (
                      <button
                        onClick={connectWallet}
                        className="btn-secondary text-sm flex items-center space-x-2"
                      >
                        <Wallet className="h-4 w-4" />
                        <span>Connect Wallet</span>
                      </button>
                    )}
                  </>
                )}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>{user?.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-900">{user?.name}</div>
                        <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                          {getRoleDisplayName(user?.role || '')}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {(!user || user.role !== 'student') && (
              <Link
                to="/verify"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Verify Certificate
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                        {getRoleDisplayName(user?.role || '')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;