import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, CheckCircle, User, MapPin, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useWaiterCall } from '../../hooks/useWaiterCall';

export const WaiterCallManager: React.FC = () => {
  const { getAllCalls, resetCall, resetAllCalls, getPendingCallsCount } = useWaiterCall();
  const pendingCalls = getAllCalls();
  const pendingCount = getPendingCallsCount();

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Tani';
    if (minutes < 60) return `${minutes} min më parë`;
    const hours = Math.floor(minutes / 60);
    return `${hours} orë më parë`;
  };

  const getUrgencyLevel = (calledAt: Date) => {
    const minutes = Math.floor((Date.now() - calledAt.getTime()) / 60000);
    if (minutes < 5) return 'normal';
    if (minutes < 10) return 'medium';
    return 'high';
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-orange-300 bg-orange-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Thirrjet e Kamarienit</h2>
            <p className="text-sm text-gray-600">
              {pendingCount} thirrje në pritje
            </p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllCalls}
            className="text-red-600 border-red-200 hover:bg-red-50"
            icon={<RotateCcw className="w-4 h-4" />}
            iconPosition="left"
          >
            Rivendos Të gjitha
          </Button>
        )}
      </div>

      {/* Pending Calls */}
      {pendingCount === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Asnjë thirrje në pritje
          </h3>
          <p className="text-gray-600">
            Thirrjet e reja do të shfaqen këtu automatikisht
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {pendingCalls
              .sort((a, b) => a.calledAt.getTime() - b.calledAt.getTime()) // Oldest first (most urgent)
              .map((call) => {
                const urgency = getUrgencyLevel(call.calledAt);
                const urgencyColor = getUrgencyColor(urgency);
                
                return (
                  <motion.div
                    key={call.tableId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`p-4 border-2 ${urgencyColor}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Table Icon */}
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            urgency === 'high' ? 'bg-red-600' :
                            urgency === 'medium' ? 'bg-orange-600' : 'bg-blue-600'
                          }`}>
                            <span className="text-white font-bold text-sm">
                              {call.tableId}
                            </span>
                          </div>

                          {/* Call Info */}
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                Tavolina {call.tableId}
                              </h3>
                              <Badge 
                                variant={
                                  urgency === 'high' ? 'danger' :
                                  urgency === 'medium' ? 'warning' : 'primary'
                                } 
                                size="sm"
                              >
                                {urgency === 'high' ? 'Urgjent' :
                                 urgency === 'medium' ? 'Mesatarisht' : 'I ri'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {getTimeAgo(call.calledAt)}
                              </div>
                              
                              {call.callerId && (
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {call.callerId}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => resetCall(call.tableId)}
                            icon={<CheckCircle className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Shërbyer
                          </Button>
                        </div>
                      </div>

                      {/* Urgency Indicator */}
                      {urgency === 'high' && (
                        <motion.div
                          className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg"
                          animate={{ 
                            scale: [1, 1.02, 1],
                            backgroundColor: ['rgb(254 226 226)', 'rgb(252 165 165)', 'rgb(254 226 226)']
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="flex items-center text-red-800 text-sm">
                            <Bell className="w-4 h-4 mr-2" />
                            Thirrje urgjente - Klientët po presin më shumë se 10 minuta
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm mb-1">Udhëzime</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Thirrjet e reja shfaqen automatikisht në krye të listës</li>
              <li>• Ngjyrat tregojnë urgjencën: Kaltër (i ri), Portokalli (mesatar), Kuq (urgjent)</li>
              <li>• Klikoni "Shërbyer" kur keni ndihmuar klientin</li>
              <li>• Thirrjet urgjente (10+ min) pulsojnë për vëmendje</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};