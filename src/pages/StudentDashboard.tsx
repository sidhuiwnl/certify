import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import CumulativeChart from '../components/CumulativeChart';
import { Award, Download, Share2, QrCode, Calendar, Building, TrendingUp, CheckCircle, ExternalLink, Copy, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight, Filter, Search, Eye } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCertificatesByStudent } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const certificates = getCertificatesByStudent(user?.email || '');
  
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.institutionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'verified') return matchesSearch && cert.isVerified;
    if (selectedFilter === 'pending') return matchesSearch && !cert.isVerified;
    return matchesSearch;
  });

  const verifiedInstitutions = new Set(certificates.map(cert => cert.institutionName)).size;
  const recentCertificates = certificates.filter(cert => {
    const issueDate = new Date(cert.issueDate);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return issueDate > monthAgo;
  }).length;

  // Enhanced Analytics
  const stats = {
    totalCertificates: certificates.length,
    verifiedCertificates: certificates.filter(cert => cert.isVerified).length,
    pendingCertificates: certificates.filter(cert => !cert.isVerified).length,
    uniqueInstitutions: verifiedInstitutions,
    recentCertificates: recentCertificates,
    thisMonthCertificates: certificates.filter(cert => {
      const issueDate = new Date(cert.issueDate);
      const now = new Date();
      return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
    }).length,
    lastMonthCertificates: certificates.filter(cert => {
      const issueDate = new Date(cert.issueDate);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return issueDate.getMonth() === lastMonth.getMonth() && issueDate.getFullYear() === lastMonth.getFullYear();
    }).length
  };

  const monthlyGrowth = stats.lastMonthCertificates > 0 
    ? ((stats.thisMonthCertificates - stats.lastMonthCertificates) / stats.lastMonthCertificates * 100).toFixed(1)
    : 0;

  // Course Analytics
  const courseStats = certificates.reduce((acc, cert) => {
    acc[cert.courseName] = (acc[cert.courseName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCourses = Object.entries(courseStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Institution Analytics
  const institutionStats = certificates.reduce((acc, cert) => {
    acc[cert.institutionName] = (acc[cert.institutionName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topInstitutions = Object.entries(institutionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Generate sample data for cumulative charts
  const generateChartData = (baseValue: number, variance: number = 0.3) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      date: day,
      value: Math.max(0, Math.floor(baseValue * (1 + (Math.random() - 0.5) * variance))),
      label: day
    }));
  };

  const certificateChartData = generateChartData(3, 0.5);
  const verificationChartData = generateChartData(5, 0.4);
  const growthChartData = generateChartData(2, 0.6);

  const downloadCertificate = (certificateId: string) => {
    // Simulate certificate download
    alert(`Certificate ${certificateId} downloaded!`);
  };

  const shareCertificate = (certificateId: string) => {
    const url = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(url);
    alert('Certificate verification link copied to clipboard!');
  };

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}! Manage your academic credentials.</p>
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
                <p className="text-sm text-gray-500">Academic achievements</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Award className="h-8 w-8 text-white" />
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
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonthCertificates}</p>
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
                  Verified partners
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

                 {/* Cumulative Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <CumulativeChart
             title="Certificate Growth"
             data={certificateChartData}
             type="certificates"
             period="7d"
           />
           <CumulativeChart
             title="Verification Activity"
             data={verificationChartData}
             type="verifications"
             period="7d"
           />
           <CumulativeChart
             title="Overall Growth"
             data={growthChartData}
             type="growth"
             period="7d"
           />
         </div>

         {/* Charts and Analytics */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Top Courses Chart */}
           <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Top Courses</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topCourses.map(([course, count], index) => (
                <div key={course} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{course}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...topCourses.map(([,c]) => c))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institution Distribution */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Institution Distribution</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topInstitutions.map(([institution, count], index) => (
                <div key={institution} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{institution}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">
                      {stats.totalCertificates > 0 ? Math.round((count / stats.totalCertificates) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Academic Credentials</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Filter */}
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Certificates</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {filteredCertificates.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Your academic certificates will appear here once they\'re issued by educational institutions. Each certificate will be securely stored on the blockchain.'
                }
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-6">
                {filteredCertificates.map((certificate) => (
                  <div key={certificate.id} className="card p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">{certificate.courseName}</h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center space-x-1 ${
                            certificate.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {certificate.isVerified ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <span>Pending</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Institution</p>
                            <p className="font-semibold text-gray-900">{certificate.institutionName}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Grade</p>
                            <p className="font-semibold text-gray-900">{certificate.grade}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                            <p className="font-semibold text-gray-900">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Completion</p>
                            <p className="font-semibold text-gray-900">{new Date(certificate.completionDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-xl mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Blockchain Hash</p>
                              <p className="font-mono text-xs text-gray-900 break-all">{certificate.blockchainHash}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">IPFS Hash</p>
                              <p className="font-mono text-xs text-gray-900 break-all">{certificate.ipfsHash}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-6">
                        <div className="bg-white p-3 rounded-xl border border-gray-200">
                          <img 
                            src={certificate.qrCode} 
                            alt="QR Code" 
                            className="w-24 h-24"
                            onError={(e) => {
                              console.error('QR Code failed to load:', certificate.qrCode);
                              e.currentTarget.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(window.location.origin + '/verify/' + certificate.id)}`;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => downloadCertificate(certificate.id)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                        
                        <button
                          onClick={() => shareCertificate(certificate.id)}
                          className="flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Share Link</span>
                        </button>
                        
                        {/* Verify Online link removed for student role */}
                      </div>
                      
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {certificate.certificateType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;