import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * BottomSheetFilter - Full-screen mobile modal from bottom
 * Used for filters, onboarding, and forms on mobile
 * Slide-up animation + backdrop blur
 */
const BottomSheetFilter = ({ 
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true
}) => {
  const sheetRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Focus the first focusable element inside the sheet
      setTimeout(() => {
        const firstFocusable = sheetRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 100);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose?.();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bottom-sheet-title"
      aria-describedby={description ? 'bottom-sheet-description' : undefined}
      className="fixed inset-0 z-50 md:flex md:items-center md:justify-center"
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed inset-x-0 bottom-0 z-50
          bg-white dark:bg-gray-900
          rounded-t-3xl shadow-2xl
          max-h-[90vh] flex flex-col
          animate-slide-up
          md:relative md:max-w-lg md:mx-auto md:rounded-3xl md:max-h-[80vh]
          ${className}
        `}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {/* Handle (mobile only) */}
        <div 
          className="flex justify-center py-3 md:hidden" 
          aria-hidden="true"
        >
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 
                id="bottom-sheet-title" 
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
              {description && (
                <p 
                  id="bottom-sheet-description" 
                  className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheetFilter;
