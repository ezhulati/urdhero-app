import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast variant types
 */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast position options
 */
export type ToastPosition = 
  | 'top-left' 
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Props for the Toast component
 * @interface ToastProps
 */
export interface ToastProps {
  /**
   * Unique ID for the toast
   */
  id: string;
  
  /**
   * Toast message content
   */
  message: React.ReactNode;
  
  /**
   * Variant that determines the toast styling
   * @default 'info'
   */
  variant?: ToastVariant;
  
  /**
   * Auto-dismissal timeout in milliseconds
   * @default 3000 (3 seconds)
   */
  duration?: number;
  
  /**
   * Whether the toast can be dismissed manually
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * Function to call when the toast is dismissed
   */
  onDismiss: (id: string) => void;
  
  /**
   * Position of the toast on screen
   * @default 'bottom-right'
   */
  position?: ToastPosition;
}

/**
 * Toast component for displaying notifications.
 * 
 * @example
 * // Within a Toast provider or manager
 * <Toast
 *   id="success-1"
 *   message="Operation completed successfully"
 *   variant="success"
 *   onDismiss={(id) => removeToast(id)}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'info',
  duration = 3000,
  dismissible = true,
  onDismiss,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Transition after animation completes
  const handleAnimationComplete = () => {
    if (!isVisible) {
      onDismiss(id);
    }
  };

  // Create/get toast container element
  useEffect(() => {
    let container = document.getElementById('toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.zIndex = '9999';
      
      // Position based on the position prop
      if (position.includes('top')) {
        container.style.top = '1rem';
      } else {
        container.style.bottom = '1rem';
      }
      
      if (position.includes('left')) {
        container.style.left = '1rem';
      } else if (position.includes('center')) {
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
      } else {
        container.style.right = '1rem';
      }
      
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    return () => {
      // Clean up only if no toasts are left
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, [position]);

  // Get variant-specific styles and icon
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          icon: <AlertCircle className="w-5 h-5 text-orange-600" />
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600" />
        };
    }
  };

  const { bgColor, textColor, icon } = getVariantStyles();

  if (!portalContainer) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          onAnimationComplete={handleAnimationComplete}
          className={`
            flex items-start w-full max-w-sm overflow-hidden 
            rounded-lg border shadow-lg my-2 ${bgColor}
          `}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex-shrink-0 p-4">
            {icon}
          </div>
          
          <div className={`flex-1 p-4 ${textColor}`}>
            {typeof message === 'string' ? (
              <p className="text-sm font-medium">{message}</p>
            ) : (
              message
            )}
          </div>
          
          {dismissible && (
            <div className="p-2">
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    portalContainer
  );
};

// Toast container for managing multiple toasts
interface ToastContainerProps {
  position?: ToastPosition;
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'bottom-right',
  children 
}) => {
  const containerClasses = {
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0'
  };

  return (
    <div
      className={`fixed z-50 p-4 space-y-4 max-w-sm w-full ${containerClasses[position]}`}
    >
      {children}
    </div>
  );
};