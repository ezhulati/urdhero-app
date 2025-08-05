import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  Zap,
  Star,
  ShoppingBag
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useAdvancedAnalytics } from '../../hooks/useAdvancedAnalytics';

interface PredictiveAnalyticsProps {
  restaurantId: string;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ restaurantId }) => {
  const {
    predictiveInsights,
    customerSegments,
    advancedMetrics,
    loading,
    lastUpdated,
    refreshInsights,
    getHighImpactInsights,
    getActionableInsights,
    getSegmentByValue,
    getHighRiskSegments
  } = useAdvancedAnalytics(restaurantId);

  const [activeTab, setActiveTab] = useState<'predictions' | 'segments' | 'market' | 'recommendations'>('predictions');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_forecast': return <DollarSign className="w-5 h-5" />;
      case 'demand_prediction': return <TrendingUp className="w-5 h-5" />;
      case 'customer_churn': return <Users className="w-5 h-5" />;
      case 'inventory_optimization': return <BarChart3 className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'primary';
    if (confidence >= 60) return 'warning';
    return 'danger';
  };

  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🤖 AI is analyzing your data...
        </h3>
        <p className="text-gray-600">
          Generating predictive insights and recommendations
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI-Powered Analytics</h1>
            <p className="text-gray-600 text-sm">
              Predictive insights and advanced customer intelligence
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshInsights}
            loading={loading}
            icon={<RefreshCw className="w-4 h-4" />}
            iconPosition="left"
          >
            Refresh AI
          </Button>
        </div>
      </div>

      {/* Quick AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getHighImpactInsights().slice(0, 3).map(insight => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-purple-900">{insight.title}</h4>
                    <Badge variant={getConfidenceColor(insight.confidence) as any} size="sm">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-800 mb-2">{insight.description}</p>
                  <div className="text-xs text-purple-700">
                    🎯 {insight.timeframe}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'predictions', label: 'AI Predictions', icon: Brain },
          { id: 'segments', label: 'Customer Intelligence', icon: Users },
          { id: 'market', label: 'Market Analysis', icon: Target },
          { id: 'recommendations', label: 'Smart Actions', icon: Lightbulb }
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
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              {/* Revenue Forecast */}
              {advancedMetrics && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Revenue Forecast
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(advancedMetrics.customerLifetimeValue.average)}
                      </div>
                      <div className="text-sm text-gray-600">Average CLV</div>
                      <Badge variant="success" size="sm" className="mt-2">
                        +{advancedMetrics.customerLifetimeValue.projectedGrowth}% growth
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Next Week Demand</h4>
                      {Object.entries(advancedMetrics.demandForecasting.nextWeekPrediction).map(([day, multiplier]) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day}</span>
                          <div className="flex items-center space-x-2">
                            <ProgressBar 
                              progress={multiplier * 60} 
                              color="blue" 
                              size="sm" 
                              className="w-16"
                            />
                            <span className="text-sm font-medium">{(multiplier * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Churn Risk Analysis</h4>
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {advancedMetrics.churnPrediction.atRiskCustomers}
                        </div>
                        <div className="text-sm text-red-800">Customers at risk</div>
                        <div className="text-xs text-red-600 mt-1">
                          {advancedMetrics.churnPrediction.riskScore}% risk score
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* All Predictions */}
              <div className="space-y-4">
                {predictiveInsights.map(insight => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <Badge variant={getConfidenceColor(insight.confidence) as any} size="sm">
                                {insight.confidence}% confidence
                              </Badge>
                              <Badge variant="secondary" size="sm">
                                {insight.timeframe}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{insight.description}</p>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={
                            insight.impact === 'high' ? 'danger' :
                            insight.impact === 'medium' ? 'warning' : 'primary'
                          } 
                          size="sm"
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>

                      {insight.recommendations.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">🤖 AI Recommendations:</h5>
                          <ul className="space-y-1">
                            {insight.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-blue-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'segments' && (
            <div className="space-y-6">
              {/* Segment Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerSegments.map(segment => (
                  <motion.div
                    key={segment.segmentId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                            <p className="text-sm text-gray-600">{segment.customerCount} customers</p>
                          </div>
                        </div>
                        <Badge 
                          variant={segment.characteristics.churnRisk > 40 ? 'warning' : 'success'} 
                          size="sm"
                        >
                          {segment.characteristics.churnRisk}% churn risk
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{segment.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Order Value:</span>
                          <span className="font-medium">{formatCurrency(segment.characteristics.avgOrderValue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Order Frequency:</span>
                          <span className="font-medium">{segment.characteristics.orderFrequency}/week</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Loyalty Tier:</span>
                          <Badge variant="secondary" size="sm">{segment.characteristics.loyaltyTier}</Badge>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Top Categories:</h5>
                        <div className="flex flex-wrap gap-1">
                          {segment.characteristics.preferredCategories.slice(0, 3).map(category => (
                            <Badge key={category} variant="neutral" size="sm">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Segment Recommendations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Segment-Specific Strategies</h3>
                
                <div className="space-y-6">
                  {customerSegments.map(segment => (
                    <div key={segment.segmentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">{segment.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{segment.customerCount} customers</span>
                          <Badge variant="primary" size="sm">
                            {formatCurrency(segment.customerCount * segment.characteristics.avgOrderValue)} potential
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-900 mb-2">🚀 Growth Opportunities:</h5>
                          <ul className="space-y-1">
                            {segment.growthOpportunities.map((opp, index) => (
                              <li key={index} className="text-sm text-green-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{opp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">🎯 Retention Strategy:</h5>
                          <ul className="space-y-1">
                            {segment.retentionStrategy.map((strategy, index) => (
                              <li key={index} className="text-sm text-blue-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'market' && advancedMetrics && (
            <div className="space-y-6">
              {/* Market Position */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Intelligence</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      #{Math.round(advancedMetrics.competitiveIntelligence.marketPosition)}
                    </div>
                    <div className="text-sm text-gray-600">Market Position</div>
                    <Badge variant="primary" size="sm" className="mt-2">
                      Top {Math.round(10 - advancedMetrics.competitiveIntelligence.marketPosition)} in Albania
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {advancedMetrics.competitiveIntelligence.marketShareEstimate}%
                    </div>
                    <div className="text-sm text-gray-600">Market Share</div>
                    <Badge variant="success" size="sm" className="mt-2">
                      Growing
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      +{advancedMetrics.customerLifetimeValue.projectedGrowth}%
                    </div>
                    <div className="text-sm text-gray-600">Projected Growth</div>
                    <Badge variant="gradient" size="sm" className="mt-2">
                      Above Industry
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Competitive Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold text-green-900 mb-4">🏆 Competitive Strengths</h4>
                  <div className="space-y-3">
                    {advancedMetrics.competitiveIntelligence.strengthsVsCompetitors.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-800">{strength}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-orange-900 mb-4">📈 Improvement Opportunities</h4>
                  <div className="space-y-3">
                    {advancedMetrics.competitiveIntelligence.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                        <Target className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-orange-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Market Basket Analysis */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Basket Intelligence</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Popular Combinations</h4>
                    <div className="space-y-3">
                      {advancedMetrics.marketBasketAnalysis.popularCombinations.map((combo, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900">
                              {combo.items.join(' + ')}
                            </div>
                            <Badge variant="primary" size="sm">
                              {combo.frequency}x ordered
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Average value: {formatCurrency(combo.avgValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Upselling Opportunities</h4>
                    <div className="space-y-3">
                      {advancedMetrics.marketBasketAnalysis.upsellOpportunities.map((upsell, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-medium text-blue-900 mb-1">
                            When customers order: {upsell.baseItem}
                          </div>
                          <div className="text-sm text-blue-800 mb-2">
                            Suggest: {upsell.suggestedItems.join(', ')}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">Success rate:</span>
                            <Badge variant="primary" size="sm">{upsell.conversionRate}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  AI-Powered Action Items
                </h3>
                
                <div className="space-y-4">
                  {getActionableInsights().map(insight => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-4 h-4 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-900">{insight.title}</h4>
                            <Badge variant="warning" size="sm">Action Required</Badge>
                          </div>
                          <p className="text-sm text-yellow-800 mb-3">{insight.description}</p>
                          
                          <div className="space-y-2">
                            {insight.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                                <span className="text-sm text-yellow-800">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                        >
                          Take Action
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Implementation Tracking */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Implementation Tracker</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      action: 'Implement weekend promotion for social groups',
                      status: 'In Progress',
                      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                      impact: 'High',
                      progress: 65
                    },
                    {
                      action: 'Add express lunch menu for business customers',
                      status: 'Planning',
                      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                      impact: 'Medium',
                      progress: 25
                    },
                    {
                      action: 'Launch loyalty tier upgrade campaign',
                      status: 'Completed',
                      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                      impact: 'High',
                      progress: 100
                    }
                  ].map((task, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.action}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span>Due: {task.dueDate.toLocaleDateString()}</span>
                            <Badge 
                              variant={
                                task.impact === 'High' ? 'danger' :
                                task.impact === 'Medium' ? 'warning' : 'primary'
                              } 
                              size="sm"
                            >
                              {task.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            task.status === 'Completed' ? 'success' :
                            task.status === 'In Progress' ? 'primary' : 'neutral'
                          } 
                          size="sm"
                        >
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <ProgressBar 
                          progress={task.progress} 
                          color={task.progress === 100 ? 'green' : 'blue'} 
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};