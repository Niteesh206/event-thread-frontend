import React from 'react';

/**
 * Card Component - Clean, consistent card layout
 * @param {Object} props
 * @param {boolean} props.hover - Enable hover effect
 * @param {boolean} props.noPadding - Remove default padding
 * @param {React.ReactNode} props.children
 */
export const Card = ({ hover = false, noPadding = false, className = '', children, ...props }) => {
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-soft';
  const hoverStyles = hover ? 'transition-base hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer' : '';
  const paddingStyles = noPadding ? '' : 'p-6';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardHeader - Card header section
 */
export const CardHeader = ({ className = '', children }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

/**
 * CardTitle - Card title
 */
export const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h3>
);

/**
 * CardDescription - Card description
 */
export const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

/**
 * CardContent - Card content section
 */
export const CardContent = ({ className = '', children }) => (
  <div className={className}>{children}</div>
);

/**
 * CardFooter - Card footer section
 */
export const CardFooter = ({ className = '', children }) => (
  <div className={`mt-4 flex items-center gap-2 ${className}`}>{children}</div>
);

export default Card;
