import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../contexts/CertificateContext';
import Navbar from '../components/Navbar';
import { Award, Upload, Calendar, User, BookOpen } from 'lucide-react';

const IssueCertificate: React.FC = () => {
  const { user } = useAuth();
  const { addCertificate } = useCertificates();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
  institutionName: user?.institutionName || '',
    courseName: '',
    grade: '',
    completionDate: '',
    certificateType: 'certificate' as 'degree' | 'diploma' | 'certificate' | 'transcript'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const certificateData = {
        ...formData,
  institutionName: formData.institutionName || user?.institutionName || 'Unknown Institution',
        institutionId: user?.id || '',
        issueDate: new Date().toISOString().split('T')[0],
        verificationStatus: 'verified' as const
      };

  await addCertificate(certificateData);
      
      // Show success message
      alert('Certificate issued successfully!');
      navigate('/institution');
    } catch (err) {
      setError('Failed to issue certificate. Please try again.');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowPreview(false)}
              aria-label="Close Preview"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Certificate Preview</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p><span className="font-semibold">Student Name:</span> {formData.studentName}</p>
              <p><span className="font-semibold">Student Email:</span> {formData.studentEmail}</p>
              <p><span className="font-semibold">Course Name:</span> {formData.courseName}</p>
              <p><span className="font-semibold">Certificate Type:</span> {formData.certificateType}</p>
              <p><span className="font-semibold">Grade/GPA:</span> {formData.grade}</p>
              <p><span className="font-semibold">Completion Date:</span> {formData.completionDate}</p>
              <p><span className="font-semibold">Institution:</span> {user?.institutionName || 'Unknown Institution'}</p>
              <p className="mt-4 text-xs text-gray-500">This is a preview. Please confirm all details before issuing.</p>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowPreview(false)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issue New Certificate</h1>
          <p className="mt-2 text-gray-600">Create a new blockchain-secured certificate for your student.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Student Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    required
                    value={formData.studentName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student's full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="studentEmail"
                    required
                    value={formData.studentEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="student@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                Course Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    required
                    value={formData.courseName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Computer Science - Bachelor of Science"
                  />
                </div>
                
                <div>
                  <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700">
                    Certificate Type *
                  </label>
                  <select
                    id="certificateType"
                    name="certificateType"
                    required
                    value={formData.certificateType}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Degree</option>
                    <option value="transcript">Transcript</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade/GPA *
                  </label>
                  <input
                    type="text"
                    id="grade"
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., A, 3.8, 85%"
                  />
                </div>
              </div>
            </div>

            {/* Completion Information */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                Completion Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    id="completionDate"
                    name="completionDate"
                    required
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    name="institutionName"
                    required
                    value={formData.institutionName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., University of Example"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 text-orange-600 mr-2" />
                Certificate Document (Optional)
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload the certificate document (PDF, JPG, PNG)
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  The document will be stored securely and its hash will be recorded on the blockchain
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="certificateFile"
                />
                <label
                  htmlFor="certificateFile"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 space-x-2">
              <button
                type="button"
                onClick={() => navigate('/institution')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <span>Preview</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Issuing Certificate...</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    <span>Issue Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;