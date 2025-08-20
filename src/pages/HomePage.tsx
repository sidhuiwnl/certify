import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Lock, Globe, Star, TrendingUp, Clock, Smartphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const noRedirect = params.get('noRedirect');

  // Redirect authenticated users to their dashboard unless noRedirect flag is set
  useEffect(() => {
    if (noRedirect === '1') return;
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
      }
    }
  }, [isAuthenticated, user, navigate, noRedirect]);
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-bg text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center fade-in">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-lg font-semibold text-white/90">Trusted by 1000+ Institutions</span>
            </div>
            
            <h1 className="hero-text mb-8">
              Revolutionizing
              <span className="block text-gradient-gold">Academic Credentials</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-white/90 mt-4">
                with Blockchain Technology
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed">
              Transform how educational institutions issue, manage, and verify certificates. 
              Our cutting-edge blockchain platform ensures tamper-proof credentials that are 
              instantly verifiable worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => navigate(isAuthenticated ? getDashboardLink() : '/register')}
                className="btn-primary flex items-center space-x-2 group"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to="/verify" className="btn-outline flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Verify Certificate</span>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70 text-sm">Certificates Issued</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1K+</div>
                <div className="text-white/70 text-sm">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">95+</div>
                <div className="text-white/70 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-white/70 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 gradient-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 slide-up">
            <h2 className="section-title text-gray-900 mb-6">
              Why Choose <span className="text-gradient">E-Certify</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of credential management with our comprehensive suite of 
              blockchain-powered tools designed for modern education.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">Immutable Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Every certificate is cryptographically secured on the blockchain, making 
                forgery virtually impossible and ensuring permanent authenticity.
              </p>
            </div>
            
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">Instant Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Verify any certificate in seconds with our advanced QR code system and 
                real-time blockchain validation technology.
              </p>
            </div>
            
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">Global Recognition</h3>
              <p className="text-gray-600 leading-relaxed">
                Your credentials are recognized worldwide with our decentralized network 
                of verified institutions and employers.
              </p>
            </div>
            
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">Mobile-First Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Access your certificates anywhere, anytime with our responsive mobile 
                application and web platform.
              </p>
            </div>
            
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Track certificate performance, verification rates, and institutional 
                analytics with comprehensive reporting tools.
              </p>
            </div>
            
            <div className="card p-8 text-center group">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="feature-title mb-4 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get help whenever you need it with our round-the-clock customer support 
                and comprehensive documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 slide-up">
            <h2 className="section-title text-gray-900 mb-6">
              How <span className="text-gradient">E-Certify</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and transparent certificate management in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 transition-transform shadow-glow">
                  1
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  <Star className="h-3 w-3" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Institution Registration</h3>
              <p className="text-gray-600 leading-relaxed">
                Educational institutions register and verify their identity on our 
                secure blockchain platform.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 transition-transform shadow-glow">
                  2
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  <Star className="h-3 w-3" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Certificate Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                Institutions create digital certificates with student information 
                and academic achievements.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 transition-transform shadow-glow">
                  3
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  <Star className="h-3 w-3" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Blockchain Storage</h3>
              <p className="text-gray-600 leading-relaxed">
                Certificate data is hashed and permanently stored on the blockchain 
                for maximum security and transparency.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 transition-transform shadow-glow">
                  4
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  <Star className="h-3 w-3" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Global Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Anyone can instantly verify certificate authenticity by scanning 
                the QR code or using our verification portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 gradient-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 slide-up">
            <h2 className="section-title text-gray-900 mb-6">
              What Our <span className="text-gradient">Partners</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of institutions and students who trust E-Certify for their academic credentials
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "E-Certify has revolutionized how we manage student credentials. The verification process 
                is incredibly fast and the security is unmatched."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Dr. Jane Doe</div>
                  <div className="text-sm text-gray-600">Dean, MIT University</div>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "As an employer, I can now verify candidate credentials instantly. This saves us 
                countless hours and ensures we hire qualified professionals."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">John Smith</div>
                  <div className="text-sm text-gray-600">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The mobile app is fantastic! I can access my certificates anywhere and share them 
                with potential employers instantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Alice Johnson</div>
                  <div className="text-sm text-gray-600">Graduate Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bounce-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Ready to Transform
              <span className="block text-gradient-gold">Your Credentials?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
              Join the future of academic credential management. Start your journey with E-Certify today 
              and experience the power of blockchain-secured certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register" className="btn-primary flex items-center space-x-2 group">
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/verify" className="btn-outline flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Try Verification</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">E-Certify</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The world's most advanced blockchain-based academic credential management platform, 
                ensuring security, transparency, and global recognition.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/verify" className="hover:text-white transition-colors">Verify Certificate</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register Institution</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 E-Certify. All rights reserved. | Built with ❤️ for the future of education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;