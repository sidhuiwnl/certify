import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import QRScanner from '../components/QRScanner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  QrCode, 
  Shield, 
  Calendar,
  Building,
  User,
  Award,
  FileText,
  ExternalLink,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';

const PublicVerification: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const { verifyCertificate } = useCertificates();
  const [searchId, setSearchId] = useState(certificateId || '');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (certificateId) {
      handleVerify(certificateId);
    }
  }, [certificateId]);

  const handleVerify = async (id: string) => {
    setLoading(true);
    setHasSearched(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = verifyCertificate(id);
    setVerificationResult(result);
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchId.trim()) {
      handleVerify(searchId.trim());
    }
  };

  const handleQRScan = (result: string) => {
    // Extract certificate ID from QR code result
    // The QR code contains the full verification URL
    const urlParts = result.split('/');
    const certId = urlParts[urlParts.length - 1];
    
    if (certId) {
      setSearchId(certId);
      handleVerify(certId);
    }
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Verification</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of academic certificates using advanced blockchain technology. 
            Get instant results with complete transparency.
          </p>
        </div>

        {/* Search Section */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter certificate ID to verify..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="input-field text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or scan QR code from certificate</p>
            <button 
              onClick={() => setShowScanner(true)}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              <QrCode className="h-5 w-5" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div className="card p-8 mb-8">
            {verificationResult ? (
              <div className="space-y-8">
                {/* Success Header */}
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-green-800 mb-3">Certificate Verified ✅</h2>
                  <p className="text-xl text-green-600">This certificate is authentic and verified on the blockchain</p>
                </div>

                {/* Certificate Details */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Certificate Details</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Student</p>
                            <p className="text-xl font-bold text-gray-900">{verificationResult.studentName}</p>
                            <p className="text-gray-600">{verificationResult.studentEmail}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Course</p>
                            <p className="text-xl font-bold text-gray-900">{verificationResult.courseName}</p>
                            <p className="text-gray-600">Grade: {verificationResult.grade}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Institution</p>
                            <p className="text-xl font-bold text-gray-900">{verificationResult.institutionName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Issue Date</p>
                            <p className="text-xl font-bold text-gray-900">
                              {new Date(verificationResult.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Completion Date</p>
                            <p className="text-xl font-bold text-gray-900">
                              {new Date(verificationResult.completionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-xl">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Certificate Type</p>
                            <p className="text-xl font-bold text-gray-900 capitalize">{verificationResult.certificateType}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Blockchain Verification</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Blockchain Hash</p>
                        <p className="text-xs font-mono text-gray-600 break-all bg-gray-50 p-2 rounded">{verificationResult.blockchainHash}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-900 mb-2">IPFS Hash</p>
                        <p className="text-xs font-mono text-gray-600 break-all bg-gray-50 p-2 rounded">{verificationResult.ipfsHash}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="border-t border-gray-200 pt-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Certificate QR Code</h3>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <img 
                        src={verificationResult.qrCode} 
                        alt="Certificate QR Code" 
                        className="w-40 h-40"
                        onError={(e) => {
                          console.error('QR Code failed to load:', verificationResult.qrCode);
                          e.currentTarget.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(window.location.origin + '/verify/' + verificationResult.id)}`;
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Scan this QR code to verify the certificate
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-8 flex justify-center">
                  <Link
                    to={`/certificate/${verificationResult.id}`}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>View Full Certificate</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full">
                    <XCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-red-800 mb-3">Certificate Not Found</h2>
                <p className="text-xl text-red-600 mb-6">
                  The certificate ID provided does not exist in our blockchain records
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <span className="text-lg font-medium text-red-800">
                      This certificate may be fraudulent or the ID may be incorrect
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Verification Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Enter Certificate ID</h3>
              <p className="text-gray-600">Enter the unique certificate ID or scan the QR code from the certificate</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Blockchain Lookup</h3>
              <p className="text-gray-600">System checks the certificate hash against immutable blockchain records</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Instant Results</h3>
              <p className="text-gray-600">Get immediate verification results with complete certificate details</p>
            </div>
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

export default PublicVerification;