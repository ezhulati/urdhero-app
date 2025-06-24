import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';
import { SkeletonLoader, MenuItemSkeleton, OrderCardSkeleton } from '../SkeletonLoader';

const meta = {
  title: 'UI/SkeletonLoader',
  component: SkeletonLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    lines: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
    },
    height: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof SkeletonLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Skeleton Loader
export const Default: Story = {
  args: {
    lines: 3,
    height: 'md',
  },
  render: args => (
    <div className="w-80">
      <SkeletonLoader {...args} />
    </div>
  ),
};

// Skeleton with Different Line Count
export const SingleLine: Story = {
  args: {
    lines: 1,
    height: 'md',
  },
  render: args => (
    <div className="w-80">
      <SkeletonLoader {...args} />
    </div>
  ),
};

export const ManyLines: Story = {
  args: {
    lines: 6,
    height: 'sm',
  },
  render: args => (
    <div className="w-80">
      <SkeletonLoader {...args} />
    </div>
  ),
};

// Skeleton with Different Heights
export const SmallHeight: Story = {
  args: {
    lines: 3,
    height: 'sm',
  },
  render: args => (
    <div className="w-80">
      <SkeletonLoader {...args} />
    </div>
  ),
};

export const LargeHeight: Story = {
  args: {
    lines: 3,
    height: 'lg',
  },
  render: args => (
    <div className="w-80">
      <SkeletonLoader {...args} />
    </div>
  ),
};

// Complex Skeleton Examples
export const CardSkeleton: Story = {
  render: () => (
    <Card className="w-80 p-4">
      <SkeletonLoader lines={4} height="sm" />
    </Card>
  ),
};

export const MenuItemSkeletonExample: Story = {
  render: () => (
    <div className="w-[500px]">
      <MenuItemSkeleton />
    </div>
  ),
};

export const OrderCardSkeletonExample: Story = {
  render: () => (
    <div className="w-80">
      <OrderCardSkeleton />
    </div>
  ),
};

// Multiple Skeletons
export const LoadingList: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <OrderCardSkeleton />
      <OrderCardSkeleton />
      <OrderCardSkeleton />
    </div>
  ),
};

export const LoadingGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <SkeletonLoader lines={3} height="sm" />
      </Card>
      <Card className="p-4">
        <SkeletonLoader lines={3} height="sm" />
      </Card>
      <Card className="p-4">
        <SkeletonLoader lines={3} height="sm" />
      </Card>
      <Card className="p-4">
        <SkeletonLoader lines={3} height="sm" />
      </Card>
    </div>
  ),
};