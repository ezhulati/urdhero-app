import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from '../ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    color: {
      control: 'select',
      options: ['blue', 'green', 'orange', 'red', 'purple'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showPercentage: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Progress Bar
export const Default: Story = {
  args: {
    progress: 50,
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// Progress Bar Colors
export const Blue: Story = {
  args: {
    progress: 60,
    color: 'blue',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Green: Story = {
  args: {
    progress: 100,
    color: 'green',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Orange: Story = {
  args: {
    progress: 70,
    color: 'orange',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Red: Story = {
  args: {
    progress: 30,
    color: 'red',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Purple: Story = {
  args: {
    progress: 80,
    color: 'purple',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// Progress Bar Sizes
export const Small: Story = {
  args: {
    progress: 40,
    size: 'sm',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Medium: Story = {
  args: {
    progress: 50,
    size: 'md',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Large: Story = {
  args: {
    progress: 60,
    size: 'lg',
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// Progress Bar with Percentage
export const WithPercentage: Story = {
  args: {
    progress: 75,
    showPercentage: true,
  },
  render: args => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// Progress Bar Examples
export const Examples: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Order Progress</h3>
        <ProgressBar progress={75} color="blue" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Battery Level</h3>
        <ProgressBar progress={25} color="red" showPercentage />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Task Completion</h3>
        <ProgressBar progress={100} color="green" />
      </div>
    </div>
  ),
};