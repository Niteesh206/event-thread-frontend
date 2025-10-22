import React from 'react';

/**
 * HeroCard - Gradient hero section component
 * Used for page headers with title, description, and optional CTA
 */
const HeroCard = ({ 
  title, 
  description, 
  gradient = 'from-blue-600 via-purple-600 to-pink-500',
  children,
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl mb-6 ${className}`}>
      <div className="space-y-2">
        {title && (
          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm text-white/90 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default HeroCard;
