import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CertificateProvider } from './contexts/CertificateContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import PublicVerification from './pages/PublicVerification';
import CertificateDetails from './pages/CertificateDetails';
import IssueCertificate from './pages/IssueCertificate';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CertificateProvider>
        <Router>
          <div className="min-h-screen gradient-bg-light">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify/:certificateId" element={<PublicVerification />} />
              <Route path="/verify" element={<PublicVerification />} />
              
              {/* Protected Routes */}
              <Route path="/student/*" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/institution/*" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/verifier/*" element={
                <ProtectedRoute allowedRoles={['verifier']}>
                  <VerifierDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/certificate/:id" element={<CertificateDetails />} />
              <Route path="/issue-certificate" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <IssueCertificate />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CertificateProvider>
    </AuthProvider>
  );
}

export default App;