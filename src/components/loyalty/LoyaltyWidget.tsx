import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, TrendingUp, Gift } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LOYALTY_TIERS } from '../../types/loyalty';

interface LoyaltyWidgetProps {
  onViewDetails?: () => void;
  compact?: boolean;
}

export const LoyaltyWidget: React.FC<LoyaltyWidgetProps> = ({ 
  onViewDetails, 
  compact = false 
}) => {
  const { loyaltyUser, getTierProgress } = useLoyalty();

  if (!loyaltyUser) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" onClick={onViewDetails}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-blue-900">Bashkohuni me Urdhëro Loyalty</div>
            <div className="text-sm text-blue-700">Fitoni pikë dhe shpërblime ekskluzive</div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="gradient" size="sm">
              Falas
            </Badge>
          </motion.div>
        </div>
      </Card>
    );
  }

  const tierInfo = LOYALTY_TIERS[loyaltyUser.tier];
  const progress = getTierProgress();

  if (compact) {
    return (
      <motion.div
        className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2 cursor-pointer"
        onClick={onViewDetails}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
             style={{ backgroundColor: `${tierInfo.color}20` }}>
          <span className="text-sm">{tierInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-900 truncate">
              {loyaltyUser.points}
            </span>
            <Star className="w-3 h-3 text-yellow-500" />
          </div>
          <div className="text-xs text-gray-600 truncate">
            {tierInfo.nameAlbanian}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onViewDetails}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
               style={{ backgroundColor: `${tierInfo.color}20` }}>
            <span className="text-lg">{tierInfo.icon}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{tierInfo.nameAlbanian}</div>
            <div className="text-sm text-gray-600">Loyalty Member</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900">{loyaltyUser.points}</span>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-xs text-gray-600">pikë</div>
        </div>
      </div>

      {progress.nextTier && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Drejt {progress.nextTier.nameAlbanian} {progress.nextTier.icon}</span>
            <span>{Math.round(progress.progress)}%</span>
          </div>
          <ProgressBar 
            progress={progress.progress} 
            color="blue" 
            size="sm"
          />
        </div>
      )}

      {/* Quick Benefits Preview */}
      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span>{tierInfo.pointMultiplier}x pikë</span>
        </div>
        <div className="flex items-center">
          <Gift className="w-3 h-3 mr-1" />
          <span>Shpërblime</span>
        </div>
      </div>
    </Card>
  );
};