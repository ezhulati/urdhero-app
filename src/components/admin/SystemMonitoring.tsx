import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  RefreshCw,
  Settings,
  Bell,
  TrendingUp,
  Zap,
  Globe,
  Lock,
  Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import toast from 'react-hot-toast';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number; // percentage
  responseTime: number; // ms
  lastIncident?: Date;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

export const SystemMonitoring: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.94,
    responseTime: 245,
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Frontend Application',
      status: 'operational',
      responseTime: 1200,
      uptime: 99.98,
      lastCheck: new Date()
    },
    {
      name: 'Firebase Auth',
      status: 'operational',
      responseTime: 180,
      uptime: 99.95,
      lastCheck: new Date()
    },
    {
      name: 'Firestore Database',
      status: 'operational',
      responseTime: 95,
      uptime: 99.99,
      lastCheck: new Date()
    },
    {
      name: 'Cloud Functions',
      status: 'operational',
      responseTime: 320,
      uptime: 99.91,
      lastCheck: new Date()
    },
    {
      name: 'Firebase Storage',
      status: 'operational',
      responseTime: 150,
      uptime: 99.97,
      lastCheck: new Date()
    },
    {
      name: 'Stripe Payments',
      status: 'operational',
      responseTime: 280,
      uptime: 99.93,
      lastCheck: new Date()
    }
  ]);

  const [metrics, setMetrics] = useState({
    totalUsers: 2847,
    activeNow: 156,
    ordersToday: 234,
    revenueToday: 567800, // €5,678
    errorRate: 0.08,
    avgResponseTime: 234
  });

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'performance',
      severity: 'warning',
      message: 'API response time increased by 15% in the last hour',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      type: 'security',
      severity: 'info',
      message: 'Security scan completed successfully - no vulnerabilities found',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = async () => {
    // Simulate metric updates
    setMetrics(prev => ({
      ...prev,
      activeNow: Math.floor(120 + Math.random() * 80),
      avgResponseTime: Math.floor(200 + Math.random() * 100),
      errorRate: Math.random() * 0.2
    }));

    // Randomly update service response times
    setServices(prev => prev.map(service => ({
      ...service,
      responseTime: Math.floor(service.responseTime * (0.8 + Math.random() * 0.4)),
      lastCheck: new Date()
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return 'success';
      case 'degraded':
      case 'warning':
        return 'warning';
      case 'down':
      case 'critical':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'primary';
      default: return 'neutral';
    }
  };

  const formatUptime = (uptime: number) => `${uptime.toFixed(2)}%`;

  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
            <p className="text-gray-600 text-sm">
              Real-time platform health and performance monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            variant={getStatusColor(systemHealth.status) as any}
            size="sm"
            className="px-3 py-1"
          >
            {systemHealth.status.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={updateMetrics}
            icon={<RefreshCw className="w-4 h-4" />}
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Server className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatUptime(systemHealth.uptime)}
          </div>
          <div className="text-sm text-gray-600">System Uptime</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </Card>

        <Card className="p-6 text-center">
          <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {systemHealth.responseTime}ms
          </div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
          <div className="text-xs text-gray-500 mt-1">Last hour</div>
        </Card>

        <Card className="p-6 text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {metrics.activeNow.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
          <div className="text-xs text-gray-500 mt-1">Right now</div>
        </Card>

        <Card className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {alerts.filter(a => !a.resolved).length}
          </div>
          <div className="text-sm text-gray-600">Active Alerts</div>
          <div className="text-xs text-gray-500 mt-1">Needs attention</div>
        </Card>
      </div>

      {/* Service Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Status</h3>
        
        <div className="space-y-4">
          {services.map(service => (
            <motion.div
              key={service.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <Badge variant={getStatusColor(service.status) as any} size="sm">
                  {service.status}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-medium">{service.responseTime}ms</div>
                  <div className="text-xs">Response</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{formatUptime(service.uptime)}</div>
                  <div className="text-xs">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {Math.floor((Date.now() - service.lastCheck.getTime()) / 1000)}s
                  </div>
                  <div className="text-xs">Last Check</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-time Metrics</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="font-medium text-gray-900">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <ProgressBar 
                progress={metrics.errorRate * 50} 
                color={metrics.errorRate < 0.1 ? 'green' : metrics.errorRate < 0.5 ? 'orange' : 'red'} 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: &lt;0.1%</span>
                <span>Industry: 0.3%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="font-medium text-gray-900">{metrics.avgResponseTime}ms</span>
              </div>
              <ProgressBar 
                progress={Math.min((500 - metrics.avgResponseTime) / 500 * 100, 100)} 
                color={metrics.avgResponseTime < 300 ? 'green' : metrics.avgResponseTime < 500 ? 'orange' : 'red'} 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: &lt;300ms</span>
                <span>Limit: 500ms</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{metrics.ordersToday}</div>
                <div className="text-sm text-gray-600">Orders Today</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{formatCurrency(metrics.revenueToday)}</div>
                <div className="text-sm text-gray-600">Revenue Today</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <Badge variant="primary" size="sm">
              {alerts.filter(a => !a.resolved).length} Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">All Systems Operational</h4>
                <p className="text-sm text-gray-600">No active alerts or issues detected</p>
              </div>
            ) : (
              alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    alert.resolved 
                      ? 'border-gray-200 bg-gray-50' 
                      : alert.severity === 'critical' 
                        ? 'border-red-300 bg-red-50'
                        : alert.severity === 'warning'
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      alert.resolved ? 'bg-gray-600' : 
                      alert.severity === 'critical' ? 'bg-red-600' :
                      alert.severity === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}>
                      {alert.resolved ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getSeverityColor(alert.severity) as any} size="sm">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)}m ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{alert.message}</p>
                    </div>
                    
                    {!alert.resolved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAlerts(prev => prev.map(a => 
                            a.id === alert.id ? { ...a, resolved: true } : a
                          ));
                          toast.success('Alert marked as resolved');
                        }}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Performance Charts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-1" />
              Last 24h
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Response Time Trend</h4>
            <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 font-medium">Response Time Chart</p>
                <p className="text-blue-600 text-sm">Average: {systemHealth.responseTime}ms</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">User Activity</h4>
            <div className="h-40 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <p className="text-purple-800 font-medium">User Activity Chart</p>
                <p className="text-purple-600 text-sm">{metrics.activeNow} active now</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Security Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="font-semibold text-green-900 mb-1">SSL Certificate</div>
            <div className="text-sm text-green-800">Valid & Secure</div>
            <Badge variant="success" size="sm" className="mt-2">Valid until Dec 2025</Badge>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="font-semibold text-blue-900 mb-1">Data Encryption</div>
            <div className="text-sm text-blue-800">AES-256 Enabled</div>
            <Badge variant="primary" size="sm" className="mt-2">Compliant</Badge>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="font-semibold text-purple-900 mb-1">GDPR Compliance</div>
            <div className="text-sm text-purple-800">Fully Compliant</div>
            <Badge variant="secondary" size="sm" className="mt-2">Verified</Badge>
          </div>
        </div>
      </Card>

      {/* Infrastructure Health */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Infrastructure Health</h3>
        
        <div className="space-y-4">
          {[
            { name: 'CPU Usage', value: 23, unit: '%', threshold: 80, status: 'good' },
            { name: 'Memory Usage', value: 67, unit: '%', threshold: 85, status: 'good' },
            { name: 'Disk Usage', value: 45, unit: '%', threshold: 90, status: 'good' },
            { name: 'Network I/O', value: 34, unit: 'MB/s', threshold: 100, status: 'good' },
            { name: 'Database Connections', value: 12, unit: '', threshold: 100, status: 'good' },
            { name: 'Queue Depth', value: 3, unit: 'jobs', threshold: 50, status: 'good' }
          ].map(metric => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{metric.name}</span>
                <span className="font-medium text-gray-900">
                  {metric.value}{metric.unit}
                </span>
              </div>
              <ProgressBar 
                progress={(metric.value / metric.threshold) * 100} 
                color={metric.value / metric.threshold < 0.7 ? 'green' : metric.value / metric.threshold < 0.9 ? 'orange' : 'red'} 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Threshold: {metric.threshold}{metric.unit}</span>
                <span>{((metric.value / metric.threshold) * 100).toFixed(1)}% of limit</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};