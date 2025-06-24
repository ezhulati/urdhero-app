import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Star,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useAnalytics } from '../../hooks/useAnalytics';

interface AnalyticsDashboardProps {
  restaurantId: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ restaurantId }) => {
  const { analytics, loading, formatCurrency, calculateGrowthRate, getInsightsByType } = useAnalytics(restaurantId);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'loyalty' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Të dhënat nuk janë të disponueshme
        </h3>
        <p className="text-gray-600">
          Nuk mund të ngarkojmë analytics për momentin.
        </p>
      </Card>
    );
  }

  const revenueGrowth = calculateGrowthRate(analytics.revenue.thisMonth, analytics.revenue.lastMonth);
  const customerGrowth = calculateGrowthRate(analytics.customers.newCustomers, 150); // Mock previous
  const orderGrowth = calculateGrowthRate(analytics.orders.totalOrders, 1520); // Mock previous

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Kuptimi i thellë i performancës së restorantit tuaj</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Sot</option>
            <option value="week">Kjo Javë</option>
            <option value="month">Ky Muaj</option>
            <option value="year">Ky Vit</option>
          </select>
          <Button 
            size="sm" 
            variant="outline"
            icon={<Calendar className="w-4 h-4" />}
            iconPosition="left"
          >
            Eksporto Raport
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant={revenueGrowth >= 0 ? 'success' : 'danger'} size="sm">
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.revenue.thisMonth)}
              </div>
              <div className="text-sm text-gray-600">Të ardhura këtë muaj</div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant={customerGrowth >= 0 ? 'success' : 'danger'} size="sm">
                {customerGrowth >= 0 ? '+' : ''}{customerGrowth.toFixed(1)}%
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {analytics.customers.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Klientë totalë</div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant={orderGrowth >= 0 ? 'success' : 'danger'} size="sm">
                {orderGrowth >= 0 ? '+' : ''}{orderGrowth.toFixed(1)}%
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {analytics.orders.totalOrders.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Porosi këtë muaj</div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <Badge variant="secondary" size="sm">
                Loyalty
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {analytics.loyalty.totalLoyaltyMembers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Anëtarë loyalty</div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Përmbledhje', icon: BarChart3 },
          { id: 'customers', label: 'Klientë', icon: Users },
          { id: 'loyalty', label: 'Loyalty', icon: Star },
          { id: 'insights', label: 'Insights', icon: Lightbulb }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Trendi i Të Ardhurave</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" size="sm">
                      ↗ +{revenueGrowth.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-blue-800 font-medium">Grafiku i Të Ardhurave</p>
                    <p className="text-blue-600 text-sm">30 ditët e fundit</p>
                  </div>
                </div>
              </Card>

              {/* Popular Items */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artikujt Më Popularë</h3>
                <div className="space-y-3">
                  {analytics.orders.popularItems.slice(0, 5).map((item, index) => (
                    <div key={item.itemId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.orderCount} porosi</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Peak Hours */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orët e Pikut</h3>
                <div className="space-y-3">
                  {analytics.orders.peakHours.map((hour) => (
                    <div key={hour.hour} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {hour.hour}:00 - {hour.hour + 1}:00
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(hour.orderCount / 200) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {hour.orderCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Segments */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Segmentet e Klientëve</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.segments.map((segment) => (
                    <div 
                      key={segment.id}
                      className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Klientë:</span>
                          <span className="font-medium">{segment.customerCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AOV:</span>
                          <span className="font-medium">{formatCurrency(segment.avgOrderValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rritje:</span>
                          <Badge 
                            variant={segment.growthRate >= 0 ? 'success' : 'danger'} 
                            size="sm"
                          >
                            {segment.growthRate >= 0 ? '+' : ''}{segment.growthRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Customer Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrikat e Klientëve</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Klientë të Rinj</span>
                    <span className="font-bold text-green-600">{analytics.customers.newCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Klientë që Kthehen</span>
                    <span className="font-bold text-blue-600">{analytics.customers.returningCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shkalla e Mbajtjes</span>
                    <span className="font-bold text-purple-600">{analytics.customers.retentionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CLV Mesatar</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(analytics.customers.customerLifetimeValue)}</span>
                  </div>
                </div>
              </Card>

              {/* Retention Rate */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shkalla e Mbajtjes</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {analytics.customers.retentionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">30 ditët e fundit</div>
                </div>
                <ProgressBar 
                  progress={analytics.customers.retentionRate} 
                  color="green"
                  className="mb-4"
                />
                <div className="text-sm text-gray-600 text-center">
                  Objektivi: 75% • Industria: 68%
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tier Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shpërndarja e Niveleve</h3>
                <div className="space-y-3">
                  {analytics.loyalty.tierDistribution.map((tier) => (
                    <div key={tier.tier} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{tier.tier}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{tier.count}</div>
                          <div className="text-xs text-gray-600">{tier.percentage.toFixed(1)}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(tier.avgSpent)}
                          </div>
                          <div className="text-xs text-gray-600">AOV</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Points Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktiviteti i Pikëve</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pikë të Dhëna</span>
                    <span className="font-bold text-green-600">
                      {analytics.loyalty.pointsIssued.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pikë të Përdorura</span>
                    <span className="font-bold text-blue-600">
                      {analytics.loyalty.pointsRedeemed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shkalla e Përdorimit</span>
                    <span className="font-bold text-purple-600">
                      {analytics.loyalty.redemptionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <ProgressBar 
                    progress={analytics.loyalty.redemptionRate} 
                    color="purple"
                    showPercentage
                  />
                </div>
              </Card>

              {/* Top Rewards */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shpërblimet Më Populare</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analytics.loyalty.topRewards.map((reward, index) => (
                    <div key={reward.rewardId} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{reward.name}</h4>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {reward.redemptions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reward.pointsCost} pikë
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Success Insights */}
              {getInsightsByType('success').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Suksese
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getInsightsByType('success').map((insight) => (
                      <Card key={insight.id} className="p-4 border-green-200 bg-green-50">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-900 mb-1">{insight.title}</h4>
                            <p className="text-sm text-green-800">{insight.description}</p>
                            {insight.metric && (
                              <div className="mt-2 flex items-center space-x-2">
                                <Badge variant="success" size="sm">
                                  {insight.trend === 'up' ? '↗' : insight.trend === 'down' ? '↘' : '→'} 
                                  {insight.metric}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunity Insights */}
              {getInsightsByType('opportunity').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                    Mundësi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getInsightsByType('opportunity').map((insight) => (
                      <Card key={insight.id} className="p-4 border-blue-200 bg-blue-50">
                        <div className="flex items-start space-x-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">{insight.title}</h4>
                            <p className="text-sm text-blue-800 mb-2">{insight.description}</p>
                            {insight.recommendation && (
                              <div className="text-sm text-blue-700 bg-blue-100 rounded-lg p-3">
                                <strong>Rekomandim:</strong> {insight.recommendation}
                              </div>
                            )}
                            {insight.metric && (
                              <div className="mt-2">
                                <Badge variant="primary" size="sm">
                                  {insight.metric}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Insights */}
              {getInsightsByType('warning').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    Paralajmërime
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getInsightsByType('warning').map((insight) => (
                      <Card key={insight.id} className="p-4 border-orange-200 bg-orange-50">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-orange-900 mb-1">{insight.title}</h4>
                            <p className="text-sm text-orange-800 mb-2">{insight.description}</p>
                            {insight.recommendation && (
                              <div className="text-sm text-orange-700 bg-orange-100 rounded-lg p-3">
                                <strong>Veprim i Rekomanduar:</strong> {insight.recommendation}
                              </div>
                            )}
                            {insight.actionRequired && (
                              <div className="mt-2">
                                <Badge variant="warning" size="sm">
                                  Kërkon Veprim
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};