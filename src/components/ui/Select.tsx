import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Option type for Select component
 */
export interface SelectOption {
  /**
   * Value of the option
   */
  value: string;
  
  /**
   * Label text for the option
   */
  label: string;
  
  /**
   * Additional icon to display with the option
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

/**
 * Props for the Select component
 * @interface SelectProps
 */
export interface SelectProps {
  /**
   * Options to display in the select dropdown
   */
  options: SelectOption[];
  
  /**
   * Currently selected value
   */
  value?: string;
  
  /**
   * Callback when the selected value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Label for the select
   */
  label?: string;
  
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Helper text to display below the select
   */
  helperText?: string;
  
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID attribute for the select
   */
  id?: string;
  
  /**
   * Whether the select is required
   */
  required?: boolean;
  
  /**
   * Width of the dropdown
   * @default 'w-full'
   */
  width?: string;
}

/**
 * Select component for dropdown selection.
 * 
 * @example
 * // Basic usage
 * <Select 
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' },
 *   ]}
 *   value={value}
 *   onChange={(newValue) => setValue(newValue)}
 *   label="Select an option"
 * />
 * 
 * @example
 * // With icons
 * <Select 
 *   options={[
 *     { value: 'cash', label: 'Cash', icon: <Banknote className="w-4 h-4" /> },
 *     { value: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
 *   ]}
 *   value={paymentMethod}
 *   onChange={setPaymentMethod}
 *   label="Payment Method"
 *   placeholder="Select payment method"
 * />
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  className = '',
  id,
  required = false,
  width = 'w-full'
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const selectedOption = options.find(option => option.value === value);
  
  // Toggle the dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        e.preventDefault();
        break;
        
      case 'Escape':
        setIsOpen(false);
        break;
        
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => (prev + 1) % options.length);
        } else {
          setIsOpen(true);
        }
        e.preventDefault();
        break;
        
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev <= 0 ? options.length - 1 : prev - 1));
        } else {
          setIsOpen(true);
        }
        e.preventDefault();
        break;
    }
  };

  return (
    <div className={`${width} ${className}`} ref={ref}>
      {/* Label */}
      {label && (
        <label 
          className={`block text-sm font-medium mb-1.5 ${disabled ? 'opacity-60' : ''} ${error ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor={id}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      {/* Select Control */}
      <div
        className={`
          relative border rounded-lg transition-all
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${isOpen ? 'ring-2 ring-blue-500/20' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
        `}
      >
        {/* Current Selected Value Button */}
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? id : undefined}
          aria-disabled={disabled}
          className={`
            flex items-center justify-between w-full px-4 py-2.5 text-left
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
            focus:outline-none
          `}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center">
            {selectedOption?.icon && (
              <span className="mr-2 text-gray-500">{selectedOption.icon}</span>
            )}
            <span className={!selectedOption ? 'text-gray-400' : ''}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        
        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              <ul
                role="listbox"
                aria-labelledby={label ? id : undefined}
                className="py-1"
              >
                {options.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`
                      px-4 py-2 flex items-center justify-between transition-colors
                      ${highlightedIndex === index ? 'bg-blue-50' : ''}
                      ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50'}
                    `}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-2 text-gray-500">{option.icon}</span>
                      )}
                      <span>{option.label}</span>
                    </div>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error or Helper Text */}
      {(error || helperText) && (
        <div className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'} flex items-start`}>
          {error && (
            <>
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </>
          )}
          {!error && helperText && (
            <span>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';