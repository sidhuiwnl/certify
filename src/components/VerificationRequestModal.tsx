import React, { useState } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (verifierName: string, verifierEmail: string) => Promise<void>;
  certificateId: string;
}

const VerificationRequestModal: React.FC<Props> = ({ visible, onClose, onSubmit, certificateId }) => {
  const [verifierName, setVerifierName] = useState('');
  const [verifierEmail, setVerifierEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!verifierName || !verifierEmail) {
      setError('Please provide verifier name and email');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(verifierName, verifierEmail);
      onClose();
    } catch (err) {
      setError('Failed to send verification request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Request Verification</h3>
        <p className="text-sm text-gray-600 mb-4">Send this certificate (ID: {certificateId}) to a verifier for review.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Verifier name</label>
            <input value={verifierName} onChange={(e) => setVerifierName(e.target.value)} className="mt-1 input-field w-full" placeholder="Verifier full name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Verifier email</label>
            <input value={verifierEmail} onChange={(e) => setVerifierEmail(e.target.value)} className="mt-1 input-field w-full" placeholder="verifier@example.com" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-green-600 text-white">
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationRequestModal;
