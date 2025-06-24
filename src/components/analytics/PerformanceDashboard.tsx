import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  BarChart, 
  LineChart,
  Users,
  ShoppingBag,
  MousePointer,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Laptop,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { usePerformance } from '../../hooks/usePerformance';

interface PerformanceDashboardProps {
  venueId: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ venueId }) => {
  const { metrics, loading, formatTime, getScore, getOverallScore, getScoreColor } = usePerformance(venueId);

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Loading performance metrics...
        </h3>
        <p className="text-gray-600">
          We're gathering data about your application performance
        </p>
      </Card>
    );
  }

  const overallScore = getOverallScore();
  const overallColor = getScoreColor(overallScore);

  const lcpScore = getScore('lcp') || 0;
  const fidScore = getScore('fid') || 0;
  const clsScore = getScore('cls') || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          <p className="text-gray-600 text-sm">
            Monitor your application's performance and user experience
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          icon={<RefreshCw className="w-4 h-4" />}
          iconPosition="left"
        >
          Refresh
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
              overallColor === 'green' ? 'border-green-500 text-green-600' : 
              overallColor === 'orange' ? 'border-orange-500 text-orange-600' : 
              'border-red-500 text-red-600'
            }`}>
              <span className="text-2xl font-bold">{Math.round(overallScore)}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Overall Performance
              </h3>
              <p className="text-sm text-gray-600">
                Based on Web Vitals and business metrics
              </p>
              <div className="mt-2 flex items-center space-x-2">
                {overallScore >= 90 ? (
                  <Badge variant="success" size="sm">Excellent</Badge>
                ) : overallScore >= 70 ? (
                  <Badge variant="success" size="sm">Good</Badge>
                ) : overallScore >= 50 ? (
                  <Badge variant="warning" size="sm">Needs Improvement</Badge>
                ) : (
                  <Badge variant="danger" size="sm">Poor</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                lcpScore >= 90 ? 'text-green-600' : 
                lcpScore >= 60 ? 'text-orange-600' : 
                'text-red-600'
              }`}>
                {Math.round(lcpScore)}
              </div>
              <div className="text-xs text-gray-600">LCP Score</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${
                fidScore >= 90 ? 'text-green-600' : 
                fidScore >= 60 ? 'text-orange-600' : 
                'text-red-600'
              }`}>
                {Math.round(fidScore)}
              </div>
              <div className="text-xs text-gray-600">FID Score</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${
                clsScore >= 90 ? 'text-green-600' : 
                clsScore >= 60 ? 'text-orange-600' : 
                'text-red-600'
              }`}>
                {Math.round(clsScore)}
              </div>
              <div className="text-xs text-gray-600">CLS Score</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LCP */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Largest Contentful Paint
            </h3>
            {lcpScore >= 90 ? (
              <Badge variant="success" size="sm">Fast</Badge>
            ) : lcpScore >= 60 ? (
              <Badge variant="warning" size="sm">Moderate</Badge>
            ) : (
              <Badge variant="danger" size="sm">Slow</Badge>
            )}
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900">
              {formatTime(metrics.lcp)}
            </div>
            <div className="text-sm text-gray-600">Loading Speed</div>
          </div>
          
          <ProgressBar
            progress={lcpScore}
            color={getScoreColor(lcpScore) as 'green' | 'blue' | 'red' | 'orange'}
            className="mb-2"
          />
          
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Good: &lt; 2.5s</span>
              <span>Poor: &gt; 4.0s</span>
            </div>
            <p>
              LCP measures when the largest content element becomes visible.
            </p>
          </div>
        </Card>

        {/* FID */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <MousePointer className="w-5 h-5 mr-2 text-purple-600" />
              First Input Delay
            </h3>
            {fidScore >= 90 ? (
              <Badge variant="success" size="sm">Responsive</Badge>
            ) : fidScore >= 60 ? (
              <Badge variant="warning" size="sm">Moderate</Badge>
            ) : (
              <Badge variant="danger" size="sm">Sluggish</Badge>
            )}
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900">
              {formatTime(metrics.fid)}
            </div>
            <div className="text-sm text-gray-600">Interactivity</div>
          </div>
          
          <ProgressBar
            progress={fidScore}
            color={getScoreColor(fidScore) as 'green' | 'blue' | 'red' | 'orange'}
            className="mb-2"
          />
          
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Good: &lt; 100ms</span>
              <span>Poor: &gt; 300ms</span>
            </div>
            <p>
              FID measures the time from when a user first interacts with your app to when the browser can respond.
            </p>
          </div>
        </Card>

        {/* CLS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-green-600" />
              Cumulative Layout Shift
            </h3>
            {clsScore >= 90 ? (
              <Badge variant="success" size="sm">Stable</Badge>
            ) : clsScore >= 60 ? (
              <Badge variant="warning" size="sm">Moderate</Badge>
            ) : (
              <Badge variant="danger" size="sm">Unstable</Badge>
            )}
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900">
              {metrics.cls?.toFixed(3) || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Visual Stability</div>
          </div>
          
          <ProgressBar
            progress={clsScore}
            color={getScoreColor(clsScore) as 'green' | 'blue' | 'red' | 'orange'}
            className="mb-2"
          />
          
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Good: &lt; 0.1</span>
              <span>Poor: &gt; 0.25</span>
            </div>
            <p>
              CLS measures how much content shifts during page load.
            </p>
          </div>
        </Card>
      </div>

      {/* Business Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-blue-600" />
          Business Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="text-gray-600 text-sm">Order Conversion Rate</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">4.8%</span>
              <Badge variant="success" size="sm">+0.3%</Badge>
            </div>
            <div className="text-xs text-gray-500">Industry avg: 3.2%</div>
            <ProgressBar progress={75} color="blue" size="sm" className="mt-2" />
          </div>
          
          <div className="space-y-1">
            <div className="text-gray-600 text-sm">Cart Abandonment</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">22%</span>
              <Badge variant="success" size="sm">-3.1%</Badge>
            </div>
            <div className="text-xs text-gray-500">Industry avg: 30%</div>
            <ProgressBar progress={78} color="green" size="sm" className="mt-2" />
          </div>
          
          <div className="space-y-1">
            <div className="text-gray-600 text-sm">Avg. Session Duration</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">3:42</span>
              <Badge variant="success" size="sm">+0:18</Badge>
            </div>
            <div className="text-xs text-gray-500">Industry avg: 2:30</div>
            <ProgressBar progress={82} color="purple" size="sm" className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Device Performance */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
          Performance by Device Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="font-medium text-gray-900">Mobile</h4>
              </div>
              <Badge variant="secondary" size="sm">
                72% of Traffic
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">LCP</span>
                <span className="font-medium text-gray-900">2.8s</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">FID</span>
                <span className="font-medium text-gray-900">98ms</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">CLS</span>
                <span className="font-medium text-gray-900">0.14</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-bold text-orange-600">78</span>
              </div>
              <ProgressBar progress={78} color="orange" size="sm" className="mt-2" />
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Laptop className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="font-medium text-gray-900">Desktop</h4>
              </div>
              <Badge variant="secondary" size="sm">
                28% of Traffic
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">LCP</span>
                <span className="font-medium text-gray-900">1.5s</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">FID</span>
                <span className="font-medium text-gray-900">35ms</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">CLS</span>
                <span className="font-medium text-gray-900">0.05</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-bold text-green-600">94</span>
              </div>
              <ProgressBar progress={94} color="green" size="sm" className="mt-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Performance Recommendations</h3>
        
        <div className="space-y-4">
          {lcpScore < 90 && (
            <motion.div 
              className="p-4 rounded-lg bg-blue-50 border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Improve Loading Performance</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Your LCP score indicates that your largest content elements may be loading slowly.
                  </p>
                  <div className="text-sm font-medium text-blue-900 mb-1">Recommendations:</div>
                  <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
                    <li>Optimize and compress images</li>
                    <li>Implement lazy loading for off-screen images</li>
                    <li>Preload critical resources</li>
                    <li>Consider using a content delivery network (CDN)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          {fidScore < 90 && (
            <motion.div 
              className="p-4 rounded-lg bg-purple-50 border border-purple-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Improve Interactivity</h4>
                  <p className="text-sm text-purple-800 mb-3">
                    Your FID score indicates that your app may be slow to respond to user interactions.
                  </p>
                  <div className="text-sm font-medium text-purple-900 mb-1">Recommendations:</div>
                  <ul className="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Minimize long tasks that block the main thread</li>
                    <li>Break up long JavaScript tasks</li>
                    <li>Optimize event handlers</li>
                    <li>Reduce JavaScript execution time</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          {clsScore < 90 && (
            <motion.div 
              className="p-4 rounded-lg bg-green-50 border border-green-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Improve Visual Stability</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Your CLS score indicates that elements on your page may be shifting as it loads.
                  </p>
                  <div className="text-sm font-medium text-green-900 mb-1">Recommendations:</div>
                  <ul className="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Set explicit dimensions for images and embedded elements</li>
                    <li>Reserve space for dynamic content</li>
                    <li>Avoid inserting content above existing content</li>
                    <li>Minimize layout shifts from animations</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          {overallScore >= 90 && (
            <motion.div 
              className="p-4 rounded-lg bg-green-50 border border-green-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Great Performance!</h4>
                  <p className="text-sm text-green-800">
                    Your app is performing well across all key metrics. Continue monitoring to maintain this high standard.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};