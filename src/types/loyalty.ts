export interface LoyaltyUser {
  id: string;
  customerId: string;
  points: number;
  totalSpent: number; // in cents
  tier: LoyaltyTier;
  joinedAt: Date;
  lastActivityAt: Date;
  badges: LoyaltyBadge[];
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  achievements: Achievement[];
  streakDays: number;
  lastOrderDate?: Date;
}

export enum LoyaltyTier {
  BRONZ = 'bronz',
  AR = 'ar', 
  ARI = 'ari',
  PLATINE = 'platine',
  VIP = 'vip'
}

export interface LoyaltyBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  category: 'orders' | 'social' | 'spending' | 'special';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
  category: 'orders' | 'spending' | 'social' | 'exploration';
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount_percentage' | 'discount_fixed' | 'free_item' | 'upgrade' | 'experience';
  value: number; // percentage or fixed amount in cents
  minimumTier: LoyaltyTier;
  validUntil?: Date;
  maxRedemptions?: number;
  isActive: boolean;
  categories?: string[];
  restaurantSpecific?: string[];
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  rewardId?: string;
  restaurantId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ReferralProgram {
  referrerReward: number; // points
  refereeReward: number; // points
  minimumOrderForReward: number; // in cents
  maxReferralsPerUser: number;
  isActive: boolean;
}

// Tier thresholds and benefits
export const LOYALTY_TIERS = {
  [LoyaltyTier.BRONZ]: {
    name: 'Bronz',
    nameAlbanian: 'Bronz',
    minSpent: 0,
    pointMultiplier: 1,
    benefits: ['Pikë për çdo porosi', 'Oferta speciale'],
    color: '#cd7f32',
    icon: '🥉'
  },
  [LoyaltyTier.AR]: {
    name: 'Argjend',
    nameAlbanian: 'Argjend', 
    minSpent: 10000, // 100 EUR
    pointMultiplier: 1.25,
    benefits: ['25% më shumë pikë', 'Zbritje ekskluzive', 'Prioritet në mbështetje'],
    color: '#c0c0c0',
    icon: '🥈'
  },
  [LoyaltyTier.ARI]: {
    name: 'Ar',
    nameAlbanian: 'Ar',
    minSpent: 25000, // 250 EUR
    pointMultiplier: 1.5,
    benefits: ['50% më shumë pikë', 'Qasje në oferta VIP', 'Ndjekje prioriteti'],
    color: '#ffd700',
    icon: '🥇'
  },
  [LoyaltyTier.PLATINE]: {
    name: 'Platinë',
    nameAlbanian: 'Platinë',
    minSpent: 50000, // 500 EUR
    pointMultiplier: 2,
    benefits: ['Dyfishim pikësh', 'Shërbim VIP', 'Eventi ekskluzivë'],
    color: '#e5e4e2',
    icon: '💎'
  },
  [LoyaltyTier.VIP]: {
    name: 'VIP',
    nameAlbanian: 'VIP',
    minSpent: 100000, // 1000 EUR
    pointMultiplier: 2.5,
    benefits: ['Përfitime maksimale', 'Menaxher personal', 'Qasje ekskluzive'],
    color: '#9b59b6',
    icon: '👑'
  }
};

// Points earning rules
export const POINTS_RULES = {
  ORDER_BASE: 1, // 1 point per 1 EUR spent
  REVIEW_BONUS: 50,
  REFERRAL_BONUS: 500,
  BIRTHDAY_BONUS: 1000,
  STREAK_BONUS: 25, // per day
  FIRST_ORDER_BONUS: 200,
  SOCIAL_SHARE_BONUS: 25,
  SURVEY_COMPLETION: 100
};