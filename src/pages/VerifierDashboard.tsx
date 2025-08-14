import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import QRScanner from '../components/QRScanner';
import CumulativeChart from '../components/CumulativeChart';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Calendar,
  Building,
  Users,
  FileText,
  QrCode,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ExternalLink,
  Clock,
  Award
} from 'lucide-react';

const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  const { certificates, verifyCertificate, updateCertificateStatus } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleVerify = (certificateId: string) => {
    const result = verifyCertificate(certificateId);
    if (result) {
      // Update the certificate status to verified
      updateCertificateStatus(certificateId, 'verified');
      // Get the updated certificate
      const updatedResult = verifyCertificate(certificateId);
      setVerificationResult(updatedResult);
    } else {
      setVerificationResult(result);
    }
    setSelectedCertificate(certificateId);
  };

  const handleQuickVerify = () => {
    if (searchTerm.trim()) {
      const result = verifyCertificate(searchTerm.trim());
      if (result) {
        // Update the certificate status to verified
        updateCertificateStatus(searchTerm.trim(), 'verified');
        // Get the updated certificate
        const updatedResult = verifyCertificate(searchTerm.trim());
        setVerificationResult(updatedResult);
      } else {
        setVerificationResult(result);
      }
      setSelectedCertificate(searchTerm.trim());
    }
  };

  const handleQRScan = (result: string) => {
    // Extract certificate ID from QR code result
    const urlParts = result.split('/');
    const certId = urlParts[urlParts.length - 1];
    
    if (certId) {
      setSearchTerm(certId);
      const result = verifyCertificate(certId);
      if (result) {
        // Update the certificate status to verified
        updateCertificateStatus(certId, 'verified');
        // Get the updated certificate
        const updatedResult = verifyCertificate(certId);
        setVerificationResult(updatedResult);
      } else {
        setVerificationResult(result);
      }
      setSelectedCertificate(certId);
    }
    setShowScanner(false);
  };

  // Analytics Data
  const stats = {
    totalCertificates: certificates.length,
    verifiedCertificates: certificates.filter(cert => cert.isVerified).length,
    pendingCertificates: certificates.filter(cert => !cert.isVerified).length,
    uniqueInstitutions: new Set(certificates.map(cert => cert.institutionName)).size,
    uniqueStudents: new Set(certificates.map(cert => cert.studentEmail)).size,
    thisMonthVerifications: certificates.filter(cert => {
      const issueDate = new Date(cert.issueDate);
      const now = new Date();
      return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
    }).length,
    lastMonthVerifications: certificates.filter(cert => {
      const issueDate = new Date(cert.issueDate);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return issueDate.getMonth() === lastMonth.getMonth() && issueDate.getFullYear() === lastMonth.getFullYear();
    }).length
  };

  const monthlyGrowth = stats.lastMonthVerifications > 0 
    ? ((stats.thisMonthVerifications - stats.lastMonthVerifications) / stats.lastMonthVerifications * 100).toFixed(1)
    : 0;

  // Institution Analytics
  const institutionStats = certificates.reduce((acc, cert) => {
    acc[cert.institutionName] = (acc[cert.institutionName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topInstitutions = Object.entries(institutionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Recent Activity
  const recentCertificates = certificates
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  const filteredCertificates = certificates.filter(cert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'verified') return cert.isVerified;
    if (selectedFilter === 'pending') return !cert.isVerified;
    return true;
  });

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verifier Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}! Verify certificates and credentials here.</p>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
                <p className="text-sm text-gray-500">Available for verification</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-gray-900">{stats.verifiedCertificates}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {stats.totalCertificates > 0 ? Math.round((stats.verifiedCertificates / stats.totalCertificates) * 100) : 0}% verified
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonthVerifications}</p>
                <p className={`text-sm flex items-center ${parseFloat(monthlyGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(monthlyGrowth) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(parseFloat(monthlyGrowth))}% from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Institutions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.uniqueInstitutions}</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {stats.uniqueStudents} students
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Verification */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Certificate Verification</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Enter certificate ID or scan QR code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickVerify()}
                className="input-field text-lg"
              />
            </div>
            <button
              onClick={handleQuickVerify}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Verify</span>
            </button>
            <button 
              onClick={() => setShowScanner(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <QrCode className="h-5 w-5" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Result</h2>
            
            {verificationResult ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-green-800 font-semibold text-lg">Certificate Verified Successfully</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Student Name</p>
                          <p className="font-semibold text-gray-900">{verificationResult.studentName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Course</p>
                          <p className="font-semibold text-gray-900">{verificationResult.courseName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Institution</p>
                          <p className="font-semibold text-gray-900">{verificationResult.institutionName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Issue Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(verificationResult.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-600">Completion Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(verificationResult.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-pink-600" />
                        <div>
                          <p className="text-sm text-gray-600">Certificate Type</p>
                          <p className="font-semibold text-gray-900 capitalize">{verificationResult.certificateType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      This certificate is authentic and has been verified on the blockchain
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-red-800 font-semibold text-lg">Certificate Not Found</span>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      The certificate ID provided does not exist in our blockchain records
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Institutions Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Top Institutions</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topInstitutions.map(([institution, count], index) => (
                <div key={institution} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{institution}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...topInstitutions.map(([,c]) => c))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Verification Status</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Verified</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.verifiedCertificates}</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalCertificates > 0 ? Math.round((stats.verifiedCertificates / stats.totalCertificates) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Pending</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingCertificates}</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalCertificates > 0 ? Math.round((stats.pendingCertificates / stats.totalCertificates) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Certificates</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Certificates</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.slice(0, 10).map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{certificate.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
                        <div className="text-sm text-gray-500">{certificate.studentEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{certificate.institutionName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVerify(certificate.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Verify</span>
                        </button>
                        <a
                          href={`/verify/${certificate.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <QRScanner 
        isOpen={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default VerifierDashboard;