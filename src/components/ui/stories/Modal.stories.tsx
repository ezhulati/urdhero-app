import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    closeOnOutsideClick: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    disableScroll: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Modal
export const Basic: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Basic Modal"
        >
          <div className="p-6">
            <p className="text-gray-700">
              This is a basic modal dialog with a title and close button.
              It can be closed by clicking the X, pressing Escape, or clicking outside.
            </p>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// Confirmation Modal
export const Confirmation: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} variant="danger">
          Delete Item
        </Button>
        
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Deletion"
          size="sm"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  // Handle delete action
                  setIsOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// Form Modal
export const FormModal: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} variant="primary">
          Edit Profile
        </Button>
        
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Profile"
          size="md"
        >
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue="john.doe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  defaultValue="Front-end developer with 5 years of experience..."
                />
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// Full Screen Modal
export const FullScreen: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} variant="secondary">
          View Full Screen
        </Button>
        
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Full Screen Modal"
          size="full"
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Full Screen Content</h2>
              <p className="mb-4">
                This modal takes up the entire screen, which is useful for immersive experiences or detailed content that needs more space.
              </p>
              <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Content Area</span>
              </div>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// Multiple Sizes
export const MultipleSizes: Story = {
  render: function Render(args) {
    const [openSize, setOpenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full' | null>(null);
    
    return (
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setOpenSize('sm')} size="sm">Small</Button>
        <Button onClick={() => setOpenSize('md')} size="sm">Medium</Button>
        <Button onClick={() => setOpenSize('lg')} size="sm">Large</Button>
        <Button onClick={() => setOpenSize('xl')} size="sm">Extra Large</Button>
        <Button onClick={() => setOpenSize('full')} size="sm">Full Screen</Button>
        
        <Modal
          {...args}
          isOpen={openSize !== null}
          onClose={() => setOpenSize(null)}
          title={`${openSize?.toUpperCase()} Modal`}
          size={openSize || 'md'}
        >
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              This is an example of a {openSize} sized modal dialog.
            </p>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setOpenSize(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};