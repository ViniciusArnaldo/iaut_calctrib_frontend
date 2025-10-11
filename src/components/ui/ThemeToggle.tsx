import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'sm', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6',
    lg: 'w-14 h-7',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const translateClasses = {
    sm: 'translate-x-5',
    md: 'translate-x-6',
    lg: 'translate-x-7',
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      <button
        onClick={toggleTheme}
        type="button"
        className={`${sizeClasses[size]} relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`inline-block ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} transform rounded-full bg-white shadow-lg transition-transform ${
            theme === 'dark' ? translateClasses[size] : 'translate-x-0.5'
          }`}
        >
          <span className="flex items-center justify-center h-full">
            {theme === 'light' ? (
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            ) : (
              <Moon className={`${iconSizes[size]} text-blue-600`} />
            )}
          </span>
        </span>
      </button>
    </div>
  );
};
