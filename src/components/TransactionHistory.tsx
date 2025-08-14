import React from 'react';
import { Clock, CheckCircle, AlertCircle, ExternalLink, Hash, Calendar, Building, User } from 'lucide-react';

interface Transaction {
  id: string;
  certificateId: string;
  type: 'issue' | 'verify' | 'revoke';
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber: number;
  timestamp: string;
  hash: string;
  from: string;
  to: string;
  gasUsed: number;
  institutionName?: string;
  studentName?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'issue':
        return 'bg-blue-100 text-blue-800';
      case 'verify':
        return 'bg-green-100 text-green-800';
      case 'revoke':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Blockchain Transaction History</h3>
          <div className="text-sm text-gray-500">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
          <p className="text-gray-600">Blockchain transactions will appear here once certificates are processed</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatHash(transaction.hash)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.institutionName && (
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {transaction.institutionName}
                            </span>
                          )}
                          {transaction.studentName && (
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {transaction.studentName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{transaction.blockNumber.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(transaction.hash)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Copy transaction hash"
                      >
                        <Hash className="h-4 w-4" />
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${transaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="View on blockchain explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Transaction Summary */}
      {transactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Transactions:</span>
              <span className="ml-2 font-medium text-gray-900">{transactions.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Confirmed:</span>
              <span className="ml-2 font-medium text-green-600">
                {transactions.filter(t => t.status === 'confirmed').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-medium text-yellow-600">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Gas Used:</span>
              <span className="ml-2 font-medium text-gray-900">
                {transactions.reduce((sum, t) => sum + t.gasUsed, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
