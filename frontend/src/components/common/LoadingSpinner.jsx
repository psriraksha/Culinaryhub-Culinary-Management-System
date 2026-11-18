import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
