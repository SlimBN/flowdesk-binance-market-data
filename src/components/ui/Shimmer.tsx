import React from 'react';

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Shimmer: React.FC<ShimmerProps> = ({ 
  className, 
  width = '100%', 
  height = '1rem',
  rounded = false,
  ...props 
}) => (
  <div 
    className={`shimmer bg-gray-200 dark:bg-gray-700 animate-pulse ${
      rounded ? 'rounded-full' : 'rounded-md'
    } ${className || ''}`}
    style={{ width, height }}
    {...props}
  />
);

// Card shimmer for loading cards
export const CardShimmer: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 ${className || ''}`}>
    <div className="space-y-4">
      <Shimmer height="1.5rem" width="60%" />
      <div className="space-y-2">
        <Shimmer height="1rem" />
        <Shimmer height="1rem" width="80%" />
        <Shimmer height="1rem" width="90%" />
      </div>
      <div className="flex space-x-4 pt-2">
        <Shimmer height="2rem" width="5rem" rounded />
        <Shimmer height="2rem" width="5rem" rounded />
      </div>
    </div>
  </div>
);

// Table row shimmer
export const TableRowShimmer: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <Shimmer height="1rem" />
      </td>
    ))}
  </tr>
);

// Market data shimmer
export const MarketDataShimmer: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Shimmer height="1rem" width="40%" />
            <Shimmer height="1.5rem" width="20%" rounded />
          </div>
          <Shimmer height="2rem" width="70%" />
          <div className="flex items-center space-x-2">
            <Shimmer height="0.75rem" width="30%" />
            <Shimmer height="0.75rem" width="25%" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Chart shimmer
export const ChartShimmer: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer height="1.5rem" width="30%" />
        <div className="flex space-x-2">
          <Shimmer height="2rem" width="4rem" rounded />
          <Shimmer height="2rem" width="4rem" rounded />
        </div>
      </div>
      <div 
        className="shimmer bg-gray-100 dark:bg-gray-800 rounded-lg"
        style={{ height }}
      >
        <div className="h-full flex items-end justify-around px-8 pb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Shimmer 
              key={index}
              width="2rem" 
              height={`${Math.random() * 60 + 20}%`}
              className="bg-gray-200 dark:bg-gray-600"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Loading overlay for components
export const LoadingOverlay: React.FC<{ children: React.ReactNode; loading: boolean }> = ({ 
  children, 
  loading 
}) => (
  <div className="relative">
    {children}
    {loading && (
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    )}
  </div>
);
