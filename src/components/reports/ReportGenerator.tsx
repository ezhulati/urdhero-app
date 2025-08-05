import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  Star,
  Mail,
  Settings
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { useAnalytics } from '../../hooks/useAnalytics';
import toast from 'react-hot-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'financial' | 'operational' | 'customer' | 'inventory';
  format: 'pdf' | 'excel' | 'csv';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  metrics: string[];
}

export const ReportGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);

  const { analytics, formatCurrency } = useAnalytics('demo-restaurant');

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview of all key business metrics',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'financial',
      format: 'pdf',
      frequency: 'monthly',
      metrics: ['Revenue', 'Orders', 'Customers', 'Growth Rate', 'Profit Margins']
    },
    {
      id: 'financial-performance',
      name: 'Financial Performance',
      description: 'Detailed revenue, costs, and profitability analysis',
      icon: <DollarSign className="w-5 h-5" />,
      category: 'financial',
      format: 'excel',
      frequency: 'monthly',
      metrics: ['Revenue by Category', 'Cost Analysis', 'Profit Margins', 'Tax Reports']
    },
    {
      id: 'customer-analytics',
      name: 'Customer Analytics',
      description: 'Customer behavior, retention, and satisfaction metrics',
      icon: <Users className="w-5 h-5" />,
      category: 'customer',
      format: 'pdf',
      frequency: 'weekly',
      metrics: ['Customer Acquisition', 'Retention Rate', 'Lifetime Value', 'Satisfaction Score']
    },
    {
      id: 'operational-efficiency',
      name: 'Operational Efficiency',
      description: 'Kitchen performance, staff productivity, and order metrics',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'operational',
      format: 'excel',
      frequency: 'weekly',
      metrics: ['Order Times', 'Staff Performance', 'Table Turnover', 'Error Rates']
    },
    {
      id: 'loyalty-program',
      name: 'Loyalty Program Report',
      description: 'Loyalty member activity, points, and redemption analysis',
      icon: <Star className="w-5 h-5" />,
      category: 'customer',
      format: 'pdf',
      frequency: 'monthly',
      metrics: ['Member Growth', 'Points Activity', 'Redemption Rates', 'Tier Distribution']
    },
    {
      id: 'daily-operations',
      name: 'Daily Operations',
      description: 'Daily summary of orders, revenue, and key operational metrics',
      icon: <Clock className="w-5 h-5" />,
      category: 'operational',
      format: 'csv',
      frequency: 'daily',
      metrics: ['Daily Revenue', 'Order Count', 'Average Order Value', 'Peak Hours']
    },
    {
      id: 'menu-performance',
      name: 'Menu Performance',
      description: 'Item popularity, profitability, and optimization recommendations',
      icon: <PieChart className="w-5 h-5" />,
      category: 'operational',
      format: 'excel',
      frequency: 'monthly',
      metrics: ['Item Popularity', 'Revenue by Item', 'Profit Margins', 'Inventory Turnover']
    },
    {
      id: 'tax-compliance',
      name: 'Tax Compliance Report',
      description: 'Tax-ready financial data for Albanian regulations',
      icon: <FileText className="w-5 h-5" />,
      category: 'financial',
      format: 'excel',
      frequency: 'monthly',
      metrics: ['VAT Summary', 'Income Statement', 'Transaction Details', 'Audit Trail']
    }
  ];

  const categoryColors = {
    financial: 'green',
    operational: 'blue',
    customer: 'purple',
    inventory: 'orange'
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a report template');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      const filename = `${template?.name.replace(/\s+/g, '_')}_${dateRange.from}_to_${dateRange.to}.${format}`;
      
      // In a real implementation, this would generate and download the actual report
      toast.success(`Report "${template?.name}" generated successfully!`);
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#'; // Would be actual file URL
      link.download = filename;
      link.click();
      
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const scheduleReport = async (templateId: string, frequency: string) => {
    try {
      const template = reportTemplates.find(t => t.id === templateId);
      if (!template) return;

      await new Promise(resolve => setTimeout(resolve, 500));

      const newSchedule = {
        id: Date.now().toString(),
        templateId,
        templateName: template.name,
        frequency,
        format: template.format,
        nextRunDate: getNextRunDate(frequency),
        isActive: true,
        createdAt: new Date()
      };

      setScheduledReports(prev => [...prev, newSchedule]);
      toast.success(`Scheduled ${template.name} to run ${frequency}`);
    } catch (error) {
      toast.error('Failed to schedule report');
    }
  };

  const getNextRunDate = (frequency: string): Date => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      case 'quarterly':
        const nextQuarter = new Date(now);
        nextQuarter.setMonth(nextQuarter.getMonth() + 3);
        return nextQuarter;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Reporting</h2>
          <p className="text-gray-600 text-sm">
            Generate comprehensive business reports and schedule automated delivery
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Settings className="w-4 h-4" />}
          iconPosition="left"
        >
          Report Settings
        </Button>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(analytics.revenue.thisMonth)}
            </div>
            <div className="text-sm text-gray-600">This Month Revenue</div>
          </Card>

          <Card className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {analytics.orders.totalOrders}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </Card>

          <Card className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {analytics.customers.totalCustomers}
            </div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </Card>

          <Card className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {analytics.loyalty.totalLoyaltyMembers}
            </div>
            <div className="text-sm text-gray-600">Loyalty Members</div>
          </Card>
        </div>
      )}

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Report */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate Report</h3>
          
          <div className="space-y-4">
            <Select
              label="Report Template"
              options={[
                { value: '', label: 'Select a report template' },
                ...reportTemplates.map(template => ({
                  value: template.id,
                  label: template.name,
                  icon: template.icon
                }))
              ]}
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              required
            />

            {selectedTemplate && (() => {
              const template = reportTemplates.find(t => t.id === selectedTemplate);
              return template ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-${categoryColors[template.category]}-100 rounded-lg flex items-center justify-center`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.metrics.map(metric => (
                          <Badge key={metric} variant="neutral" size="sm">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })()}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Select
              label="Output Format"
              options={[
                { value: 'pdf', label: 'PDF Report', icon: <FileText className="w-4 h-4" /> },
                { value: 'excel', label: 'Excel Spreadsheet', icon: <BarChart3 className="w-4 h-4" /> },
                { value: 'csv', label: 'CSV Data', icon: <Download className="w-4 h-4" /> }
              ]}
              value={format}
              onChange={(value) => setFormat(value as any)}
            />

            <Button
              onClick={handleGenerateReport}
              loading={isGenerating}
              className="w-full"
              size="lg"
              icon={<Download className="w-5 h-5" />}
              iconPosition="left"
              disabled={!selectedTemplate}
            >
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </div>
        </Card>

        {/* Scheduled Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
            <Badge variant="primary" size="sm">
              {scheduledReports.filter(r => r.isActive).length} Active
            </Badge>
          </div>

          {scheduledReports.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">No Scheduled Reports</h4>
              <p className="text-sm text-gray-600 mb-4">
                Set up automatic report generation and delivery
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedTemplate) {
                    scheduleReport(selectedTemplate, 'monthly');
                  } else {
                    toast.error('Select a template first');
                  }
                }}
                disabled={!selectedTemplate}
              >
                Schedule Selected Report
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{report.templateName}</div>
                    <div className="text-sm text-gray-600">
                      {report.frequency} • Next: {report.nextRunDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={report.isActive ? 'success' : 'neutral'} 
                      size="sm"
                    >
                      {report.isActive ? 'Active' : 'Paused'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Report Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map(template => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-10 h-10 bg-${categoryColors[template.category]}-100 rounded-lg flex items-center justify-center`}>
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <Badge 
                      variant={categoryColors[template.category] as any} 
                      size="sm"
                    >
                      {template.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium text-gray-900 uppercase">{template.format}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium text-gray-900">{template.frequency}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        scheduleReport(template.id, template.frequency);
                      }}
                      className="text-xs"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template.id);
                        handleGenerateReport();
                      }}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Report Delivery Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Delivery Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Email Delivery</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">Send reports via email</span>
              </div>
              <div className="pl-6">
                <input
                  type="email"
                  placeholder="admin@restaurant.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center space-x-3 pl-6">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">CC to manager</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Delivery Schedule</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">Automatic delivery</span>
              </div>
              <div className="pl-6">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pl-6">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">Weekend delivery</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h3>
        
        <div className="space-y-3">
          {[
            {
              name: 'Monthly Financial Report',
              generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              format: 'PDF',
              size: '2.4 MB',
              status: 'Delivered'
            },
            {
              name: 'Weekly Operations Summary',
              generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              format: 'Excel',
              size: '1.8 MB',
              status: 'Downloaded'
            },
            {
              name: 'Customer Analytics Report',
              generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              format: 'PDF',
              size: '3.1 MB',
              status: 'Delivered'
            }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">
                    {report.generatedAt.toLocaleDateString()} • {report.format} • {report.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" size="sm">{report.status}</Badge>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};