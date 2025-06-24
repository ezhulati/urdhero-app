import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw, ArrowLeft, Signal, Home } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const NetworkErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    
    // Simulate retry attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRetrying(false);
    
    // Check if online and navigate back
    if (navigator.onLine) {
      navigate(-1);
    }
  };

  const isOnline = navigator.onLine;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kthehu mbrapa
        </button>

        <Card className="text-center p-8">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isOnline ? 'bg-orange-100' : 'bg-red-100'
          }`}>
            {isOnline ? (
              <Signal className="w-10 h-10 text-orange-600" />
            ) : (
              <WifiOff className="w-10 h-10 text-red-600" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isOnline ? 'Problem me Serverit e Urdhëro' : 'Asnjë Lidhje Interneti'}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isOnline ? (
              <>
                Serverit e Urdhëro nuk janë të arritshëm. 
                Mund të jetë problem i përkohshëm.
              </>
            ) : (
              <>
                Nuk keni lidhje me internetin. 
                Kontrolloni lidhjen dhe provoni përsëri për të përdorur Urdhëro.
              </>
            )}
          </p>

          {/* Status Indicator */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {isOnline ? 'Lidhur me internetin' : 'Jo të lidhur'}
              </span>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="text-left bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-blue-900 mb-3">Hapa për të zgjidhur problemin:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                Kontrolloni lidhjen me internetin
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                Rifreskoni faqen e Urdhëro
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                Nëse problemi vazhdon, kontaktoni mbështetjen e Urdhëro
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              loading={retrying}
              className="w-full"
              icon={<RefreshCw className="w-4 h-4" />}
              iconPosition="left"
            >
              Provo Përsëri
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Rifresko Faqen e Urdhëro
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
              icon={<Home className="w-4 h-4" />}
              iconPosition="left"
            >
              Kthehu në Shtëpi
            </Button>
          </div>

          {/* Connection Status */}
          <div className="mt-8 text-xs text-gray-500">
            Status: {isOnline ? 'Online' : 'Offline'} • 
            Urdhëro Servers: {Math.random() > 0.5 ? 'Offline' : 'Checking...'}
          </div>
        </Card>
      </div>
    </div>
  );
};