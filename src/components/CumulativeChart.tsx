import React from 'react';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  label: string;
}

interface CumulativeChartProps {
  title: string;
  data: DataPoint[];
  type: 'certificates' | 'verifications' | 'transactions' | 'growth';
  period: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

const CumulativeChart: React.FC<CumulativeChartProps> = ({
  title,
  data,
  type,
  period,
  className = ''
}) => {
  // Calculate cumulative values
  const cumulativeData = data.map((point, index) => ({
    ...point,
    cumulative: data.slice(0, index + 1).reduce((sum, d) => sum + d.value, 0)
  }));

  const maxValue = Math.max(...cumulativeData.map(d => d.cumulative));
  const minValue = Math.min(...cumulativeData.map(d => d.cumulative));

  const getTypeColor = () => {
    switch (type) {
      case 'certificates':
        return 'from-blue-500 to-purple-600';
      case 'verifications':
        return 'from-green-500 to-emerald-600';
      case 'transactions':
        return 'from-orange-500 to-red-600';
      case 'growth':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'certificates':
        return <Activity className="h-4 w-4" />;
      case 'verifications':
        return <TrendingUp className="h-4 w-4" />;
      case 'transactions':
        return <Calendar className="h-4 w-4" />;
      case 'growth':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      case '1y':
        return 'Last Year';
      default:
        return 'Period';
    }
  };

  const totalGrowth = cumulativeData.length > 1 
    ? ((cumulativeData[cumulativeData.length - 1].cumulative - cumulativeData[0].cumulative) / cumulativeData[0].cumulative * 100).toFixed(1)
    : '0.0';

  const isPositiveGrowth = parseFloat(totalGrowth) >= 0;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{getPeriodLabel()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`bg-gradient-to-r ${getTypeColor()} p-2 rounded-lg`}>
            {getTypeIcon()}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {cumulativeData[cumulativeData.length - 1]?.cumulative.toLocaleString() || 0}
            </div>
            <div className={`text-sm flex items-center ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(parseFloat(totalGrowth))}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-48 mb-4">
        <svg className="w-full h-full" viewBox={`0 0 ${cumulativeData.length * 60} 200`}>
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={200 - (percent * 2)}
              x2={cumulativeData.length * 60}
              y2={200 - (percent * 2)}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}

          {/* Cumulative Line */}
          <path
            d={cumulativeData.map((point, index) => {
              const x = index * 60 + 30;
              const y = 200 - ((point.cumulative - minValue) / (maxValue - minValue)) * 180;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke={`url(#${type}Gradient)`}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id={`${type}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={type === 'certificates' ? '#3b82f6' : type === 'verifications' ? '#10b981' : type === 'transactions' ? '#f59e0b' : '#8b5cf6'} />
              <stop offset="100%" stopColor={type === 'certificates' ? '#9333ea' : type === 'verifications' ? '#059669' : type === 'transactions' ? '#dc2626' : '#ec4899'} />
            </linearGradient>
          </defs>

          {/* Data Points */}
          {cumulativeData.map((point, index) => {
            const x = index * 60 + 30;
            const y = 200 - ((point.cumulative - minValue) / (maxValue - minValue)) * 180;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke={`url(#${type}Gradient)`}
                  strokeWidth="2"
                />
                {/* Tooltip */}
                <title>
                  {point.label}: {point.cumulative.toLocaleString()} (Cumulative)
                </title>
              </g>
            );
          })}

          {/* Area Fill */}
          <path
            d={`M 30 ${200 - ((cumulativeData[0]?.cumulative - minValue) / (maxValue - minValue)) * 180} ${cumulativeData.map((point, index) => {
              const x = index * 60 + 30;
              const y = 200 - ((point.cumulative - minValue) / (maxValue - minValue)) * 180;
              return `L ${x} ${y}`;
            }).join(' ')} L ${(cumulativeData.length - 1) * 60 + 30} 200 Z`}
            fill={`url(#${type}Gradient)`}
            fillOpacity="0.1"
          />
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {cumulativeData.map((point, index) => (
          <div key={index} className="text-center">
            {point.label}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {cumulativeData[0]?.cumulative.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-500">Starting</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {cumulativeData[cumulativeData.length - 1]?.cumulative.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveGrowth ? '+' : ''}{totalGrowth}%
          </div>
          <div className="text-xs text-gray-500">Growth</div>
        </div>
      </div>
    </div>
  );
};

export default CumulativeChart;
