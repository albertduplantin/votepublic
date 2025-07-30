import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'primary',
  loading = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'secondary':
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-primary-600 bg-primary-50 border-primary-200';
    }
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = () => {
    if (change === undefined) return '';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="stats-card animate-pulse">
        <div className="skeleton h-8 w-24 mb-2"></div>
        <div className="skeleton h-12 w-16 mb-2"></div>
        <div className="skeleton h-4 w-20"></div>
      </div>
    );
  }

  return (
    <div className={`stats-card border-2 ${getColorClasses()} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <div className={`p-2 rounded-lg ${getColorClasses().split(' ')[0]} bg-opacity-20`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
      </div>
      
      {change !== undefined && (
        <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="font-medium">
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-gray-500">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};