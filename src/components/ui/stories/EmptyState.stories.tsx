import type { Meta, StoryObj } from '@storybook/react';

import { EmptyState } from '../EmptyState';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    actionLabel: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    onAction: { action: 'clicked' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Empty State
export const Default: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    actionLabel: 'Clear filters',
  },
};

// Empty State with Custom Icon
export const WithCustomIcon: Story = {
  args: {
    icon: '🔍',
    title: 'No search results',
    description: 'We couldn\'t find any matching results for your search. Please try again with different keywords.',
    actionLabel: 'Clear search',
  },
};

// Empty State Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    icon: '📱',
    title: 'No notifications',
    description: 'You don\'t have any notifications yet.',
    actionLabel: 'Refresh',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    title: 'Your cart is empty',
    description: 'Add items to your cart to see them here.',
    actionLabel: 'Browse menu',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    icon: '🛍️',
    title: 'No orders yet',
    description: 'When you place orders, they will appear here so you can track their status.',
    actionLabel: 'Place an order',
  },
};

// Common Use Cases
export const NoOrders: Story = {
  args: {
    icon: '📋',
    title: 'No orders',
    description: 'You haven\'t placed any orders yet. Browse the menu and add items to your cart.',
    actionLabel: 'Browse menu',
  },
};

export const NoResults: Story = {
  args: {
    icon: '🔍',
    title: 'No results',
    description: 'No items match your current filters. Try changing or clearing the filters.',
    actionLabel: 'Clear filters',
  },
};

export const EmptyCart: Story = {
  args: {
    icon: '🛒',
    title: 'Your cart is empty',
    description: 'Add items from the menu to get started with your order.',
    actionLabel: 'View menu',
  },
};

export const NoInternet: Story = {
  args: {
    icon: '📡',
    title: 'No internet connection',
    description: 'Please check your connection and try again. Your changes will be saved automatically when you\'re back online.',
    actionLabel: 'Try again',
  },
};