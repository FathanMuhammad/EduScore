import React from 'react';

export default function Spinner({ size = 'md', fullPage = false }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`animate-spin rounded-full border-t-navy-800 border-r-transparent border-b-navy-200 border-l-navy-200 ${sizeClasses[size] || sizeClasses.md}`} />
      <span className="text-sm font-medium text-navy-600 animate-pulse">Memuat data...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {spinnerContent}
    </div>
  );
}
