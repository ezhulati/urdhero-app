import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for individual Tab component
 * @interface TabProps
 */
export interface TabProps {
  /**
   * Unique identifier for the tab
   */
  id: string;
  
  /**
   * Label text to display on the tab
   */
  label: React.ReactNode;
  
  /**
   * Icon to display on the tab
   */
  icon?: React.ReactNode;
  
  /**
   * Badge content to display on the tab
   */
  badge?: React.ReactNode;
  
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Content to display when tab is active
   */
  children: React.ReactNode;
}

/**
 * Props for the Tabs component
 * @interface TabsProps
 */
export interface TabsProps {
  /**
   * Tab components to render
   */
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  
  /**
   * ID of the initially active tab
   */
  defaultActiveTab?: string;
  
  /**
   * ID of the currently active tab (controlled)
   */
  activeTab?: string;
  
  /**
   * Callback when the active tab changes
   */
  onChange?: (tabId: string) => void;
  
  /**
   * Whether to animate tab transitions
   * @default true
   */
  animated?: boolean;
  
  /**
   * Visual variant of the tabs
   * @default 'default'
   */
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Tabs component for organizing content into tabbed sections.
 * 
 * @example
 * // Basic usage
 * <Tabs defaultActiveTab="tab1">
 *   <Tab id="tab1" label="Tab 1">
 *     <p>Content for tab 1</p>
 *   </Tab>
 *   <Tab id="tab2" label="Tab 2">
 *     <p>Content for tab 2</p>
 *   </Tab>
 * </Tabs>
 * 
 * @example
 * // With icons and badges
 * <Tabs variant="pills">
 *   <Tab 
 *     id="orders" 
 *     label="Orders" 
 *     icon={<ShoppingBag className="w-4 h-4" />}
 *     badge={<Badge variant="danger">3</Badge>}
 *   >
 *     <OrdersPanel />
 *   </Tab>
 *   <Tab 
 *     id="settings" 
 *     label="Settings" 
 *     icon={<Settings className="w-4 h-4" />}
 *   >
 *     <SettingsPanel />
 *   </Tab>
 * </Tabs>
 */
export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onChange,
  animated = true,
  variant = 'default',
  className = ''
}) => {
  // Use state for internal active tab if not controlled
  const [activeTabInternal, setActiveTabInternal] = useState(() => {
    const childArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
    return defaultActiveTab || (childArray.length > 0 && !childArray[0].props.disabled ? childArray[0].props.id : '');
  });

  // Determine which active tab to use (controlled or internal)
  const activeTabId = controlledActiveTab !== undefined ? controlledActiveTab : activeTabInternal;

  // Handle tab click
  const handleTabClick = (tabId: string, disabled: boolean | undefined) => {
    if (disabled) return;
    
    // Update internal state if not controlled
    if (controlledActiveTab === undefined) {
      setActiveTabInternal(tabId);
    }
    
    // Call onChange handler if provided
    if (onChange) {
      onChange(tabId);
    }
  };

  // Filter out invalid children
  const tabsArray = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<TabProps> => {
      return React.isValidElement(child) && 'id' in child.props;
    });

  // Get tab buttons and content sections
  const tabButtons = tabsArray.map((tab) => {
    const { id, label, icon, badge, disabled } = tab.props;
    const isActive = id === activeTabId;
    
    // Styles based on variant
    let variantClasses = '';
    let activeClasses = '';
    let inactiveClasses = '';
    
    switch (variant) {
      case 'pills':
        variantClasses = 'rounded-full';
        activeClasses = 'bg-blue-600 text-white';
        inactiveClasses = 'text-gray-700 hover:text-gray-900 hover:bg-gray-100';
        break;
        
      case 'underline':
        variantClasses = 'border-b-2 rounded-none px-4 py-2';
        activeClasses = 'border-blue-600 text-blue-700';
        inactiveClasses = 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900';
        break;
        
      case 'enclosed':
        variantClasses = 'border-t border-l border-r rounded-t-lg';
        activeClasses = 'bg-white border-gray-200 text-blue-700';
        inactiveClasses = 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-900';
        break;
        
      default: // 'default'
        variantClasses = 'rounded-lg';
        activeClasses = 'bg-white text-blue-700 shadow-sm border border-gray-100';
        inactiveClasses = 'text-gray-700 hover:text-gray-900 hover:bg-white/50';
    }
    
    return (
      <button
        key={id}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tab-panel-${id}`}
        id={`tab-button-${id}`}
        disabled={disabled}
        onClick={() => handleTabClick(id, disabled)}
        className={`
          relative px-4 py-2.5 font-medium text-sm focus:outline-none transition-all
          ${variantClasses}
          ${isActive ? activeClasses : inactiveClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          flex items-center justify-center space-x-2
        `}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        {badge && <span className="ml-1">{badge}</span>}
      </button>
    );
  });

  // Get content of active tab
  const activeTabContent = tabsArray.find(tab => tab.props.id === activeTabId)?.props.children;
  
  // Get container styles based on variant
  let tabListClasses = 'flex space-x-1';
  let contentClasses = 'mt-4';
  
  if (variant === 'underline') {
    tabListClasses = 'flex space-x-2 border-b border-gray-200';
    contentClasses = 'mt-6';
  } else if (variant === 'enclosed') {
    tabListClasses = 'flex space-x-1';
    contentClasses = 'mt-0 border border-gray-200 rounded-b-lg p-4 bg-white';
  }

  return (
    <div className={className}>
      <div className={tabListClasses} role="tablist">
        {tabButtons}
      </div>
      
      <div className={contentClasses}>
        {animated ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              role="tabpanel"
              id={`tab-panel-${activeTabId}`}
              aria-labelledby={`tab-button-${activeTabId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTabContent}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            role="tabpanel"
            id={`tab-panel-${activeTabId}`}
            aria-labelledby={`tab-button-${activeTabId}`}
          >
            {activeTabContent}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tab component for use within Tabs.
 * Should contain the content to be displayed when the tab is active.
 */
export const Tab: React.FC<TabProps> = ({ children }) => {
  // This component doesn't render anything directly
  // It's just used as a container for tab props and content
  return <>{children}</>;
};