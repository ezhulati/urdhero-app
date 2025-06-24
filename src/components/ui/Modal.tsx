import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card } from './Card';

/**
 * Props for the Modal component
 * @interface ModalProps
 */
export interface ModalProps {
  /**
   * Whether the modal is currently open
   */
  isOpen: boolean;
  
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Modal title
   */
  title?: string;
  
  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Additional CSS classes for the modal container
   */
  className?: string;
  
  /**
   * Content to display inside the modal
   */
  children: React.ReactNode;
  
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the modal when the Escape key is pressed
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether to disable scrolling of the background page when the modal is open
   * @default true
   */
  disableScroll?: boolean;
  
  /**
   * Whether to focus the modal content when it opens (for accessibility)
   * @default true
   */
  autoFocus?: boolean;
}

/**
 * Modal component for displaying content in a dialog.
 * 
 * @example
 * // Basic usage
 * <Modal 
 *   isOpen={isModalOpen} 
 *   onClose={() => setIsModalOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 *   <div className="flex justify-end mt-4 space-x-2">
 *     <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </div>
 * </Modal>
 * 
 * @example
 * // Full screen modal with custom content
 * <Modal 
 *   isOpen={showFullScreenModal}
 *   onClose={handleCloseModal}
 *   size="full"
 *   title="Product Preview"
 * >
 *   <div className="h-full flex flex-col">
 *     <div className="flex-1 overflow-auto p-4">
 *       <img src="/product-image.jpg" alt="Product" className="w-full h-auto" />
 *       <h2 className="text-xl font-bold mt-4">Product Name</h2>
 *       <p className="mt-2">Detailed product description goes here.</p>
 *     </div>
 *     <div className="border-t p-4">
 *       <Button fullWidth>Add to Cart</Button>
 *     </div>
 *   </div>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  className = '',
  children,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  disableScroll = true,
  autoFocus = true
}) => {
  // Ref for the modal content
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);
  
  // Handle scroll locking
  useEffect(() => {
    if (disableScroll && isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, disableScroll]);
  
  // Auto focus the modal content for accessibility
  useEffect(() => {
    if (isOpen && autoFocus && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen, autoFocus]);
  
  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full w-full h-full m-0 rounded-none'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOutsideClick ? onClose : undefined}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              className={`w-full ${sizeClasses[size]} ${className}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              ref={contentRef}
              tabIndex={-1} // Make the modal content focusable
            >
              <Card className={`overflow-hidden ${size === 'full' ? 'h-full flex flex-col' : ''}`}>
                {/* Modal Header */}
                {(title || showCloseButton) && (
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    {title && (
                      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Modal Body */}
                <div className={`${size === 'full' ? 'flex-1 overflow-auto' : ''}`}>
                  {children}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};