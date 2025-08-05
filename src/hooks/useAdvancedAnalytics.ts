import { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export interface PredictiveInsight {
  id: string;
  type: 'revenue_forecast' | 'demand_prediction' | 'customer_churn' | 'inventory_optimization';
  title: string;
  description: string;
  prediction: any;
  confidence: number; // 0-100
  timeframe: string;
  actionable: boolean;
  recommendations: string[];
  impact: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface CustomerSegmentAnalysis {
  segmentId: string;
  name: string;
  description: string;
  customerCount: number;
  characteristics: {
    avgOrderValue: number;
    orderFrequency: number;
    preferredCategories: string[];
    peakOrderTimes: string[];
    loyaltyTier: string;
    churnRisk: number; // 0-100
  };
  growthOpportunities: string[];
  retentionStrategy: string[];
}

export interface AdvancedMetrics {
  customerLifetimeValue: {
    average: number;
    bySegment: Record<string, number>;
    projectedGrowth: number;
  };
  churnPrediction: {
    riskScore: number;
    atRiskCustomers: number;
    preventionActions: string[];
  };
  demandForecasting: {
    nextWeekPrediction: Record<string, number>;
    seasonalTrends: Array<{
      period: string;
      multiplier: number;
      confidence: number;
    }>;
  };
  marketBasketAnalysis: {
    popularCombinations: Array<{
      items: string[];
      frequency: number;
      avgValue: number;
    }>;
    upsellOpportunities: Array<{
      baseItem: string;
      suggestedItems: string[];
      conversionRate: number;
    }>;
  };
  competitiveIntelligence: {
    marketPosition: number; // 1-10 ranking
    strengthsVsCompetitors: string[];
    improvementAreas: string[];
    marketShareEstimate: number;
  };
}

export const useAdvancedAnalytics = (restaurantId: string) => {
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegmentAnalysis[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { analytics } = useAnalytics(restaurantId);

  useEffect(() => {
    if (analytics) {
      generateAdvancedInsights();
    }
  }, [analytics, restaurantId]);

  const generateAdvancedInsights = async () => {
    try {
      // Simulate AI/ML processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate predictive insights
      const insights: PredictiveInsight[] = [
        {
          id: 'revenue-forecast-001',
          type: 'revenue_forecast',
          title: 'Revenue Growth Prediction',
          description: 'Based on current trends, revenue is projected to increase by 18% next month',
          prediction: {
            nextMonthRevenue: analytics?.revenue.thisMonth ? analytics.revenue.thisMonth * 1.18 : 0,
            growthRate: 18,
            factors: ['Increasing customer retention', 'Higher average order value', 'New menu items performance']
          },
          confidence: 87,
          timeframe: 'Next 30 days',
          actionable: true,
          recommendations: [
            'Increase inventory for high-demand items',
            'Consider expanding popular menu categories',
            'Prepare for increased staffing needs'
          ],
          impact: 'high',
          createdAt: new Date()
        },
        {
          id: 'demand-prediction-001',
          type: 'demand_prediction',
          title: 'Weekend Demand Surge Expected',
          description: 'ML models predict 35% higher demand this weekend due to weather and local events',
          prediction: {
            expectedIncrease: 35,
            peakDay: 'Saturday',
            peakHours: ['19:00', '20:00', '21:00'],
            recommendedItems: ['Pizza Margherita', 'Aperol Spritz', 'Greek Salad']
          },
          confidence: 92,
          timeframe: 'This weekend',
          actionable: true,
          recommendations: [
            'Schedule additional kitchen staff for Saturday evening',
            'Increase inventory for predicted popular items',
            'Prepare table management for higher turnover'
          ],
          impact: 'high',
          createdAt: new Date()
        },
        {
          id: 'churn-prediction-001',
          type: 'customer_churn',
          title: 'Customer Retention Alert',
          description: '23 customers show signs of potential churn based on ordering patterns',
          prediction: {
            atRiskCustomers: 23,
            churnProbability: 68,
            commonFactors: ['Decreased order frequency', 'Lower satisfaction scores', 'No recent loyalty activity']
          },
          confidence: 76,
          timeframe: 'Next 14 days',
          actionable: true,
          recommendations: [
            'Send personalized re-engagement offers',
            'Reach out with customer satisfaction survey',
            'Offer loyalty point bonuses for next order'
          ],
          impact: 'medium',
          createdAt: new Date()
        }
      ];

      setPredictiveInsights(insights);

      // Generate customer segment analysis
      const segments: CustomerSegmentAnalysis[] = [
        {
          segmentId: 'high-value-regulars',
          name: 'High-Value Regular Customers',
          description: 'Frequent visitors with high spending patterns',
          customerCount: 89,
          characteristics: {
            avgOrderValue: 3450, // €34.50
            orderFrequency: 2.3, // per week
            preferredCategories: ['Seafood', 'Premium Drinks', 'Desserts'],
            peakOrderTimes: ['19:00', '20:00', '21:00'],
            loyaltyTier: 'Gold',
            churnRisk: 12
          },
          growthOpportunities: [
            'Introduce premium tasting menus',
            'Offer wine pairing suggestions',
            'Create VIP dining experiences'
          ],
          retentionStrategy: [
            'Personalized menu recommendations',
            'Priority table reservations',
            'Exclusive new dish previews'
          ]
        },
        {
          segmentId: 'weekend-social-groups',
          name: 'Weekend Social Groups',
          description: 'Groups of friends and families who visit mainly on weekends',
          customerCount: 156,
          characteristics: {
            avgOrderValue: 2890, // €28.90
            orderFrequency: 0.8, // per week
            preferredCategories: ['Pizza', 'Cocktails', 'Appetizers'],
            peakOrderTimes: ['18:00', '19:00', '22:00'],
            loyaltyTier: 'Silver',
            churnRisk: 28
          },
          growthOpportunities: [
            'Create group meal deals',
            'Offer party packages',
            'Implement group ordering features'
          ],
          retentionStrategy: [
            'Weekend-only special offers',
            'Group loyalty bonuses',
            'Social media engagement campaigns'
          ]
        },
        {
          segmentId: 'business-lunch-crowd',
          name: 'Business Lunch Customers',
          description: 'Professionals who order during lunch hours on weekdays',
          customerCount: 203,
          characteristics: {
            avgOrderValue: 1850, // €18.50
            orderFrequency: 3.1, // per week
            preferredCategories: ['Salads', 'Quick Meals', 'Coffee'],
            peakOrderTimes: ['12:00', '13:00', '13:30'],
            loyaltyTier: 'Bronze',
            churnRisk: 45
          },
          growthOpportunities: [
            'Express lunch menu',
            'Business lunch packages',
            'Corporate catering services'
          ],
          retentionStrategy: [
            'Lunch loyalty program',
            'Quick order features',
            'Business account benefits'
          ]
        }
      ];

      setCustomerSegments(segments);

      // Generate advanced metrics
      const metrics: AdvancedMetrics = {
        customerLifetimeValue: {
          average: 18750, // €187.50
          bySegment: {
            'high-value-regulars': 45800,
            'weekend-social-groups': 23400,
            'business-lunch-crowd': 12650
          },
          projectedGrowth: 23.5 // percentage
        },
        churnPrediction: {
          riskScore: 68,
          atRiskCustomers: 23,
          preventionActions: [
            'Personalized retention campaigns',
            'Satisfaction surveys',
            'Loyalty point bonuses'
          ]
        },
        demandForecasting: {
          nextWeekPrediction: {
            'Monday': 0.8,
            'Tuesday': 0.9,
            'Wednesday': 1.0,
            'Thursday': 1.1,
            'Friday': 1.4,
            'Saturday': 1.6,
            'Sunday': 1.2
          },
          seasonalTrends: [
            { period: 'Summer Peak', multiplier: 1.35, confidence: 94 },
            { period: 'Holiday Season', multiplier: 1.28, confidence: 91 },
            { period: 'Spring Growth', multiplier: 1.15, confidence: 88 }
          ]
        },
        marketBasketAnalysis: {
          popularCombinations: [
            {
              items: ['Pizza Margherita', 'Aperol Spritz'],
              frequency: 78,
              avgValue: 2050
            },
            {
              items: ['Greek Salad', 'White Wine'],
              frequency: 45,
              avgValue: 1750
            }
          ],
          upsellOpportunities: [
            {
              baseItem: 'Espresso Coffee',
              suggestedItems: ['Tiramisu', 'Biscotti'],
              conversionRate: 34
            }
          ]
        },
        competitiveIntelligence: {
          marketPosition: 8.7,
          strengthsVsCompetitors: [
            'Superior technology platform',
            'Better customer experience',
            'Real-time order tracking',
            'Comprehensive analytics'
          ],
          improvementAreas: [
            'Delivery speed optimization',
            'Menu variety expansion',
            'Corporate catering'
          ],
          marketShareEstimate: 12.4
        }
      };

      setAdvancedMetrics(metrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating advanced insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setLoading(true);
    await generateAdvancedInsights();
  };

  const getInsightsByType = (type: PredictiveInsight['type']) => {
    return predictiveInsights.filter(insight => insight.type === type);
  };

  const getHighImpactInsights = () => {
    return predictiveInsights.filter(insight => insight.impact === 'high');
  };

  const getActionableInsights = () => {
    return predictiveInsights.filter(insight => insight.actionable);
  };

  const getSegmentByValue = () => {
    return customerSegments.sort((a, b) => 
      (b.customerCount * b.characteristics.avgOrderValue) - 
      (a.customerCount * a.characteristics.avgOrderValue)
    );
  };

  const getHighRiskSegments = () => {
    return customerSegments.filter(segment => segment.characteristics.churnRisk > 40);
  };

  return {
    predictiveInsights,
    customerSegments,
    advancedMetrics,
    loading,
    lastUpdated,
    refreshInsights,
    getInsightsByType,
    getHighImpactInsights,
    getActionableInsights,
    getSegmentByValue,
    getHighRiskSegments
  };
};