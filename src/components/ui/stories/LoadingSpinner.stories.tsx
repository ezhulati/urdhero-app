import type { Meta, StoryObj } from '@storybook/react';

import { LoadingSpinner, PageLoader } from '../LoadingSpinner';

const meta = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
    },
    text: {
      control: 'text',
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Loading Spinner
export const Default: Story = {
  args: {},
};

// Spinner Sizes
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

// Spinner Colors
export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const White: Story = {
  args: {
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Spinner with Text
export const WithText: Story = {
  args: {
    text: 'Loading...',
  },
};

export const LoadingData: Story = {
  args: {
    size: 'lg',
    text: 'Loading data...',
  },
};

export const ProcessingPayment: Story = {
  args: {
    size: 'lg',
    text: 'Processing payment...',
  },
};

// Full Page Loader Example
export const FullPageLoader: Story = {
  render: () => <PageLoader message="Loading application..." />,
  parameters: {
    layout: 'fullscreen',
  },
};