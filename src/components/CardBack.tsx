import React from 'react';

interface CardBackProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
}

const CardBack: React.FC<CardBackProps> = ({ 
  size = 'medium', 
  className = '', 
  animated = true 
}) => {
  const sizeClasses = {
    small: 'w-12 h-18',
    medium: 'w-16 h-24',
    large: 'w-20 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main card body */}
      <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-lg border-2 border-purple-400/80 shadow-lg overflow-hidden relative">
        
        {/* Ornate pattern background */}
        <div className="absolute inset-0 opacity-30">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Geometric pattern */}
            <defs>
              <pattern 
                id="cardPattern" 
                x="0" 
                y="0" 
                width="20" 
                height="20" 
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="rgba(147, 51, 234, 0.6)" />
                <path 
                  d="M5,5 L15,5 L15,15 L5,15 Z" 
                  fill="none" 
                  stroke="rgba(147, 51, 234, 0.4)" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#cardPattern)" />
          </svg>
        </div>

        {/* Central mystical symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative ${animated ? 'animate-pulse' : ''}`}>
            {/* Outer ring */}
            <div className="w-16 h-16 rounded-full border-2 border-purple-300/60 flex items-center justify-center">
              {/* Inner symbol */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                  />
                </svg>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4">
              <div className="w-full h-full bg-purple-300/40 transform rotate-45"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4">
              <div className="w-full h-full bg-purple-300/40 transform rotate-45"></div>
            </div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4">
              <div className="w-full h-full bg-purple-300/40 transform rotate-45"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4">
              <div className="w-full h-full bg-purple-300/40 transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Subtle shimmer effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
        )}

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 blur-sm"></div>
      </div>
    </div>
  );
};

export default CardBack;