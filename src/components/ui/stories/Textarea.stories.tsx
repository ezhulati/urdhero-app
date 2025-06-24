import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from '../Textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    maxLength: {
      control: 'number',
    },
    autoResize: {
      control: 'boolean',
    },
    darkMode: {
      control: 'boolean',
    },
    rows: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Textarea
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    label: 'Description',
    rows: 3,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// Textarea with Error
export const WithError: Story = {
  args: {
    placeholder: 'Enter feedback...',
    label: 'Feedback',
    error: 'Feedback is required',
    required: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// Textarea with Helper Text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your message...',
    label: 'Message',
    helperText: 'Your message will be sent to our support team',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// Textarea with Character Count
export const WithCharacterCount: Story = {
  args: {
    placeholder: 'Enter your bio...',
    label: 'Bio',
    maxLength: 200,
    helperText: 'Tell us about yourself',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// Auto-resize Textarea
export const AutoResize: Story = {
  args: {
    placeholder: 'Type something long...',
    label: 'Auto-resizing Textarea',
    autoResize: true,
    rows: 2,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-2">
          Try typing multiple lines and watch the textarea grow!
        </p>
      </div>
    );
  },
};

// Disabled Textarea
export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    label: 'Disabled Textarea',
    disabled: true,
    value: 'You cannot edit this content',
  },
  render: function Render(args) {
    return (
      <div className="w-80">
        <Textarea {...args} />
      </div>
    );
  },
};

// Dark Mode Textarea
export const DarkMode: Story = {
  args: {
    placeholder: 'Dark mode textarea',
    label: 'Dark Textarea',
    darkMode: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80 p-6 bg-gray-900 rounded-lg">
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// Multiple Textareas in a Form
export const FormExample: Story = {
  render: function Render() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    return (
      <div className="w-96 space-y-4 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Create Post</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter post title"
          />
        </div>
        
        <Textarea
          label="Description"
          placeholder="Write your post content here..."
          rows={4}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <div className="pt-2">
          <Button>Create Post</Button>
        </div>
      </div>
    );
  },
};