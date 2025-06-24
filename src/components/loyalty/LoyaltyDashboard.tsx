import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Gift, Users, TrendingUp, Award, Share2, Clock, Zap, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LOYALTY_TIERS } from '../../types/loyalty';

export const LoyaltyDashboard: React.FC = () => {
  const { loyaltyUser, pointsHistory, availableRewards, getTierProgress, shareReferralCode, redeemReward } = useLoyalty();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history' | 'achievements'>('overview');

  if (!loyaltyUser) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Urdhëro Loyalty
        </h3>
        <p className="text-gray-600 mb-4">
          Bashkohuni me programin tonë të besnikërisë për pikë dhe shpërblime ekskluzive!
        </p>
        <Button>Bashkohu Tani</Button>
      </Card>
    );
  }

  const tierInfo = LOYALTY_TIERS[loyaltyUser.tier];
  const progress = getTierProgress();

  const formatPrice = (cents: number) => (cents / 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Tier Status Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-8 -translate-y-8" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{tierInfo.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{tierInfo.nameAlbanian}</h2>
                <p className="text-blue-100 text-sm">Niveli juaj aktual</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{loyaltyUser.points.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Pikë të disponueshme</div>
            </div>
          </div>

          {progress.nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresi drejt {progress.nextTier.nameAlbanian} {progress.nextTier.icon}</span>
                <span>{formatPrice(progress.current)}€ / {formatPrice(progress.next)}€</span>
              </div>
              <ProgressBar 
                progress={progress.progress} 
                color="blue" 
                className="bg-white bg-opacity-20"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{formatPrice(loyaltyUser.totalSpent)}€</div>
          <div className="text-xs text-gray-600">Shpenzime Totale</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{loyaltyUser.streakDays}</div>
          <div className="text-xs text-gray-600">Ditë Streak</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">{loyaltyUser.referralCount}</div>
          <div className="text-xs text-gray-600">Miq të Ftuar</div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Përmbledhje', icon: Star },
          { id: 'rewards', label: 'Shpërblime', icon: Gift },
          { id: 'history', label: 'Historiku', icon: Clock },
          { id: 'achievements', label: 'Arritjet', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-1 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
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
            <div className="space-y-6">
              {/* Tier Benefits */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                  Përfitimet e Nivelit {tierInfo.nameAlbanian}
                </h3>
                <div className="space-y-2">
                  {tierInfo.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Referral Section */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">
                      Fto Miqtë dhe Fitoni Pikë
                    </h3>
                    <p className="text-sm text-purple-700">
                      Ju dhe miku juaj merrni nga 500 pikë për çdo ftesë
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareReferralCode}
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Ndaj
                  </Button>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-sm text-gray-600 mb-1">Kodi juaj i ftesës:</div>
                  <div className="font-mono font-bold text-purple-700 text-lg">
                    {loyaltyUser.referralCode}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {availableRewards.map(reward => (
                <Card key={reward.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                        {reward.minimumTier > loyaltyUser.tier && (
                          <Badge variant="warning" size="sm">
                            Kërkon {LOYALTY_TIERS[reward.minimumTier].nameAlbanian}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600">
                          {reward.pointsCost} pikë
                        </span>
                        {reward.type === 'discount_percentage' && (
                          <Badge variant="success" size="sm">{reward.value}% zbritje</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => redeemReward(reward)}
                      disabled={
                        loyaltyUser.points < reward.pointsCost ||
                        loyaltyUser.tier < reward.minimumTier
                      }
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      Merr
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {pointsHistory.slice(0, 10).map(transaction => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-600">
                        {transaction.createdAt.toLocaleDateString('sq-AL')}
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.points)} pikë
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {loyaltyUser.achievements.map(achievement => (
                <Card key={achievement.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                        {achievement.completed && (
                          <Badge variant="success" size="sm">Përfunduar</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      {!achievement.completed && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progresi</span>
                            <span>{achievement.progress} / {achievement.target}</span>
                          </div>
                          <ProgressBar 
                            progress={(achievement.progress / achievement.target) * 100}
                            color="blue"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{achievement.pointsReward} pikë</div>
                      {achievement.completed && achievement.completedAt && (
                        <div className="text-xs text-gray-500">
                          {achievement.completedAt.toLocaleDateString('sq-AL')}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};