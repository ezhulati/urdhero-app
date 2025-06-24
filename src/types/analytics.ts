export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  avgOrderValue: number;
  totalRevenue: number;
  growthRate: number;
  color: string;
}

export interface RevenueMetrics {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  loyaltyMembers: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  retentionRate: number;
  churnRate: number;
}

export interface OrderMetrics {
  totalOrders: number;
  avgOrdersPerDay: number;
  peakHours: Array<{ hour: number; orderCount: number }>;
  popularItems: Array<{
    itemId: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  avgPreparationTime: number;
  orderAcceptanceRate: number;
}

export interface LoyaltyAnalytics {
  totalLoyaltyMembers: number;
  tierDistribution: Array<{
    tier: string;
    count: number;
    percentage: number;
    avgSpent: number;
  }>;
  pointsIssued: number;
  pointsRedeemed: number;
  redemptionRate: number;
  topRewards: Array<{
    rewardId: string;
    name: string;
    redemptions: number;
    pointsCost: number;
  }>;
  referralStats: {
    totalReferrals: number;
    conversionRate: number;
    topReferrers: Array<{
      customerId: string;
      name: string;
      referralCount: number;
    }>;
  };
}

export interface PerformanceInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  recommendation?: string;
  metric?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

export interface RestaurantAnalytics {
  restaurantId: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  revenue: RevenueMetrics;
  customers: CustomerMetrics;
  orders: OrderMetrics;
  loyalty: LoyaltyAnalytics;
  segments: CustomerSegment[];
  insights: PerformanceInsight[];
  timeSeries: TimeSeriesData[];
  lastUpdated: Date;
}