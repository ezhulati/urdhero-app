import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Coffee, Pizza, Salad, Utensils, Check } from 'lucide-react';

import { Select, SelectOption } from '../Select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: { control: { disable: true } },
    value: { control: { disable: true } },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    width: { control: 'text' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options
const simpleOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const paymentOptions: SelectOption[] = [
  { value: 'cash', label: 'Cash Payment', icon: <Banknote className="w-4 h-4" /> },
  { value: 'card', label: 'Card Payment', icon: <CreditCard className="w-4 h-4" /> },
  { value: 'digital', label: 'Digital Wallet', icon: <Smartphone className="w-4 h-4" /> },
];

const menuCategoryOptions: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'drinks', label: 'Drinks', icon: <Coffee className="w-4 h-4" /> },
  { value: 'pizza', label: 'Pizzas', icon: <Pizza className="w-4 h-4" /> },
  { value: 'salads', label: 'Salads', icon: <Salad className="w-4 h-4" /> },
  { value: 'mains', label: 'Main Courses', icon: <Utensils className="w-4 h-4" /> },
  { value: 'desserts', label: 'Desserts', icon: <Check className="w-4 h-4" /> },
];

// Basic Select with Default Options
export const Default: Story = {
  args: {
    options: simpleOptions,
    label: 'Select an option',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={setValue}
        />
      </div>
    );
  },
};

// Select with Icons
export const WithIcons: Story = {
  args: {
    options: paymentOptions,
    label: 'Payment Method',
    placeholder: 'Select payment method',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={(newValue) => {
            setValue(newValue);
            args.onChange(newValue);
          }}
        />
      </div>
    );
  },
};

// Select with Error
export const WithError: Story = {
  args: {
    options: simpleOptions,
    label: 'Select an option',
    error: 'Please select a valid option',
    required: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={setValue}
        />
      </div>
    );
  },
};

// Disabled Select
export const Disabled: Story = {
  args: {
    options: simpleOptions,
    label: 'Disabled Select',
    placeholder: 'Cannot select',
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={setValue}
        />
      </div>
    );
  },
};

// Select with Helper Text
export const WithHelperText: Story = {
  args: {
    options: menuCategoryOptions,
    label: 'Menu Category',
    helperText: 'Select a category to filter menu items',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={setValue}
        />
      </div>
    );
  },
};

// Select with Pre-selected Value
export const WithPreselectedValue: Story = {
  args: {
    options: menuCategoryOptions,
    label: 'Menu Category',
  },
  render: function Render(args) {
    const [value, setValue] = useState('drinks');
    return (
      <div className="w-80">
        <Select 
          {...args} 
          value={value} 
          onChange={setValue}
        />
      </div>
    );
  },
};

// Multiple Select Components
export const MultipleSelects: Story = {
  render: function Render() {
    const [category, setCategory] = useState('');
    const [payment, setPayment] = useState('');
    
    return (
      <div className="w-80 space-y-6">
        <Select 
          options={menuCategoryOptions}
          value={category}
          onChange={setCategory}
          label="Menu Category"
        />
        
        <Select 
          options={paymentOptions}
          value={payment}
          onChange={setPayment}
          label="Payment Method"
          placeholder="Select payment method"
        />
      </div>
    );
  },
};