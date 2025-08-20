import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import { 
  Award, 
  Users, 
  FileText, 
  Plus, 
  Search,
  Calendar,
  CheckCircle,
  Clock,
  Building,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Eye,
  ExternalLink,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCertificatesByInstitution } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const certificates = getCertificatesByInstitution(user?.id || '');
  
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'verified') return matchesSearch && cert.isVerified;
    if (selectedFilter === 'pending') return matchesSearch && !cert.isVerified;
    return matchesSearch;
  });

  // Analytics Data
  const stats = {
    totalCertificates: certificates.length,
    verifiedCertificates: certificates.filter(cert => cert.isVerified).length,
    pendingCertificates: certificates.filter(cert => !cert.isVerified).length,
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

  // Recent Activity
  const recentCertificates = certificates
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  // Generate sample data for cumulative charts
  const generateChartData = (baseValue: number, variance: number = 0.3) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      date: day,
      value: Math.max(0, Math.floor(baseValue * (1 + (Math.random() - 0.5) * variance))),
      label: day
    }));
  };

  const certificateIssuanceData = generateChartData(8, 0.4);
  const verificationRateData = generateChartData(12, 0.3);
  const studentGrowthData = generateChartData(5, 0.5);

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}! Manage your academic credentials.</p>
              </div>
            </div>
            <Link
              to="/issue-certificate"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Issue Certificate</span>
            </Link>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
                <p className="text-sm text-gray-500">All time</p>
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
                  {stats.totalCertificates > 0 ? Math.round((stats.verifiedCertificates / stats.totalCertificates) * 100) : 0}% success rate
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
                <p className={`text-sm flex items-center ${parseFloat(typeof monthlyGrowth === "string" ? monthlyGrowth : "0") >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(typeof monthlyGrowth === "string" ? monthlyGrowth : "0") >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(parseFloat(typeof monthlyGrowth === "string" ? monthlyGrowth : "0"))}% from last month
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingCertificates}</p>
                <p className="text-sm text-yellow-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Awaiting verification
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
                 </div>

  {/* Cumulative Charts removed for Institution role */}
 
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

        {/* Certificates Management */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Certificate Management</h2>
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
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedFilter !== 'all' ? 'No certificates match your criteria' : 'No certificates issued yet'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Start issuing certificates to your students to see them appear here'
                }
              </p>
              {!searchTerm && selectedFilter === 'all' && (
                <Link
                  to="/issue-certificate"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Issue First Certificate</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
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
                  {filteredCertificates.map((certificate) => (
                    <tr key={certificate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
                          <div className="text-sm text-gray-500">{certificate.studentEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{certificate.courseName}</div>
                        <div className="text-sm text-gray-500">{certificate.certificateType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {certificate.grade}
                        </span>
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
                          <Link
                            to={`/certificate/${certificate.id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                          <a
                            href={`/verify/${certificate.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Verify</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;