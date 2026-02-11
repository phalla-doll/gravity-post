import React from 'react';

const CookingPotLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <style>{`
        @keyframes smoke-flow-1 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 0.5; }
          50% { transform: translate(-10px, -40px) scale(1.5); opacity: 0.3; }
          100% { transform: translate(5px, -90px) scale(2.5); opacity: 0; }
        }
        @keyframes smoke-flow-2 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          25% { opacity: 0.5; }
          60% { transform: translate(15px, -50px) scale(1.8); opacity: 0.2; }
          100% { transform: translate(-5px, -100px) scale(3); opacity: 0; }
        }
        @keyframes smoke-flow-3 {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
          30% { opacity: 0.4; }
          70% { transform: translate(-8px, -60px) scale(2); opacity: 0.2; }
          100% { transform: translate(10px, -110px) scale(3); opacity: 0; }
        }
        @keyframes ember-pulse {
          0%, 100% { fill: #ef4444; filter: drop-shadow(0 0 1px #ef4444); r: 1.5px; }
          50% { fill: #fca5a5; filter: drop-shadow(0 0 4px #f87171); r: 1.8px; }
        }
      `}</style>

      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Smoke Particles - Added more for density */}
        {/* Center */}
        <div className="absolute top-16 left-[50%] w-2 h-2 bg-gray-400/40 rounded-full blur-sm" 
             style={{ animation: 'smoke-flow-2 3.5s infinite ease-out' }} />
        <div className="absolute top-14 left-[48%] w-3 h-3 bg-gray-300/30 rounded-full blur-md" 
             style={{ animation: 'smoke-flow-1 4s infinite ease-out 1s' }} />
        
        {/* Left Side */}
        <div className="absolute top-16 left-[40%] w-2 h-2 bg-gray-400/30 rounded-full blur-sm" 
             style={{ animation: 'smoke-flow-3 3.8s infinite ease-out 0.5s' }} />
        <div className="absolute top-18 left-[35%] w-3 h-3 bg-gray-300/20 rounded-full blur-md" 
             style={{ animation: 'smoke-flow-1 4.2s infinite ease-out 2s' }} />

        {/* Right Side */}
        <div className="absolute top-16 left-[60%] w-2 h-2 bg-gray-400/30 rounded-full blur-sm" 
             style={{ animation: 'smoke-flow-3 3.2s infinite ease-out 1.2s' }} />
        <div className="absolute top-18 left-[65%] w-3 h-3 bg-gray-300/20 rounded-full blur-md" 
             style={{ animation: 'smoke-flow-2 4.5s infinite ease-out 2.5s' }} />

        {/* Incense Burner SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl z-10">
          <defs>
             <linearGradient id="stickGradient" x1="0" y1="0" x2="1" y2="1">
               <stop offset="0%" stopColor="#7c2d12" /> {/* Dark Brown */}
               <stop offset="100%" stopColor="#b45309" /> {/* Lighter Brown */}
             </linearGradient>
             <radialGradient id="ashGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
             </radialGradient>
             <linearGradient id="bowlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" /> {/* Amber */}
                <stop offset="100%" stopColor="#b45309" /> {/* Bronze */}
             </linearGradient>
          </defs>

          {/* The Bowl */}
          <path d="M25 75 Q 50 85, 75 75 L 70 90 Q 50 100, 30 90 Z" fill="url(#bowlGradient)" />
          {/* Bowl Rim area filled with Ash */}
          <ellipse cx="50" cy="75" rx="25" ry="8" fill="url(#ashGradient)" />

          {/* Incense Sticks - Fanned out */}
          
          {/* Far Left Stick */}
          <line x1="38" y1="74" x2="20" y2="45" stroke="url(#stickGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="45" r="1.5" style={{ animation: 'ember-pulse 2s infinite ease-in-out 0.2s' }} />

          {/* Mid Left Stick */}
          <line x1="44" y1="76" x2="35" y2="35" stroke="url(#stickGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="35" cy="35" r="1.5" style={{ animation: 'ember-pulse 2.2s infinite ease-in-out 0.8s' }} />

          {/* Center Stick */}
          <line x1="50" y1="78" x2="50" y2="28" stroke="url(#stickGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="28" r="1.5" style={{ animation: 'ember-pulse 1.8s infinite ease-in-out 0s' }} />

          {/* Mid Right Stick */}
          <line x1="56" y1="76" x2="65" y2="35" stroke="url(#stickGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="65" cy="35" r="1.5" style={{ animation: 'ember-pulse 2.5s infinite ease-in-out 0.5s' }} />

          {/* Far Right Stick */}
          <line x1="62" y1="74" x2="80" y2="45" stroke="url(#stickGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="80" cy="45" r="1.5" style={{ animation: 'ember-pulse 2.1s infinite ease-in-out 1.2s' }} />
          
        </svg>
      </div>

      <div className="mt-2 text-center">
         <h3 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 animate-pulse tracking-wide">
            Praying...
         </h3>
         <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">getting posts from God...</p>
      </div>
    </div>
  );
};

export default CookingPotLoader;