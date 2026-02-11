import React from 'react';

const CookingPotLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Inject custom keyframes for this specific component */}
      <style>{`
        @keyframes steam-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
        }
        @keyframes pot-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(2px) rotate(-1deg); }
          75% { transform: translateY(2px) rotate(1deg); }
        }
        @keyframes bubble-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.2) translateY(-15px); opacity: 0; }
        }
      `}</style>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Steam Particles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-4 z-0">
           <div className="w-3 h-3 bg-purple-200/60 rounded-full" style={{ animation: 'steam-rise 2s infinite ease-out 0s' }}></div>
           <div className="w-4 h-4 bg-pink-200/60 rounded-full" style={{ animation: 'steam-rise 2.5s infinite ease-out 0.5s' }}></div>
           <div className="w-2 h-2 bg-blue-200/60 rounded-full" style={{ animation: 'steam-rise 1.8s infinite ease-out 1s' }}></div>
        </div>

        {/* The Pot SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl z-10" style={{ animation: 'pot-bounce 3s infinite ease-in-out' }}>
          <defs>
             <linearGradient id="potBodyGrad" x1="0" y1="0" x2="1" y2="1">
               <stop offset="0%" stopColor="#A855F7" /> {/* Purple 500 */}
               <stop offset="100%" stopColor="#EC4899" /> {/* Pink 500 */}
             </linearGradient>
             
             {/* Gradient for bubbles */}
             <radialGradient id="bubbleGrad1" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#EAB308" />
             </radialGradient>
          </defs>

          {/* Pot Handles (Behind) */}
          <path d="M12 45 C 2 45, 2 60, 12 60" fill="none" stroke="#9333EA" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 45 C 98 45, 98 60, 88 60" fill="none" stroke="#DB2777" strokeWidth="5" strokeLinecap="round" />

          {/* Pot Body */}
          <path d="M20 40 L80 40 L76 75 C 75 88, 65 92, 50 92 C 35 92, 25 88, 24 75 Z" fill="url(#potBodyGrad)" />
          
          {/* Internal Liquid Shadow/Depth */}
          <ellipse cx="50" cy="40" rx="30" ry="6" fill="#701a75" opacity="0.3" />

          {/* Rim */}
          <rect x="18" y="36" width="64" height="6" rx="3" fill="#6B21A8" />

          {/* Bubbles popping out (Ingredients) */}
          <circle cx="40" cy="38" r="4" fill="url(#bubbleGrad1)" style={{ animation: 'bubble-pop 2s infinite ease-out' }} />
          <circle cx="60" cy="38" r="3" fill="#bef264" style={{ animation: 'bubble-pop 2.5s infinite ease-out 0.8s' }} />
          <circle cx="50" cy="42" r="3" fill="#60A5FA" style={{ animation: 'bubble-pop 2.2s infinite ease-out 1.5s' }} />
          
          {/* Shine on Pot */}
          <path d="M28 50 Q 35 70, 28 80" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-4 text-center">
         <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
            Cooking...
         </h3>
         <p className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mt-2">Mixing the Ingredients</p>
      </div>
    </div>
  );
};

export default CookingPotLoader;