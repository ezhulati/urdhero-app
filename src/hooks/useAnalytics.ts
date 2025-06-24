import { useState, useEffect } from 'react';
import { RestaurantAnalytics, CustomerSegment, PerformanceInsight } from '../types/analytics';
import { LoyaltyTier } from '../types/loyalty';

export const useAnalytics = (restaurantId: string, dateRange?: { from: Date; to: Date }) => {
  const [analytics, setAnalytics] = useState<RestaurantAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [restaurantId, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate mock analytics data that would come from your backend
      const mockAnalytics: RestaurantAnalytics = {
        restaurantId,
        dateRange: dateRange || {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          to: new Date()
        },
        revenue: {
          today: 145000, // €1,450
          yesterday: 132000, // €1,320
          thisWeek: 890000, // €8,900
          lastWeek: 825000, // €8,250
          thisMonth: 3250000, // €32,500
          lastMonth: 2980000, // €29,800
          thisYear: 28750000, // €287,500
          lastYear: 24200000 // €242,000
        },
        customers: {
          totalCustomers: 2847,
          newCustomers: 186,
          returningCustomers: 421,
          loyaltyMembers: 1284,
          averageOrderValue: 2350, // €23.50
          customerLifetimeValue: 18750, // €187.50
          retentionRate: 73.2,
          churnRate: 12.8
        },
        orders: {
          totalOrders: 1642,
          avgOrdersPerDay: 54.7,
          peakHours: [
            { hour: 12, orderCount: 89 },
            { hour: 13, orderCount: 124 },
            { hour: 19, orderCount: 156 },
            { hour: 20, orderCount: 198 },
            { hour: 21, orderCount: 134 }
          ],
          popularItems: [
            { itemId: '1', name: 'Pizza Margherita', orderCount: 234, revenue: 280800 },
            { itemId: '2', name: 'Aperol Spritz', orderCount: 189, revenue: 160650 },
            { itemId: '3', name: 'Sallata Greke', orderCount: 156, revenue: 140400 },
            { itemId: '4', name: 'Peshk i Grilluar', orderCount: 98, revenue: 176400 },
            { itemId: '5', name: 'Tiramisu', orderCount: 87, revenue: 60900 }
          ],
          avgPreparationTime: 18.5,
          orderAcceptanceRate: 96.8
        },
        loyalty: {
          totalLoyaltyMembers: 1284,
          tierDistribution: [
            { tier: 'Bronz', count: 687, percentage: 53.5, avgSpent: 8500 },
            { tier: 'Argjend', count: 398, percentage: 31.0, avgSpent: 15200 },
            { tier: 'Ar', count: 156, percentage: 12.1, avgSpent: 28900 },
            { tier: 'Platinë', count: 35, percentage: 2.7, avgSpent: 67500 },
            { tier: 'VIP', count: 8, percentage: 0.6, avgSpent: 145800 }
          ],
          pointsIssued: 284750,
          pointsRedeemed: 89620,
          redemptionRate: 31.5,
          topRewards: [
            { rewardId: '1', name: '10% Zbritje', redemptions: 156, pointsCost: 500 },
            { rewardId: '2', name: 'Kafe Falas', redemptions: 89, pointsCost: 300 },
            { rewardId: '3', name: 'Dessert Falas', redemptions: 34, pointsCost: 800 }
          ],
          referralStats: {
            totalReferrals: 298,
            conversionRate: 84.2,
            topReferrers: [
              { customerId: '1', name: 'Andi Marku', referralCount: 12 },
              { customerId: '2', name: 'Elena Koci', referralCount: 8 },
              { customerId: '3', name: 'Gentian Shehi', referralCount: 7 }
            ]
          }
        },
        segments: [
          {
            id: 'vip_customers',
            name: 'Klientë VIP',
            description: 'Klientë me shpenzime të larta dhe besnikëri maksimale',
            customerCount: 43,
            avgOrderValue: 5890,
            totalRevenue: 892340,
            growthRate: 23.5,
            color: '#9b59b6'
          },
          {
            id: 'frequent_diners',
            name: 'Darkëtarë të Shpeshtë',
            description: 'Klientë që urdhërojnë 3+ herë në javë',
            customerCount: 187,
            avgOrderValue: 3250,
            totalRevenue: 1847590,
            growthRate: 18.2,
            color: '#e74c3c'
          },
          {
            id: 'weekend_warriors',
            name: 'Weekend Warriors',
            description: 'Klientë që prefojnë fundjava',
            customerCount: 423,
            avgOrderValue: 2890,
            totalRevenue: 1532470,
            growthRate: 15.7,
            color: '#f39c12'
          },
          {
            id: 'lunch_crowd',
            name: 'Lunch Crowd',
            description: 'Klientë të drekës (11:00-15:00)',
            customerCount: 634,
            avgOrderValue: 1850,
            totalRevenue: 1847200,
            growthRate: 12.3,
            color: '#3498db'
          },
          {
            id: 'new_customers',
            name: 'Klientë të Rinj',
            description: 'Klientë të regjistruar në 30 ditët e fundit',
            customerCount: 186,
            avgOrderValue: 2100,
            totalRevenue: 489300,
            growthRate: 156.8,
            color: '#27ae60'
          }
        ],
        insights: [
          {
            id: 'revenue_growth',
            type: 'success',
            title: 'Rritje e Fortë e Të Ardhurave',
            description: 'Të ardhurat këtë muaj janë 9.1% më të larta se muaji i kaluar',
            impact: 'high',
            actionRequired: false,
            metric: 9.1,
            trend: 'up'
          },
          {
            id: 'loyalty_opportunity',
            type: 'opportunity',
            title: 'Mundësi për Rritjen e Loyalty',
            description: 'Vetëm 45% e klientëve tuaj janë anëtarë të programit të besnikërisë',
            impact: 'medium',
            actionRequired: true,
            recommendation: 'Krijoni një fushatë promocionale për të rritur regjistrimet e loyalty',
            metric: 45,
            trend: 'stable'
          },
          {
            id: 'peak_hour_staffing',
            type: 'warning',
            title: 'Nevojë për Personal Shtesë',
            description: 'Koha mesatare e përgatitjes në orët 19:00-21:00 është 28% më e gjatë',
            impact: 'medium',
            actionRequired: true,
            recommendation: 'Konsideroni shtimin e personelit gjatë orëve të pikut',
            metric: 28,
            trend: 'up'
          },
          {
            id: 'referral_success',
            type: 'success',
            title: 'Program Referrals në Sukses',
            description: 'Shkalla e konvertimit të ftesave është 84.2% - mbi mesataren e industrisë',
            impact: 'high',
            actionRequired: false,
            metric: 84.2,
            trend: 'up'
          },
          {
            id: 'weekend_growth',
            type: 'opportunity',
            title: 'Potencial për Rritje në Fundjavë',
            description: 'Klientët e fundjavave kanë vlerë 23% më të lartë por përbëjnë vetëm 31% të bazës',
            impact: 'medium',
            actionRequired: true,
            recommendation: 'Krijoni ofertat speciale për fundjavat për të tërhequr më shumë klientë',
            metric: 23,
            trend: 'stable'
          }
        ],
        timeSeries: generateTimeSeriesData(),
        lastUpdated: new Date()
      };

      setAnalytics(mockAnalytics);
    } catch (err) {
      setError('Gabim në ngarkimin e analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic daily data with trends and variations
      const baseRevenue = 125000 + Math.random() * 50000;
      const baseOrders = 45 + Math.random() * 20;
      const baseCustomers = 35 + Math.random() * 15;
      
      // Add weekly patterns (higher on weekends)
      const dayOfWeek = date.getDay();
      const weekendMultiplier = (dayOfWeek === 5 || dayOfWeek === 6) ? 1.4 : 1.0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue * weekendMultiplier),
        orders: Math.round(baseOrders * weekendMultiplier),
        customers: Math.round(baseCustomers * weekendMultiplier),
        avgOrderValue: Math.round((baseRevenue * weekendMultiplier) / (baseOrders * weekendMultiplier))
      });
    }
    
    return data;
  };

  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(2)}`;

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getInsightsByType = (type: string) => {
    return analytics?.insights.filter(insight => insight.type === type) || [];
  };

  const getTopPerformingSegments = (limit = 3) => {
    return analytics?.segments
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit) || [];
  };

  return {
    analytics,
    loading,
    error,
    formatCurrency,
    calculateGrowthRate,
    getInsightsByType,
    getTopPerformingSegments,
    refresh: loadAnalytics
  };
};