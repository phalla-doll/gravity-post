import React from 'react';

const CookingPotLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <style>{`
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        @keyframes pot-wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }
        @keyframes lid-rattle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes liquid-pulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.05); }
        }
      `}</style>

      <div className="relative w-32 h-32 flex items-center justify-center">
        
        {/* Bubbles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
             <div className="absolute top-0 left-[40%] w-3 h-3 bg-purple-400 rounded-full blur-[1px]" 
                  style={{ animation: 'bubble-rise 2s infinite ease-in' }} />
             <div className="absolute top-4 left-[60%] w-2 h-2 bg-pink-400 rounded-full blur-[1px]" 
                  style={{ animation: 'bubble-rise 2.5s infinite ease-in 0.5s' }} />
             <div className="absolute top-2 left-[50%] w-4 h-4 bg-purple-300 rounded-full blur-[1px]" 
                  style={{ animation: 'bubble-rise 3s infinite ease-in 1.2s' }} />
        </div>

        {/* The Pot SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl z-10 filter drop-shadow-lg" style={{ animation: 'pot-wobble 3s infinite ease-in-out' }}>
          <defs>
             <linearGradient id="potBodyGradient" x1="0" y1="0" x2="1" y2="1">
               <stop offset="0%" stopColor="#1e293b" /> {/* Slate 800 */}
               <stop offset="100%" stopColor="#0f172a" /> {/* Slate 900 */}
             </linearGradient>
             <linearGradient id="liquidGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9333EA" /> {/* Purple 600 */}
                <stop offset="100%" stopColor="#DB2777" /> {/* Pink 600 */}
             </linearGradient>
             <linearGradient id="rimGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" /> 
                <stop offset="100%" stopColor="#1e293b" /> 
             </linearGradient>
          </defs>

          {/* Pot Legs */}
          <path d="M 25 80 L 20 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 75 80 L 80 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

          {/* Pot Body */}
          <path d="M 15 40 Q 15 90 50 90 Q 85 90 85 40 Z" fill="url(#potBodyGradient)" />

          {/* Liquid (Animated) */}
          <path d="M 18 40 Q 50 50 82 40 Z" fill="url(#liquidGradient)" opacity="0.8" style={{ animation: 'liquid-pulse 2s infinite ease-in-out', transformOrigin: 'center' }} />
          
          {/* Rim */}
          <ellipse cx="50" cy="40" rx="38" ry="6" fill="none" stroke="url(#rimGradient)" strokeWidth="4" />
          
          {/* Handles */}
          <path d="M 15 45 Q 5 45 10 55" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 85 45 Q 95 45 90 55" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          
          {/* Reflection */}
          <path d="M 25 50 Q 25 75 40 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round" />

        </svg>
      </div>

      <div className="mt-4 text-center">
         <h3 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse tracking-wide">
            Brewing...
         </h3>
         <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">Cooking up fresh drops</p>
      </div>
    </div>
  );
};

export default CookingPotLoader;