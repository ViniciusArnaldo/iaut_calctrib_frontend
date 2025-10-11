import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {props.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed',
            error ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : 'border-gray-300 dark:border-gray-600',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option key="placeholder" value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
