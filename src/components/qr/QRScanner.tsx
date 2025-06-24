import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, X, Zap, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    checkCameraSupport();
    
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const checkCameraSupport = async () => {
    try {
      const hasCamera = await QrScanner.hasCamera();
      setHasCamera(hasCamera);
      
      if (hasCamera) {
        initializeScanner();
      } else {
        setError('No camera detected on this device');
      }
    } catch (err) {
      console.error('Camera check failed:', err);
      setError('Unable to access camera. Please check permissions.');
      setHasCamera(false);
    }
  };

  const initializeScanner = async () => {
    if (!videoRef.current) return;

    try {
      setError(null);
      setScanning(true);

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera if available
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        }
      );

      await qrScannerRef.current.start();
      setCameraEnabled(true);
      
      toast.success('Camera ready - point at QR code');
    } catch (err) {
      console.error('Scanner initialization failed:', err);
      setError('Failed to start camera. Check permissions and try again.');
      setScanning(false);
    }
  };

  const handleScanResult = (result: QrScanner.ScanResult) => {
    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScanTime < 2000) return;
    
    setLastScanTime(now);
    
    const qrData = result.data;
    console.log('QR Code scanned:', qrData);
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    toast.success('QR Code detected!');
    onScanSuccess(qrData);
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setCameraEnabled(false);
    setScanning(false);
  };

  const restartScanner = async () => {
    stopScanner();
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    await initializeScanner();
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">QR Scanner</h2>
                    <p className="text-xs text-blue-100">Point camera at QR code</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scanner Area */}
            <div className="relative bg-black">
              {hasCamera === null && (
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm">Checking camera...</p>
                  </div>
                </div>
              )}

              {hasCamera === false && (
                <div className="aspect-square flex items-center justify-center bg-gray-900">
                  <div className="text-center text-gray-300">
                    <CameraOff className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm mb-2">No camera available</p>
                    <p className="text-xs text-gray-500">Use demo mode instead</p>
                  </div>
                </div>
              )}

              {hasCamera && (
                <div className="relative aspect-square">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400"></div>
                      
                      {scanning && (
                        <motion.div
                          className="absolute inset-x-0 top-0 h-1 bg-blue-400"
                          animate={{ y: [0, 248, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 left-4">
                    <Badge variant={cameraEnabled ? 'success' : 'warning'} size="sm">
                      {cameraEnabled ? (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          Scanning
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Camera Error</p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {hasCamera && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={restartScanner}
                      disabled={scanning && cameraEnabled && !error}
                      icon={<RefreshCw className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Restart
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-600">
                  Position the QR code within the frame for automatic detection
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};