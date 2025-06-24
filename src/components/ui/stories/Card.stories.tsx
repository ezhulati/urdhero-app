import type { Meta, StoryObj } from '@storybook/react';
import { Heart, User, Mail } from 'lucide-react';

import { Card } from '../Card';
import { Button } from '../Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    hover: {
      control: 'boolean',
    },
    glass: {
      control: 'boolean',
    },
    gradient: {
      control: 'boolean',
    },
    children: {
      control: { disable: true },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Card
export const Default: Story = {
  args: {
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Card Title</h2>
        <p className="text-gray-600 mb-4">This is a simple card component that can be used to group related content.</p>
        <Button>Click me</Button>
      </div>
    ),
  },
};

// Card with different padding
export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div className="w-80">
        <h2 className="text-lg font-semibold mb-2">Small Padding</h2>
        <p className="text-gray-600 text-sm">Card with small padding.</p>
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-4">Large Padding</h2>
        <p className="text-gray-600">Card with large padding for more spacious content.</p>
      </div>
    ),
  },
};

// Card with different shadows
export const LargeShadow: Story = {
  args: {
    shadow: 'lg',
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Large Shadow</h2>
        <p className="text-gray-600">This card has a large shadow effect.</p>
      </div>
    ),
  },
};

export const ExtraLargeShadow: Story = {
  args: {
    shadow: 'xl',
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Extra Large Shadow</h2>
        <p className="text-gray-600">This card has an extra large shadow for maximum depth.</p>
      </div>
    ),
  },
};

// Interactive Card
export const Hoverable: Story = {
  args: {
    hover: true,
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Hover Me</h2>
        <p className="text-gray-600">This card has hover effects. Try hovering over it!</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    hover: true,
    onClick: () => alert('Card clicked!'),
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Click Me</h2>
        <p className="text-gray-600">This card is clickable. Try clicking it!</p>
      </div>
    ),
  },
};

// Special effects
export const GlassEffect: Story = {
  args: {
    glass: true,
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Glass Effect</h2>
        <p className="text-gray-600">This card has a glass-like effect with backdrop blur.</p>
      </div>
    ),
  },
  parameters: {
    backgrounds: { 
      default: 'gradient',
      values: [
        { name: 'gradient', value: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' },
      ]
    },
  },
};

export const GradientBackground: Story = {
  args: {
    gradient: true,
    children: (
      <div className="w-80">
        <h2 className="text-xl font-semibold mb-2">Gradient Background</h2>
        <p className="text-gray-600">This card has a subtle gradient background.</p>
      </div>
    ),
  },
};

// Complex Card Example
export const ComplexCard: Story = {
  args: {
    shadow: 'md',
    children: (
      <div className="w-96">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">User Profile</h2>
            <p className="text-gray-600 text-sm">Account settings and preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">user@example.com</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">Cancel</Button>
            <Button size="sm" className="flex-1">Save</Button>
          </div>
        </div>
      </div>
    ),
  },
};