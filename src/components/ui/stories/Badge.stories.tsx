import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Star, Clock, AlertTriangle } from 'lucide-react';

import { Badge } from '../Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral', 'gradient'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    animate: {
      control: 'boolean',
    },
    pulse: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// Badge Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Neutral',
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: 'Gradient',
  },
};

// Badge Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

// Badge with Animation
export const Animated: Story = {
  args: {
    animate: true,
    children: 'Animated',
  },
};

// Badge with Pulse
export const Pulsing: Story = {
  args: {
    pulse: true,
    variant: 'warning',
    children: 'Attention',
  },
};

// Badges with Icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Heart className="w-3 h-3 mr-1" />
        Liked
      </>
    ),
    variant: 'success',
  },
};

// Multiple Badges
export const MultipleVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="gradient">Gradient</Badge>
    </div>
  ),
};

// Common use cases
export const UseCases: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Badge variant="success" size="sm">
          <Star className="w-3 h-3 mr-1" />
          New
        </Badge>
        <Badge variant="warning" size="sm">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
        <Badge variant="danger" size="sm">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      </div>
      <div className="flex space-x-2">
        <Badge variant="primary" pulse>Notifications</Badge>
        <Badge variant="gradient" animate>Premium</Badge>
      </div>
    </div>
  ),
};