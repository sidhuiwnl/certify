import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle, 
  Calendar, 
  Building, 
  User, 
  Award, 
  FileText,
  QrCode,
  Shield,
  ExternalLink
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CertificateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { verifyCertificate } = useCertificates();
  const certRef = useRef<HTMLDivElement>(null);
  
  const certificate = verifyCertificate(id || '');

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Certificate Not Found</h1>
            <p className="text-gray-600 mb-6">The certificate you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const downloadCertificate = async () => {
    if (!certRef.current) return;
    const input = certRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    pdf.save(`certificate-${certificate.id}.pdf`);
  };

  const shareCertificate = () => {
    const url = `${window.location.origin}/verify/${certificate.id}`;
    navigator.clipboard.writeText(url);
    alert('Certificate verification link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certificate Details</h1>
              <p className="mt-2 text-gray-600">Certificate ID: {certificate.id}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadCertificate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={shareCertificate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

  {/* Certificate Preview */}
  <div ref={certRef} className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600">This certifies that</p>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">{certificate.studentName}</h3>
            <p className="text-lg text-gray-700 mb-2">has successfully completed</p>
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">{certificate.courseName}</h4>
            <p className="text-lg text-gray-700 mb-4">with a grade of <span className="font-bold text-green-600">{certificate.grade}</span></p>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">Issued by</p>
              <p className="font-semibold text-gray-900">{certificate.institutionName}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Completion Date</p>
              <p className="font-semibold text-gray-900">{new Date(certificate.completionDate).toLocaleDateString()}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="font-semibold text-gray-900">{new Date(certificate.issueDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img 
              src={certificate.qrCode} 
              alt="Certificate QR Code" 
              className="w-32 h-32 border border-gray-200 rounded-lg bg-white p-2"
              onError={(e) => {
                console.error('QR Code failed to load:', certificate.qrCode);
                e.currentTarget.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(window.location.origin + '/verify/' + certificate.id)}`;
              }}
            />
          </div>
        </div>

        {/* Certificate Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              Student Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Full Name</p>
                <p className="text-gray-700">{certificate.studentName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-gray-700">{certificate.studentEmail}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Grade Achieved</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {certificate.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-green-600 mr-2" />
              Course Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Course Name</p>
                <p className="text-gray-700">{certificate.courseName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Certificate Type</p>
                <p className="text-gray-700 capitalize">{certificate.certificateType}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Completion Date</p>
                <p className="text-gray-700">{new Date(certificate.completionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Institution Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 text-purple-600 mr-2" />
              Institution Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Institution Name</p>
                <p className="text-gray-700">{certificate.institutionName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Issue Date</p>
                <p className="text-gray-700">{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Verification Status</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-orange-600 mr-2" />
              Blockchain Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Blockchain Hash</p>
                <p className="text-xs font-mono text-gray-600 break-all">{certificate.blockchainHash}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">IPFS Hash</p>
                <p className="text-xs font-mono text-gray-600 break-all">{certificate.ipfsHash}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Verification URL</p>
                <a
                  href={`/verify/${certificate.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                >
                  <span>Verify Certificate</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <QrCode className="h-5 w-5 text-blue-600 mr-2" />
            Certificate QR Code
          </h3>
          
          <div className="flex justify-center mb-4">
            <img 
              src={certificate.qrCode} 
              alt="Certificate QR Code" 
              className="w-48 h-48 border border-gray-200 rounded-lg bg-white p-2"
              onError={(e) => {
                console.error('QR Code failed to load:', certificate.qrCode);
                e.currentTarget.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(window.location.origin + '/verify/' + certificate.id)}`;
              }}
            />
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code to instantly verify the certificate authenticity
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.open(certificate.qrCode, '_blank')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code</span>
            </button>
            {/* Public Verification link removed for student role */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;