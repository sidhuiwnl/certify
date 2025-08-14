import React from 'react';
import { Activity, Shield, Globe, Clock, CheckCircle, AlertCircle, Wifi, Database } from 'lucide-react';

interface BlockchainStatusProps {
  isConnected: boolean;
  lastBlock: number;
  networkName: string;
  nodeCount: number;
  averageBlockTime: number;
  totalTransactions: number;
}

const BlockchainStatus: React.FC<BlockchainStatusProps> = ({
  isConnected,
  lastBlock,
  networkName,
  nodeCount,
  averageBlockTime,
  totalTransactions
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Blockchain Network Status</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Block</p>
              <p className="text-xl font-bold text-gray-900">#{lastBlock.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Network</p>
              <p className="text-xl font-bold text-gray-900">{networkName}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Nodes</p>
              <p className="text-xl font-bold text-gray-900">{nodeCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Block Time</p>
              <p className="text-xl font-bold text-gray-900">{averageBlockTime}s</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Level</p>
              <p className="text-xl font-bold text-gray-900">High</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm text-gray-600">
            {isConnected 
              ? 'Blockchain network is operational and all certificates are being validated in real-time'
              : 'Connection to blockchain network is currently unavailable'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus;
