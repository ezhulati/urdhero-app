/**
 * QR Code parsing utilities for Urdhëro platform
 */

export interface QRData {
  restaurantSlug: string;
  tableCode: string;
  isValid: boolean;
  error?: string;
}

/**
 * Parse QR code data and extract restaurant and table information
 */
export const parseQRCode = (qrData: string): QRData => {
  try {
    // Handle different QR code formats
    
    // Format 1: Direct URL (https://urdhero.al/qr-landing?r=restaurant&t=table)
    if (qrData.includes('urdhero.al') || qrData.includes('localhost')) {
      const url = new URL(qrData);
      const restaurantSlug = url.searchParams.get('r');
      const tableCode = url.searchParams.get('t');
      
      if (restaurantSlug && tableCode) {
        return {
          restaurantSlug,
          tableCode,
          isValid: true
        };
      }
    }
    
    // Format 2: JSON format
    if (qrData.startsWith('{') && qrData.endsWith('}')) {
      const parsed = JSON.parse(qrData);
      
      if (parsed.restaurant && parsed.table) {
        return {
          restaurantSlug: parsed.restaurant,
          tableCode: parsed.table,
          isValid: true
        };
      }
      
      if (parsed.r && parsed.t) {
        return {
          restaurantSlug: parsed.r,
          tableCode: parsed.t,
          isValid: true
        };
      }
    }
    
    // Format 3: Simple colon-separated format (restaurant:table)
    if (qrData.includes(':')) {
      const parts = qrData.split(':');
      if (parts.length === 2) {
        return {
          restaurantSlug: parts[0].trim(),
          tableCode: parts[1].trim(),
          isValid: true
        };
      }
    }
    
    // Format 4: Hash-separated format (restaurant#table)
    if (qrData.includes('#')) {
      const parts = qrData.split('#');
      if (parts.length === 2) {
        return {
          restaurantSlug: parts[0].trim(),
          tableCode: parts[1].trim(),
          isValid: true
        };
      }
    }
    
    // Format 5: Pipe-separated format (restaurant|table)
    if (qrData.includes('|')) {
      const parts = qrData.split('|');
      if (parts.length === 2) {
        return {
          restaurantSlug: parts[0].trim(),
          tableCode: parts[1].trim(),
          isValid: true
        };
      }
    }
    
    // Format 6: Query string format (r=restaurant&t=table)
    if (qrData.includes('=') && qrData.includes('&')) {
      try {
        const params = new URLSearchParams(qrData);
        const restaurantSlug = params.get('r');
        const tableCode = params.get('t');
        
        if (restaurantSlug && tableCode) {
          return {
            restaurantSlug,
            tableCode,
            isValid: true
          };
        }
      } catch (e) {
        // Continue to next format
      }
    }
    
    return {
      restaurantSlug: '',
      tableCode: '',
      isValid: false,
      error: 'QR code format not recognized'
    };
    
  } catch (error) {
    console.error('QR parsing error:', error);
    return {
      restaurantSlug: '',
      tableCode: '',
      isValid: false,
      error: 'Failed to parse QR code data'
    };
  }
};

/**
 * Generate QR code data in the preferred format
 */
export const generateQRData = (restaurantSlug: string, tableCode: string): string => {
  // Use URL format for maximum compatibility
  const baseUrl = import.meta.env.PROD 
    ? 'https://urdhero.al' 
    : window.location.origin;
  
  return `${baseUrl}/qr-landing?r=${encodeURIComponent(restaurantSlug)}&t=${encodeURIComponent(tableCode)}`;
};

/**
 * Validate restaurant slug and table code
 */
export const validateQRData = (restaurantSlug: string, tableCode: string): boolean => {
  // Basic validation rules
  const restaurantRegex = /^[a-z0-9-]+$/; // alphanumeric and dashes only
  const tableRegex = /^[a-zA-Z0-9-_]+$/; // alphanumeric, dashes, and underscores
  
  return (
    restaurantSlug.length >= 2 && 
    restaurantSlug.length <= 50 &&
    tableCode.length >= 1 && 
    tableCode.length <= 20 &&
    restaurantRegex.test(restaurantSlug) &&
    tableRegex.test(tableCode)
  );
};