import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Download, Copy, QrCode } from 'lucide-react';
import { generateQRData } from '../../utils/qrParser';
import toast from 'react-hot-toast';

interface QRCodeGeneratorProps {
  restaurantSlug: string;
  tableCode: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  restaurantSlug, 
  tableCode, 
  size = 256,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrData = generateQRData(restaurantSlug, tableCode);

  useEffect(() => {
    generateQRCode();
  }, [restaurantSlug, tableCode, size]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Using a simple QR code generation approach for demo
      // In production, you'd want to use a proper QR code library like 'qrcode'
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Set canvas size
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Draw placeholder QR code pattern
      const gridSize = 21; // Standard QR code grid
      const cellSize = size / gridSize;

      ctx.fillStyle = '#000000';

      // Draw finder patterns (corners)
      drawFinderPattern(ctx, 0, 0, cellSize);
      drawFinderPattern(ctx, 14 * cellSize, 0, cellSize);
      drawFinderPattern(ctx, 0, 14 * cellSize, cellSize);

      // Draw some data pattern (simplified)
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Skip finder patterns
          if (isFinderPattern(i, j)) continue;
          
          // Simple pattern based on data
          const hash = simpleHash(qrData + i + j);
          if (hash % 3 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }

      // Add center logo area (Urdhëro branding)
      const logoSize = cellSize * 3;
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(logoX, logoY, logoSize, logoSize);
      
      ctx.fillStyle = '#1d4ed8';
      ctx.font = `${cellSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('U', logoX + logoSize/2, logoY + logoSize/2 + cellSize/3);

    } catch (error) {
      console.error('QR code generation error:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number) => {
    // Outer square
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    
    // Inner white square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    
    // Inner black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  };

  const isFinderPattern = (i: number, j: number): boolean => {
    return (
      (i < 9 && j < 9) || // Top-left
      (i > 12 && j < 9) || // Top-right
      (i < 9 && j > 12)    // Bottom-left
    );
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `qr-${restaurantSlug}-${tableCode}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast.success('QR code downloaded');
  };

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success('QR data copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy QR data');
    }
  };

  return (
    <Card className={`p-6 text-center ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <QrCode className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Table QR Code</h3>
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Badge variant="primary" size="sm">
            {restaurantSlug}
          </Badge>
          <Badge variant="secondary" size="sm">
            Table {tableCode}
          </Badge>
        </div>
      </div>

      {/* QR Code Canvas */}
      <div className="mb-4 flex justify-center">
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ width: `${Math.min(size, 200)}px`, height: `${Math.min(size, 200)}px` }}
          />
        </div>
      </div>

      {/* QR Data Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-600 mb-1">QR Data:</p>
        <p className="text-sm font-mono text-gray-800 break-all">
          {qrData}
        </p>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadQRCode}
          className="flex-1"
          icon={<Download className="w-4 h-4" />}
          iconPosition="left"
        >
          Download
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyQRData}
          className="flex-1"
          icon={<Copy className="w-4 h-4" />}
          iconPosition="left"
        >
          Copy Data
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Print and place this QR code on the table for customers to scan
      </p>
    </Card>
  );
};