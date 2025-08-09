import React from 'react';

const WaveAnimation = ({ progress = 0, size = 200 }) => {
  const waveHeight = (100 - progress) * (size / 100);
  
  return (
    <div 
      className="relative overflow-hidden rounded-full bg-gradient-to-b from-blue-400 to-blue-600"
      style={{ width: size, height: size }}
    >
      {/* Water level */}
      <div 
        className="absolute bottom-0 w-full bg-gradient-to-t from-water-500 to-water-400 transition-all duration-1000 ease-out"
        style={{ 
          height: `${progress}%`,
          minHeight: progress > 0 ? '10px' : '0px'
        }}
      />
      
      {/* Animated waves */}
      <div 
        className="absolute w-full transition-all duration-1000 ease-out"
        style={{ bottom: `${progress}%` }}
      >
        <svg
          className="w-full h-6"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.8)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,12 Q100,0 200,12 T400,12 L400,24 L0,24 Z"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-200,0;0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Droplet animations */}
      {progress > 20 && (
        <>
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-12 left-1/2 w-1 h-1 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
        </>
      )}

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-2xl drop-shadow-lg">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default WaveAnimation;
