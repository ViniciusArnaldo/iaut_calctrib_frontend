import React from 'react';
import { Card } from '../../../components/ui/Card';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
};

export const StatsCard: React.FC<Props> = ({ title, value, icon, description, color = 'blue' }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
    </Card>
  );
};
