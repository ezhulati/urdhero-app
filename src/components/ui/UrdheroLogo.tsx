import React from 'react';
import { motion } from 'framer-motion';

interface UrdheroLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
  variant?: 'default' | 'white' | 'monochrome';
}

export const UrdheroLogo: React.FC<UrdheroLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '', 
  animated = false,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'space-x-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'space-x-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'space-x-3' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', container: 'space-x-3' },
    xxl: { icon: 'w-20 h-20', text: 'text-4xl', container: 'space-x-4' }
  };

  const { icon, text, container } = sizeClasses[size];

  const LogoIcon = () => (
    <div className={`${icon} relative`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-blue-600/20 rounded-2xl blur-sm scale-110 -z-10" />
      
      {/* Main container with sophisticated gradient */}
      <div className="w-full h-full bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Inner highlight gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" />
        
        {/* Subtle inner border for premium feel */}
        <div className="absolute inset-0.5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[14px] opacity-90" />
        
        {/* Professional "U" design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main U letter with sophisticated typography */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-3/5 h-3/5 text-white drop-shadow-lg"
              fill="currentColor"
            >
              {/* Modern U shape with perfect proportions */}
              <path 
                d="M6 4 C6 3.5 6.5 3 7 3 L9 3 C9.5 3 10 3.5 10 4 L10 14 C10 16.2 11.8 18 14 18 C16.2 18 18 16.2 18 14 L18 4 C18 3.5 18.5 3 19 3 L21 3 C21.5 3 22 3.5 22 4 L22 14 C22 18.4 18.4 22 14 22 C9.6 22 6 18.4 6 14 L6 4 Z"
                className="fill-white drop-shadow-sm"
              />
              
              {/* Subtle accent highlights for premium feel */}
              <circle cx="8" cy="7" r="0.5" className="fill-white/40" />
              <circle cx="20" cy="7" r="0.5" className="fill-white/40" />
            </svg>
            
            {/* Premium accent dot - trademark of professional apps */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-md border border-white/20" />
          </div>
        </div>
        
        {/* Subtle inner glow for depth */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/10 via-transparent to-blue-600/20 rounded-xl" />
      </div>
    </div>
  );

  const LogoComponent = animated ? motion.div : 'div';

  return (
    <LogoComponent
      className={`flex items-center ${container} ${className}`}
      {...(animated && {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 20 }
      })}
    >
      <LogoIcon />
      {showText && (
        <span className={`font-black tracking-tight ${text} bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent`}>
          Urdhëro
        </span>
      )}
    </LogoComponent>
  );
};

// Professional compact logo for headers
export const UrdheroLogoCompact: React.FC<{ 
  size?: 'sm' | 'md'; 
  className?: string;
  variant?: 'default' | 'white' | 'monochrome';
}> = ({ 
  size = 'sm', 
  className = '',
  variant = 'default'
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  
  return (
    <div className={`${iconSize} relative ${className}`}>
      {/* Professional compact design */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-xl" />
      </div>
      
      {/* Crisp U letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white font-black text-xs tracking-tighter drop-shadow-sm">
          U
        </div>
      </div>
      
      {/* Premium accent */}
      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-90 shadow-sm" />
    </div>
  );
};

// Professional favicon/icon generator
export const UrdheroFavicon: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Professional gradient background */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="50%" stopColor="#1e40af"/>
          <stop offset="100%" stopColor="#312e81"/>
        </linearGradient>
        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
        </linearGradient>
      </defs>
      
      {/* Main circle with professional gradient */}
      <circle cx="16" cy="16" r="14" fill="url(#bgGradient)" stroke="#1e40af" strokeWidth="2"/>
      
      {/* Highlight overlay */}
      <circle cx="16" cy="16" r="13" fill="url(#highlightGradient)"/>
      
      {/* Professional U letter */}
      <path 
        d="M10 8 L10 18 C10 20.2 11.8 22 14 22 L18 22 C20.2 22 22 20.2 22 18 L22 8 M12 8 L12 18 C12 19.1 12.9 20 14 20 L18 20 C19.1 20 20 19.1 20 18 L20 8"
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Premium accent dot */}
      <circle cx="20" cy="9" r="1.5" fill="#10b981"/>
    </svg>
  );
};