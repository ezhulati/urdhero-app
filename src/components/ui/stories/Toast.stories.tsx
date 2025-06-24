import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Toast, ToastContainer } from '../Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    message: { control: 'text' },
    variant: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
    duration: {
      control: { type: 'number', min: 0, step: 1000 },
    },
    dismissible: { control: 'boolean' },
    position: {
      control: 'select',
      options: [
        'top-left', 
        'top-center', 
        'top-right', 
        'bottom-left', 
        'bottom-center', 
        'bottom-right'
      ],
    },
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Toast Trigger Demo
export const ToastDemo: Story = {
  render: function Render() {
    const [toasts, setToasts] = useState<Array<{
      id: string;
      message: string;
      variant: 'success' | 'error' | 'info' | 'warning';
    }>>([]);
    
    const addToast = (variant: 'success' | 'error' | 'info' | 'warning') => {
      const id = `toast-${Date.now()}`;
      const messages = {
        success: 'Operation completed successfully!',
        error: 'An error occurred. Please try again.',
        info: 'Your order is being processed.',
        warning: 'Your session will expire in 5 minutes.'
      };
      
      setToasts(prev => [
        ...prev,
        {
          id,
          message: messages[variant],
          variant
        }
      ]);
      
      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    };
    
    const removeToast = (id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="success"
            onClick={() => addToast('success')}
          >
            Success Toast
          </Button>
          
          <Button
            variant="danger"
            onClick={() => addToast('error')}
          >
            Error Toast
          </Button>
          
          <Button
            variant="primary"
            onClick={() => addToast('info')}
          >
            Info Toast
          </Button>
          
          <Button
            variant="outline"
            onClick={() => addToast('warning')}
          >
            Warning Toast
          </Button>
        </div>
        
        {/* Toast container - in a real app, this would be at the app root level */}
        <ToastContainer position="bottom-right">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              variant={toast.variant}
              onDismiss={removeToast}
              position="bottom-right"
            />
          ))}
        </ToastContainer>
      </div>
    );
  }
};

// Individual Toast Examples
export const SuccessToast: Story = {
  args: {
    id: 'success-1',
    message: 'Operation completed successfully!',
    variant: 'success',
  },
  render: args => <Toast {...args} />,
};

export const ErrorToast: Story = {
  args: {
    id: 'error-1',
    message: 'An error occurred. Please try again.',
    variant: 'error',
  },
  render: args => <Toast {...args} />,
};

export const InfoToast: Story = {
  args: {
    id: 'info-1',
    message: 'Your order is being processed.',
    variant: 'info',
  },
  render: args => <Toast {...args} />,
};

export const WarningToast: Story = {
  args: {
    id: 'warning-1',
    message: 'Your session will expire in 5 minutes.',
    variant: 'warning',
  },
  render: args => <Toast {...args} />,
};

// Non-auto-dismissing Toast
export const PersistentToast: Story = {
  args: {
    id: 'persistent-1',
    message: 'This toast will not auto-dismiss. Click the X to close it.',
    variant: 'info',
    duration: 0, // Set to 0 to prevent auto-dismissal
  },
  render: args => <Toast {...args} />,
};

// Toast with Custom Content
export const CustomContentToast: Story = {
  args: {
    id: 'custom-1',
    message: (
      <div>
        <h4 className="font-bold">New Message Received</h4>
        <p className="text-sm mt-1">From: John Doe</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button className="text-xs font-medium text-blue-700 hover:text-blue-800">
            View Message
          </button>
        </div>
      </div>
    ),
    variant: 'info',
  },
  render: args => <Toast {...args} />,
};