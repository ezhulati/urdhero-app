import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Clock, Heart, LogOut, Edit, Gift, Star, Crown, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoyaltyWidget } from '../loyalty/LoyaltyWidget';
import { LoyaltyDashboard } from '../loyalty/LoyaltyDashboard';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LOYALTY_TIERS } from '../../types/loyalty';

interface CustomerProfileProps {
  onClose: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ onClose }) => {
  const { user, logout, updateUser } = useCustomerAuth();
  const { loyaltyUser } = useLoyalty();
  const [editing, setEditing] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateUser({
      name: formData.name,
      phone: formData.phone
    });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const memberSince = new Date(user.joinedAt).toLocaleDateString('sq-AL', {
    year: 'numeric',
    month: 'long'
  });

  const formatPrice = (cents: number) => (cents / 100).toFixed(2);

  if (showLoyalty) {
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLoyalty(false)}
            className="text-gray-600"
          >
            ← Mbrapa
          </Button>
          <h2 className="font-semibold text-gray-900">Urdhëro Loyalty</h2>
          <div></div>
        </div>
        <LoyaltyDashboard />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-md mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-blue-100 text-sm">{user.email}</p>
          
          {/* Loyalty Status in Header */}
          {loyaltyUser && (
            <div className="flex items-center justify-center mt-3">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <span className="text-sm">{LOYALTY_TIERS[loyaltyUser.tier].icon}</span>
                <span className="text-sm font-medium">
                  {LOYALTY_TIERS[loyaltyUser.tier].nameAlbanian}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-300" />
                  <span className="text-xs">{loyaltyUser.points}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{user.totalOrders}</div>
              <div className="text-sm text-gray-600">Porosi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{user.preferences.favoriteItems.length}</div>
              <div className="text-sm text-gray-600">Të preferuar</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Loyalty Widget */}
      <div className="mb-6">
        <LoyaltyWidget 
          onViewDetails={() => setShowLoyalty(true)}
          compact={false}
        />
      </div>

      {/* Account Info */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Informacioni Personal</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>
          
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Emri
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSave}>Ruaj</Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Anulo</Button>
              </div>
            </div>
          ) : (
            <>
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Anëtar që nga {memberSince}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Loyalty Stats (if member) */}
      {loyaltyUser && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(loyaltyUser.totalSpent)}€
            </div>
            <div className="text-xs text-gray-600">Shpenzime Totale</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {loyaltyUser.streakDays}
            </div>
            <div className="text-xs text-gray-600">Ditë Streak</div>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 text-center">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{user.preferences.favoriteItems.length}</div>
          <div className="text-xs text-gray-600">Artikuj të Preferuar</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Gift className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {user.totalOrders >= 5 ? Math.floor(user.totalOrders / 5) : 0}
          </div>
          <div className="text-xs text-gray-600">Zbritje të Fituara</div>
        </Card>
      </div>

      {/* Recent Orders */}
      {user.orderHistory.length > 0 && (
        <Card className="mb-6 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Porositë e Fundit</h2>
          <div className="space-y-2">
            {user.orderHistory.slice(0, 3).map((order, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">#{order.numriPorosise}</span>
                <span className="font-medium">{(order.shumaTotale / 100).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Dil nga Llogaria
        </Button>
      </Card>
    </motion.div>
  );
};