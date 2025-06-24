import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Check, Globe } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return;
    }

    // Check if user has dismissed the prompt before
    const hasUserDismissed = localStorage.getItem('pwaPromptDismissed') === 'true';
    if (hasUserDismissed) {
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show after a delay for iOS (since it doesn't support beforeinstallprompt)
    if (isIOSDevice) {
      const timeout = setTimeout(() => {
        // Only show if user hasn't dismissed before
        if (!hasUserDismissed) {
          setIsVisible(true);
        }
      }, 30000); // Show after 30 seconds for iOS users
      
      return () => clearTimeout(timeout);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, show instructions
      toast.success('Add to Home Screen by tapping the Share icon and then "Add to Home Screen"', {
        duration: 5000,
        icon: '📱'
      });
      setIsVisible(false);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast.success('Thanks for installing our app!', {
        icon: '🎉'
      });
    }
    
    // Clear the saved prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-5 left-0 right-0 z-50 px-4 mx-auto max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="p-4 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              {isIOS ? (
                <Smartphone className="w-6 h-6 text-white" />
              ) : (
                <Download className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install Urdhëro for a better experience
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {isIOS 
                  ? 'Add to your home screen for a full-screen experience and quick access'
                  : 'Install our app to use it offline and get a better experience'
                }
              </p>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1"
                >
                  Maybe later
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  icon={isIOS ? <Globe className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {isIOS ? 'Add to Home Screen' : 'Install App'}
                </Button>
              </div>
              
              {!isIOS && (
                <div className="mt-2 text-xs text-blue-700 flex items-center justify-center">
                  <Check className="w-3 h-3 mr-1" />
                  <span>Works offline • No app store required</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};