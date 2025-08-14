import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Clock, Shield, Users, Award, Building } from 'lucide-react';

interface CertificateAnalyticsProps {
  totalCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  monthlyGrowth: number;
  averageVerificationTime: number;
  topInstitutions: Array<{ name: string; count: number }>;
  certificateTypes: Array<{ type: string; count: number }>;
  verificationTrend: Array<{ month: string; verified: number; pending: number }>;
}

const CertificateAnalytics: React.FC<CertificateAnalyticsProps> = ({
  totalCertificates,
  verifiedCertificates,
  pendingCertificates,
  monthlyGrowth,
  averageVerificationTime,
  topInstitutions,
  certificateTypes,
  verificationTrend
}) => {
  const verificationRate = totalCertificates > 0 ? (verifiedCertificates / totalCertificates) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verification Rate</p>
              <p className="text-3xl font-bold text-gray-900">{verificationRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth}% this month
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Verification Time</p>
              <p className="text-3xl font-bold text-gray-900">{averageVerificationTime}h</p>
              <p className="text-sm text-blue-600">Blockchain processing</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Institutions</p>
              <p className="text-3xl font-bold text-gray-900">{topInstitutions.length}</p>
              <p className="text-sm text-purple-600">Issuing certificates</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificate Types</p>
              <p className="text-3xl font-bold text-gray-900">{certificateTypes.length}</p>
              <p className="text-sm text-orange-600">Different formats</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Institutions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Institutions</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topInstitutions.map((institution, index) => (
              <div key={institution.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{institution.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(institution.count / Math.max(...topInstitutions.map(i => i.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{institution.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Types Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Certificate Types</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {certificateTypes.map((type, index) => (
              <div key={type.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">{type.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{type.count}</p>
                  <p className="text-xs text-gray-500">
                    {totalCertificates > 0 ? Math.round((type.count / totalCertificates) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Trend */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Verification Trend (Last 6 Months)</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {verificationTrend.map((trend, index) => (
            <div key={trend.month} className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-2">{trend.month}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600">✓</span>
                    <span className="text-sm font-bold text-green-600">{trend.verified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-600">⏳</span>
                    <span className="text-sm font-bold text-yellow-600">{trend.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Security Metrics */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Blockchain Security Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamper-Proof</p>
                <p className="text-xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-green-600">Cryptographic security</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Decentralized</p>
                <p className="text-xl font-bold text-gray-900">Yes</p>
                <p className="text-xs text-blue-600">Multiple nodes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-xl font-bold text-gray-900">99.9%</p>
                <p className="text-xs text-purple-600">High availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateAnalytics;
