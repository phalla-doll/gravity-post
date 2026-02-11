import React from 'react';
import { X, Heart, Mail } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 bg-white/40 hover:bg-white/70 rounded-full transition z-10 text-gray-500 backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
                 <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logo-gradient-lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA" />
                        <stop offset="1" stopColor="#DB2777" />
                      </linearGradient>
                    </defs>
                    <circle cx="16" cy="32" r="10" fill="url(#logo-gradient-lg)" />
                    <circle cx="34" cy="28" r="9" fill="url(#logo-gradient-lg)" fillOpacity="0.9" />
                    <circle cx="24" cy="14" r="9" fill="url(#logo-gradient-lg)" />
                 </svg>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Gravity</h2>
            <p className="text-xs font-bold text-purple-600 tracking-widest uppercase mb-6">The Social Pile</p>

            <div className="bg-purple-50/50 p-6 rounded-2xl mb-6 text-left border border-purple-100/50 backdrop-blur-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    This is an <strong>experimental hobby project</strong> designed to reimagine how we consume social feeds. 
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                    Instead of infinite scrolling, posts obey the laws of physics—falling, stacking, and colliding in a shared space.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                 <div className="text-xs text-gray-400 font-medium flex items-center justify-center gap-1">
                    Created with <Heart size={12} className="text-red-400 fill-current"/> by <span className="text-gray-600 font-bold">Mantha</span>
                 </div>
                 <a 
                   href="mailto:mantha@example.com"
                   className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                 >
                    <Mail size={18} /> Contact Creator
                 </a>
            </div>
        </div>
        
        <div className="bg-white/30 p-4 text-center border-t border-white/40 backdrop-blur-sm">
             <p className="text-xs text-gray-400">
                 © {new Date().getFullYear()} Gravity Experiment.
             </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;