import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from '../Toggle';

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['blue', 'green', 'purple', 'red', 'orange'],
    },
    disabled: { control: 'boolean' },
    onChange: { action: 'toggled' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Toggle
export const Default: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={setChecked}
        label="Toggle me"
      />
    );
  },
};

// Toggle Sizes
export const Sizes: Story = {
  render: function Render() {
    const [smallChecked, setSmallChecked] = useState(false);
    const [mediumChecked, setMediumChecked] = useState(true);
    const [largeChecked, setLargeChecked] = useState(false);
    
    return (
      <div className="space-y-6">
        <Toggle
          checked={smallChecked}
          onChange={setSmallChecked}
          label="Small Toggle"
          size="sm"
        />
        
        <Toggle
          checked={mediumChecked}
          onChange={setMediumChecked}
          label="Medium Toggle"
          size="md"
        />
        
        <Toggle
          checked={largeChecked}
          onChange={setLargeChecked}
          label="Large Toggle"
          size="lg"
        />
      </div>
    );
  },
};

// Toggle Colors
export const Colors: Story = {
  render: function Render() {
    const [blueChecked, setBlueChecked] = useState(true);
    const [greenChecked, setGreenChecked] = useState(true);
    const [purpleChecked, setPurpleChecked] = useState(true);
    const [redChecked, setRedChecked] = useState(true);
    const [orangeChecked, setOrangeChecked] = useState(true);
    
    return (
      <div className="space-y-6">
        <Toggle
          checked={blueChecked}
          onChange={setBlueChecked}
          label="Blue Toggle"
          color="blue"
        />
        
        <Toggle
          checked={greenChecked}
          onChange={setGreenChecked}
          label="Green Toggle"
          color="green"
        />
        
        <Toggle
          checked={purpleChecked}
          onChange={setPurpleChecked}
          label="Purple Toggle"
          color="purple"
        />
        
        <Toggle
          checked={redChecked}
          onChange={setRedChecked}
          label="Red Toggle"
          color="red"
        />
        
        <Toggle
          checked={orangeChecked}
          onChange={setOrangeChecked}
          label="Orange Toggle"
          color="orange"
        />
      </div>
    );
  },
};

// Disabled Toggle
export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="space-y-6">
        <Toggle
          checked={false}
          onChange={() => {}}
          label="Disabled (Off)"
          disabled
        />
        
        <Toggle
          checked={true}
          onChange={() => {}}
          label="Disabled (On)"
          disabled
        />
      </div>
    );
  },
};

// Toggle Without Label
export const WithoutLabel: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

// Toggle Use Cases
export const UseCases: Story = {
  render: function Render() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(false);
    
    return (
      <div className="space-y-6">
        <Toggle
          checked={darkMode}
          onChange={setDarkMode}
          label="Dark Mode"
          color="purple"
          size="md"
        />
        
        <Toggle
          checked={notifications}
          onChange={setNotifications}
          label="Enable Notifications"
          color="blue"
          size="md"
        />
        
        <Toggle
          checked={soundEffects}
          onChange={setSoundEffects}
          label="Sound Effects"
          color="green"
          size="md"
        />
      </div>
    );
  },
};