import { useState, useEffect } from 'react';
import { LoyaltyUser, LoyaltyTier, PointsTransaction, LoyaltyReward, LOYALTY_TIERS, POINTS_RULES } from '../types/loyalty';
import { useCustomerAuth } from './useCustomerAuth';
import toast from 'react-hot-toast';

const LOYALTY_STORAGE_KEY = 'urdhero-loyalty-data';

export const useLoyalty = () => {
  const { user, isAuthenticated } = useCustomerAuth();
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadLoyaltyData();
    } else {
      setLoyaltyUser(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadLoyaltyData = async () => {
    try {
      // Try to load existing loyalty data
      const stored = localStorage.getItem(LOYALTY_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.customerId === user?.id) {
          setLoyaltyUser({
            ...data,
            joinedAt: new Date(data.joinedAt),
            lastActivityAt: new Date(data.lastActivityAt),
            badges: data.badges?.map((b: any) => ({
              ...b,
              earnedAt: new Date(b.earnedAt)
            })) || [],
            achievements: data.achievements || [],
            lastOrderDate: data.lastOrderDate ? new Date(data.lastOrderDate) : undefined
          });
        }
      }

      // If no loyalty data exists, create new loyalty profile
      if (!stored || JSON.parse(stored).customerId !== user?.id) {
        await createLoyaltyProfile();
      }

      loadRewards();
      loadPointsHistory();
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLoyaltyProfile = async () => {
    if (!user) return;

    const referralCode = generateReferralCode();
    const newLoyaltyUser: LoyaltyUser = {
      id: `loyalty_${user.id}`,
      customerId: user.id,
      points: 0,
      totalSpent: 0,
      tier: LoyaltyTier.BRONZ,
      joinedAt: new Date(),
      lastActivityAt: new Date(),
      badges: [],
      referralCode,
      referralCount: 0,
      achievements: generateInitialAchievements(),
      streakDays: 0
    };

    // Give welcome bonus
    await awardPoints(200, 'Mirë se erdhe në Urdhëro Loyalty! 🎉');
    
    setLoyaltyUser(newLoyaltyUser);
    saveLoyaltyData(newLoyaltyUser);

    toast.success('🎉 Mirë se erdhe në Urdhëro Loyalty! +200 pikë bonus!', {
      duration: 4000,
    });
  };

  const generateReferralCode = () => {
    return `UR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const generateInitialAchievements = () => {
    return [
      {
        id: 'first_order',
        name: 'Porosia e Parë',
        description: 'Bëj porosinë e parë në Urdhëro',
        icon: '🎯',
        pointsReward: 100,
        progress: 0,
        target: 1,
        completed: false,
        category: 'orders' as const
      },
      {
        id: 'spend_50',
        name: 'Shpenzues i Mirë',
        description: 'Shpenzo 50€ në total',
        icon: '💰',
        pointsReward: 250,
        progress: 0,
        target: 5000,
        completed: false,
        category: 'spending' as const
      },
      {
        id: 'refer_friend',
        name: 'Mik i Mirë',
        description: 'Fto një mik në Urdhëro',
        icon: '👥',
        pointsReward: 500,
        progress: 0,
        target: 1,
        completed: false,
        category: 'social' as const
      },
      {
        id: 'try_3_restaurants',
        name: 'Eksploruesi',
        description: 'Urdhëro nga 3 restorante të ndryshme',
        icon: '🗺️',
        pointsReward: 300,
        progress: 0,
        target: 3,
        completed: false,
        category: 'exploration' as const
      }
    ];
  };

  const awardPoints = async (points: number, description: string, orderId?: string) => {
    if (!loyaltyUser) return;

    const multiplier = LOYALTY_TIERS[loyaltyUser.tier].pointMultiplier;
    const finalPoints = Math.round(points * multiplier);

    const transaction: PointsTransaction = {
      id: `pts_${Date.now()}`,
      customerId: loyaltyUser.customerId,
      type: 'earned',
      points: finalPoints,
      description,
      orderId,
      createdAt: new Date()
    };

    const updatedUser = {
      ...loyaltyUser,
      points: loyaltyUser.points + finalPoints,
      lastActivityAt: new Date()
    };

    // Check for tier upgrade
    const newTier = calculateTier(updatedUser.totalSpent);
    if (newTier !== loyaltyUser.tier) {
      updatedUser.tier = newTier;
      const tierInfo = LOYALTY_TIERS[newTier];
      toast.success(`🎉 Urime! Ju u ngritët në nivelin ${tierInfo.nameAlbanian} ${tierInfo.icon}!`, {
        duration: 5000
      });
    }

    setLoyaltyUser(updatedUser);
    saveLoyaltyData(updatedUser);
    
    // Add to points history
    setPointsHistory(prev => [transaction, ...prev]);

    toast.success(`+${finalPoints} pikë! ${description}`, {
      duration: 3000,
      icon: '⭐'
    });
  };

  const redeemReward = async (reward: LoyaltyReward) => {
    if (!loyaltyUser || loyaltyUser.points < reward.pointsCost) {
      toast.error('Nuk keni pikë të mjaftueshme për këtë shpërblim');
      return false;
    }

    if (loyaltyUser.tier < reward.minimumTier) {
      const tierInfo = LOYALTY_TIERS[reward.minimumTier];
      toast.error(`Kjo shpërblim kërkon nivelin ${tierInfo.nameAlbanian} ${tierInfo.icon}`);
      return false;
    }

    const transaction: PointsTransaction = {
      id: `pts_${Date.now()}`,
      customerId: loyaltyUser.customerId,
      type: 'redeemed',
      points: -reward.pointsCost,
      description: `Shpërblim: ${reward.name}`,
      rewardId: reward.id,
      createdAt: new Date()
    };

    const updatedUser = {
      ...loyaltyUser,
      points: loyaltyUser.points - reward.pointsCost,
      lastActivityAt: new Date()
    };

    setLoyaltyUser(updatedUser);
    saveLoyaltyData(updatedUser);
    setPointsHistory(prev => [transaction, ...prev]);

    toast.success(`🎁 Shpërblimi "${reward.name}" u aktivizua!`, {
      duration: 4000
    });

    return true;
  };

  const processOrderForLoyalty = async (orderValue: number, orderId: string) => {
    if (!loyaltyUser) return;

    // Award base points (1 point per EUR)
    const basePoints = Math.round(orderValue / 100);
    await awardPoints(basePoints, `Porosi #${orderId}`, orderId);

    // Update total spent and check for tier upgrade
    const updatedUser = {
      ...loyaltyUser,
      totalSpent: loyaltyUser.totalSpent + orderValue,
      lastOrderDate: new Date()
    };

    // Update streak
    const today = new Date();
    const lastOrder = loyaltyUser.lastOrderDate;
    if (lastOrder) {
      const daysDiff = Math.floor((today.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        updatedUser.streakDays = loyaltyUser.streakDays + 1;
        await awardPoints(POINTS_RULES.STREAK_BONUS, `Streak ${updatedUser.streakDays} ditë! 🔥`);
      } else if (daysDiff > 1) {
        updatedUser.streakDays = 1;
      }
    } else {
      // First order
      updatedUser.streakDays = 1;
      await awardPoints(POINTS_RULES.FIRST_ORDER_BONUS, 'Porosia e parë! 🎉');
    }

    // Check and update achievements
    await checkAchievements(updatedUser, 'order');

    setLoyaltyUser(updatedUser);
    saveLoyaltyData(updatedUser);
  };

  const checkAchievements = async (user: LoyaltyUser, trigger: string) => {
    // Implementation for checking and awarding achievements
    // This would check various conditions and award badges/achievements
  };

  const calculateTier = (totalSpent: number): LoyaltyTier => {
    if (totalSpent >= LOYALTY_TIERS[LoyaltyTier.VIP].minSpent) return LoyaltyTier.VIP;
    if (totalSpent >= LOYALTY_TIERS[LoyaltyTier.PLATINE].minSpent) return LoyaltyTier.PLATINE;
    if (totalSpent >= LOYALTY_TIERS[LoyaltyTier.ARI].minSpent) return LoyaltyTier.ARI;
    if (totalSpent >= LOYALTY_TIERS[LoyaltyTier.AR].minSpent) return LoyaltyTier.AR;
    return LoyaltyTier.BRONZ;
  };

  const loadRewards = async () => {
    // Mock rewards data
    const mockRewards: LoyaltyReward[] = [
      {
        id: 'discount_10',
        name: '10% Zbritje',
        description: '10% zbritje për porosinë tuaj të ardhshme',
        pointsCost: 500,
        type: 'discount_percentage',
        value: 10,
        minimumTier: LoyaltyTier.BRONZ,
        isActive: true
      },
      {
        id: 'free_coffee',
        name: 'Kafe Falas',
        description: 'Një kafe espresso falas',
        pointsCost: 300,
        type: 'free_item',
        value: 0,
        minimumTier: LoyaltyTier.BRONZ,
        isActive: true
      },
      {
        id: 'vip_table',
        name: 'Tavolinë VIP',
        description: 'Rezervim i garantuar në tavolinën më të mirë',
        pointsCost: 1000,
        type: 'experience',
        value: 0,
        minimumTier: LoyaltyTier.ARI,
        isActive: true
      }
    ];

    setAvailableRewards(mockRewards);
  };

  const loadPointsHistory = async () => {
    // Load from localStorage or API
    const stored = localStorage.getItem(`${LOYALTY_STORAGE_KEY}_history`);
    if (stored) {
      const history = JSON.parse(stored).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        expiresAt: t.expiresAt ? new Date(t.expiresAt) : undefined
      }));
      setPointsHistory(history);
    }
  };

  const saveLoyaltyData = (data: LoyaltyUser) => {
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(data));
  };

  const getTierProgress = () => {
    if (!loyaltyUser) return { current: 0, next: 0, progress: 0 };

    const currentTier = loyaltyUser.tier;
    const tiers = Object.values(LoyaltyTier);
    const currentIndex = tiers.indexOf(currentTier);
    
    if (currentIndex === tiers.length - 1) {
      // Max tier reached
      return { current: loyaltyUser.totalSpent, next: loyaltyUser.totalSpent, progress: 100 };
    }

    const nextTier = tiers[currentIndex + 1];
    const currentThreshold = LOYALTY_TIERS[currentTier].minSpent;
    const nextThreshold = LOYALTY_TIERS[nextTier].minSpent;
    
    const progress = ((loyaltyUser.totalSpent - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    
    return {
      current: loyaltyUser.totalSpent,
      next: nextThreshold,
      progress: Math.min(100, Math.max(0, progress)),
      nextTier: LOYALTY_TIERS[nextTier]
    };
  };

  const shareReferralCode = async () => {
    if (!loyaltyUser) return;

    const shareData = {
      title: 'Bashkohu me mua në Urdhëro!',
      text: `Përdor kodin tim ${loyaltyUser.referralCode} dhe merrni të dy 500 pikë bonus! 🎁`,
      url: `https://urdhero.al/join?ref=${loyaltyUser.referralCode}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        await awardPoints(POINTS_RULES.SOCIAL_SHARE_BONUS, 'Ndarje në rrjetet sociale! 📱');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `Bashkohu me mua në Urdhëro! Përdor kodin ${loyaltyUser.referralCode}: https://urdhero.al/join?ref=${loyaltyUser.referralCode}`
      );
      toast.success('Linku i ftesës u kopjua në clipboard! 📋');
    }
  };

  return {
    loyaltyUser,
    loading,
    pointsHistory,
    availableRewards,
    awardPoints,
    redeemReward,
    processOrderForLoyalty,
    getTierProgress,
    shareReferralCode,
    isLoyaltyMember: !!loyaltyUser
  };
};