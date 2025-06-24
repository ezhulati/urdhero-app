import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Utensils, Coffee, Pizza, User, Settings, Bell, BarChart, Package } from 'lucide-react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { Tabs, Tab } from '../Tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'enclosed'],
    },
    animated: { control: 'boolean' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Tabs
export const Default: Story = {
  args: {
    defaultActiveTab: 'tab1',
    variant: 'default',
    animated: true,
  },
  render: function Render(args) {
    return (
      <div className="w-[500px]">
        <Tabs {...args}>
          <Tab id="tab1" label="First Tab">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">First Tab Content</h3>
              <p className="text-gray-600">
                This is the content for the first tab. You can put any components or content here.
              </p>
            </div>
          </Tab>
          <Tab id="tab2" label="Second Tab">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Second Tab Content</h3>
              <p className="text-gray-600">
                This is the content for the second tab. Each tab can have completely different content.
              </p>
            </div>
          </Tab>
          <Tab id="tab3" label="Third Tab">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Third Tab Content</h3>
              <p className="text-gray-600">
                This is the content for the third tab. Tabs are great for organizing related content.
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
};

// Tabs with Icons
export const WithIcons: Story = {
  args: {
    defaultActiveTab: 'food',
    variant: 'default',
  },
  render: function Render(args) {
    return (
      <div className="w-[500px]">
        <Tabs {...args}>
          <Tab 
            id="food" 
            label="Food Menu" 
            icon={<Utensils className="w-4 h-4" />}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Food Menu</h3>
              <p className="text-gray-600">
                Browse our selection of delicious dishes.
              </p>
            </div>
          </Tab>
          <Tab 
            id="coffee" 
            label="Coffee" 
            icon={<Coffee className="w-4 h-4" />}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Coffee Menu</h3>
              <p className="text-gray-600">
                Explore our specialty coffees and hot drinks.
              </p>
            </div>
          </Tab>
          <Tab 
            id="pizza" 
            label="Pizza" 
            icon={<Pizza className="w-4 h-4" />}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Pizza Menu</h3>
              <p className="text-gray-600">
                Check out our authentic Italian pizzas.
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
};

// Tabs with Badges
export const WithBadges: Story = {
  args: {
    defaultActiveTab: 'notifications',
    variant: 'pills',
  },
  render: function Render(args) {
    return (
      <div className="w-[500px]">
        <Tabs {...args}>
          <Tab 
            id="notifications" 
            label="Notifications" 
            icon={<Bell className="w-4 h-4" />}
            badge={<Badge variant="danger" size="sm">3</Badge>}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600">
                You have 3 unread notifications.
              </p>
            </div>
          </Tab>
          <Tab 
            id="profile" 
            label="Profile" 
            icon={<User className="w-4 h-4" />}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">User Profile</h3>
              <p className="text-gray-600">
                Manage your profile settings.
              </p>
            </div>
          </Tab>
          <Tab 
            id="settings" 
            label="Settings" 
            icon={<Settings className="w-4 h-4" />}
            badge={<Badge variant="primary" size="sm">New</Badge>}
          >
            <div className="p-4 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600">
                Configure application settings.
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
};

// Tab Variants
export const TabVariants: Story = {
  render: function Render() {
    const [activeTab1, setActiveTab1] = useState('default');
    const [activeTab2, setActiveTab2] = useState('pills');
    const [activeTab3, setActiveTab3] = useState('underline');
    const [activeTab4, setActiveTab4] = useState('enclosed');
    
    return (
      <div className="space-y-8 w-[600px]">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Default Variant</h3>
          <Tabs variant="default" activeTab={activeTab1} onChange={setActiveTab1}>
            <Tab id="default" label="Default Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Content for the default variant tab.</p>
              </Card>
            </Tab>
            <Tab id="default2" label="Another Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Another tab content for default variant.</p>
              </Card>
            </Tab>
          </Tabs>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Pills Variant</h3>
          <Tabs variant="pills" activeTab={activeTab2} onChange={setActiveTab2}>
            <Tab id="pills" label="Pills Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Content for the pills variant tab.</p>
              </Card>
            </Tab>
            <Tab id="pills2" label="Another Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Another tab content for pills variant.</p>
              </Card>
            </Tab>
          </Tabs>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Underline Variant</h3>
          <Tabs variant="underline" activeTab={activeTab3} onChange={setActiveTab3}>
            <Tab id="underline" label="Underline Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Content for the underline variant tab.</p>
              </Card>
            </Tab>
            <Tab id="underline2" label="Another Tab">
              <Card className="mt-2 p-4">
                <p className="text-gray-700">Another tab content for underline variant.</p>
              </Card>
            </Tab>
          </Tabs>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Enclosed Variant</h3>
          <Tabs variant="enclosed" activeTab={activeTab4} onChange={setActiveTab4}>
            <Tab id="enclosed" label="Enclosed Tab">
              <p className="text-gray-700">Content for the enclosed variant tab.</p>
            </Tab>
            <Tab id="enclosed2" label="Another Tab">
              <p className="text-gray-700">Another tab content for enclosed variant.</p>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  },
};

// Dashboard Tabs Example
export const DashboardTabs: Story = {
  render: function Render() {
    const [activeTab, setActiveTab] = useState('overview');
    
    return (
      <div className="w-[700px]">
        <Tabs variant="enclosed" activeTab={activeTab} onChange={setActiveTab}>
          <Tab 
            id="overview" 
            label="Overview" 
            icon={<BarChart className="w-4 h-4" />}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">Sales</h3>
                  <p className="text-3xl font-bold">€3,240</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">Orders</h3>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </Card>
              </div>
            </div>
          </Tab>
          <Tab 
            id="orders" 
            label="Orders" 
            icon={<Package className="w-4 h-4" />}
            badge={<Badge variant="primary" size="sm">New</Badge>}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #1234</p>
                      <p className="text-sm text-gray-500">2 items • €42.50</p>
                    </div>
                    <Badge variant="success" size="sm">Completed</Badge>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #1235</p>
                      <p className="text-sm text-gray-500">1 item • €18.90</p>
                    </div>
                    <Badge variant="warning" size="sm">Processing</Badge>
                  </div>
                </Card>
              </div>
            </div>
          </Tab>
          <Tab 
            id="customers" 
            label="Customers" 
            icon={<User className="w-4 h-4" />}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
              <p className="text-gray-600 mb-4">View and manage your customers.</p>
              <Button>View All Customers</Button>
            </div>
          </Tab>
          <Tab 
            id="settings" 
            label="Settings" 
            icon={<Settings className="w-4 h-4" />}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="Beach Bar Durrës"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="info@beachbar.al"
                  />
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
};