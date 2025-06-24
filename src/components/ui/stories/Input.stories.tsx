import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Eye, EyeOff, User, Lock } from 'lucide-react';

import { Input } from '../Input';

const meta = {
  title: 'UI/Input',
  component: Input,
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
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    darkMode: {
      control: 'boolean',
    },
    showPasswordToggle: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Input
export const Default: Story = {
  args: {
    placeholder: 'Enter text',
    label: 'Input Label',
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Input with Error
export const WithError: Story = {
  args: {
    placeholder: 'Enter email',
    label: 'Email',
    error: 'Please enter a valid email address',
    type: 'email',
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Input with Helper Text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter username',
    label: 'Username',
    helperText: 'Your username will be visible to others',
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Disabled Input
export const Disabled: Story = {
  args: {
    placeholder: 'This input is disabled',
    label: 'Disabled Input',
    disabled: true,
    value: 'Disabled value',
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Required Input
export const Required: Story = {
  args: {
    placeholder: 'Required field',
    label: 'Required Input',
    required: true,
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Input with Left Icon
export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Search className="w-4 h-4" />,
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Input with Right Icon
export const WithRightIcon: Story = {
  args: {
    placeholder: 'Email address',
    label: 'Email',
    rightIcon: <Mail className="w-4 h-4 text-gray-400" />,
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Clearable Input
export const Clearable: Story = {
  args: {
    placeholder: 'Type and clear',
    label: 'Clearable Input',
    clearable: true,
    value: 'Clear me',
    onClear: () => console.log('Input cleared'),
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Password Input with Toggle
export const PasswordWithToggle: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    label: 'Password',
    showPasswordToggle: true,
  },
  render: args => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

// Input with Dark Mode
export const DarkMode: Story = {
  args: {
    placeholder: 'Dark mode input',
    label: 'Dark Input',
    darkMode: true,
  },
  render: args => (
    <div className="w-80 p-6 bg-gray-900 rounded-lg">
      <Input {...args} />
    </div>
  ),
};

// Common Input Types
export const InputTypes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input 
        label="Text Input"
        type="text"
        placeholder="Enter text"
      />
      
      <Input 
        label="Email Input"
        type="email"
        placeholder="Enter email"
        leftIcon={<Mail className="w-4 h-4" />}
      />
      
      <Input 
        label="Password Input"
        type="password"
        placeholder="Enter password"
        leftIcon={<Lock className="w-4 h-4" />}
        showPasswordToggle
      />
      
      <Input 
        label="Number Input"
        type="number"
        placeholder="Enter number"
      />
      
      <Input 
        label="Date Input"
        type="date"
      />
    </div>
  ),
};