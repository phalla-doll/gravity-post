import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { SentimentType } from '../types';
import { SENTIMENT_COLORS } from '../constants';

interface CreatePostModalProps {
  // We no longer need isOpen/onClose props as this component manages its own expansion state
  onSubmit: (text: string, sentiment: SentimentType) => Promise<void>;
  isSearchOpen?: boolean; // New prop to hide button during search
}

const MOOD_OPTIONS = [
  { type: SentimentType.HAPPY, label: 'Happy' },
  { type: SentimentType.EXCITING, label: 'Excited' },
  { type: SentimentType.LOVING, label: 'Loving' },
  { type: SentimentType.NEUTRAL, label: 'Chill' },
  { type: SentimentType.SAD, label: 'Sad' },
  { type: SentimentType.ANGRY, label: 'Angry' },
];

const renderMoodIcon = (type: SentimentType, color: string) => {
    switch (type) {
        case SentimentType.HAPPY:
            // Detailed Sun with Smile
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:rotate-12">
                    <defs>
                        <radialGradient id={`grad-${type}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill={`url(#grad-${type})`} />
                    {/* Sun Rays */}
                    <g stroke={color} strokeWidth="2.5" strokeLinecap="round">
                         {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                             <line 
                                key={angle}
                                x1="50" y1="50" x2="50" y2="15" 
                                transform={`rotate(${angle} 50 50) translate(0 -28)`} 
                             />
                         ))}
                    </g>
                    {/* Face Body */}
                    <circle cx="50" cy="50" r="25" fill="white" stroke={color} strokeWidth="2.5" />
                    {/* Eyes */}
                    <path d="M 40 45 Q 43 42 46 45" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 54 45 Q 57 42 60 45" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    {/* Mouth */}
                    <path d="M 40 58 Q 50 68 60 58" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    {/* Cheeks */}
                    <circle cx="38" cy="53" r="2" fill={color} opacity="0.5" />
                    <circle cx="62" cy="53" r="2" fill={color} opacity="0.5" />
                </svg>
            );

        case SentimentType.EXCITING:
            // Lightning Bolt & Stars
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:scale-110">
                     {/* Dynamic Background */}
                     <path d="M50 10 L60 35 L85 35 L65 55 L75 80 L50 65 L25 80 L35 55 L15 35 L40 35 Z" fill={color} fillOpacity="0.1" />
                     
                     {/* Main Bolt */}
                     <path 
                        d="M 55 15 L 35 50 L 55 50 L 45 85 L 75 40 L 55 40 L 65 15 Z" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                     />
                     
                     {/* Electricity sparks */}
                     <path d="M 25 30 L 15 40" stroke={color} strokeWidth="2" strokeLinecap="round" />
                     <path d="M 80 70 L 90 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
                     <circle cx="80" cy="25" r="3" fill={color} />
                     <circle cx="20" cy="75" r="2" fill={color} />
                </svg>
            );

        case SentimentType.LOVING:
             // Floating Hearts
             return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:scale-110">
                    {/* Main Heart */}
                    <path 
                        d="M 50 85 C 20 65 10 50 10 35 C 10 20 25 15 40 25 C 45 28 50 35 50 35 C 50 35 55 28 60 25 C 75 15 90 20 90 35 C 90 50 80 65 50 85 Z" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                    />
                    {/* Inner Details */}
                    <path d="M 75 30 Q 80 25 85 30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
                    
                    {/* Small floating hearts */}
                    <path 
                        d="M 80 65 C 75 60 72 55 72 50 C 72 45 76 43 79 45 C 80 46 81 47 81 47 C 81 47 82 46 83 45 C 86 43 90 45 90 50 C 90 55 87 60 80 65 Z" 
                        fill={color} 
                    />
                    <path 
                        d="M 20 65 C 25 60 28 55 28 50 C 28 45 24 43 21 45 C 20 46 19 47 19 47 C 19 47 18 46 17 45 C 14 43 10 45 10 50 C 10 55 13 60 20 65 Z" 
                        fill={color} 
                        opacity="0.6"
                    />
                </svg>
             );

        case SentimentType.NEUTRAL:
             // Coffee Cup
             return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:rotate-3">
                    {/* Plate */}
                    <ellipse cx="50" cy="85" rx="30" ry="8" fill={color} fillOpacity="0.2" />
                    
                    {/* Cup Handle */}
                    <path d="M 70 45 C 85 45 85 65 70 65" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Cup Body */}
                    <path 
                        d="M 25 40 L 25 70 C 25 80 35 85 50 85 C 65 85 75 80 75 70 L 75 40" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                    />
                    <line x1="25" y1="40" x2="75" y2="40" stroke={color} strokeWidth="2.5" />
                    
                    {/* Steam */}
                    <path d="M 35 30 Q 40 20 35 15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <path d="M 50 30 Q 55 20 50 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <path d="M 65 30 Q 70 20 65 15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
             );

        case SentimentType.SAD:
             // Rain Cloud
             return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:translate-y-1">
                    {/* Cloud Body */}
                    <path 
                        d="M 25 60 C 15 60 10 50 15 40 C 15 25 30 20 40 25 C 45 15 65 15 70 25 C 85 25 90 40 85 50 C 90 60 80 65 70 60 L 25 60 Z" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                    />
                    
                    {/* Raindrops */}
                    <path d="M 35 70 L 35 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 50 75 L 50 85" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 65 70 L 65 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Sad Face on Cloud */}
                    <path d="M 38 40 L 42 42" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <path d="M 62 42 L 66 40" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <path d="M 45 52 Q 52 48 59 52" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </svg>
             );

        case SentimentType.ANGRY:
             // Fire / Bomb
             return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:scale-105">
                     {/* Flame */}
                     <path 
                        d="M 50 15 Q 65 40 80 55 C 90 70 80 90 50 90 C 20 90 10 70 20 55 Q 35 40 50 15 Z" 
                        fill="white" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                     />
                     {/* Inner Flame */}
                     <path 
                        d="M 50 35 Q 60 55 70 65 C 75 75 65 82 50 82 C 35 82 25 75 30 65 Q 40 55 50 35 Z" 
                        fill={color} 
                        opacity="0.2"
                     />
                     {/* Angry Eyes */}
                     <path d="M 35 60 L 45 65" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                     <path d="M 65 60 L 55 65" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
             );
        default:
            return null;
    }
}

const DynamicPostCreator: React.FC<CreatePostModalProps> = ({ onSubmit, isSearchOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'mood' | 'text'>('mood');
  const [selectedMood, setSelectedMood] = useState<SentimentType | null>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for focusing
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) {
        // Reset state when closed fully
        const timer = setTimeout(() => {
            setStep('mood');
            setSelectedMood(null);
            setText('');
            setIsSubmitting(false);
        }, 500); // Wait for shrink animation
        return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
      if (step === 'text' && isOpen) {
          // Slight delay to allow animation to settle before focusing
          setTimeout(() => {
              inputRef.current?.focus();
          }, 500); // Increased slightly to match new animation timing
      }
  }, [step, isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isOpen && e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleMoodSelect = (mood: SentimentType) => {
    setSelectedMood(mood);
    setStep('text');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !selectedMood) return;

    setIsSubmitting(true);
    await onSubmit(text, selectedMood);
    setIsSubmitting(false);
    setIsOpen(false);
  };

  const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false);
  };

  // Dynamic Island Styles
  // Added max-w-md to the closed state to ensure constraints remain stable during transition
  const islandClasses = isOpen 
    ? "w-[90vw] max-w-md h-[420px] rounded-[32px] bg-white/95 border-white/80" 
    : "md:w-[170px] md:h-[52px] w-[46px] h-[46px] max-w-md rounded-full bg-white/80 border-white/50 hover:scale-105 active:scale-95 cursor-pointer";

  // Advanced Transition Styles for "Width then Height" effect
  // Refined for smoothness and performance
  const transitionStyle: React.CSSProperties = {
      transitionProperty: 'width, height, border-radius, background-color, transform, opacity',
      // Use Quaternary ease-out for a very smooth, high-quality motion feel
      transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)', 
      willChange: 'width, height, transform', // Hardware acceleration hint
      
      ...(isOpen && selectedMood 
          ? { background: `linear-gradient(to bottom right, #ffffff, ${SENTIMENT_COLORS[selectedMood]}30)` } 
          : {}
      )
  };

  // Explicit timings to decouple width and height animations slightly
  // Open: Width expands fast (0.4s), Height expands slightly slower (0.5s) with a small delay
  // Close: Height collapses fast (0.4s), Width collapses slightly slower (0.5s) with a small delay
  const customTransition = {
      ...transitionStyle,
      transitionDuration: isOpen 
          ? '0.4s, 0.5s, 0.4s, 0.3s, 0.3s, 0.3s' 
          : '0.5s, 0.4s, 0.4s, 0.3s, 0.3s, 0.3s',
      
      transitionDelay: isOpen 
          ? '0s, 0.1s, 0s, 0s, 0s, 0s'    // OPEN: Width runs, then Height runs overlap
          : '0.1s, 0s, 0s, 0s, 0s, 0s'    // CLOSE: Height runs, then Width runs overlap
  };

  // If search is open and this is not expanded, hide it
  const isHidden = isSearchOpen && !isOpen;
  
  // Calculate position classes to avoid layout snapping
  // 201px = 178px (original right offset) + 23px (half width of 46px button)
  // We use `left` consistently to allow CSS transitions to interpolate the position.
  const positionClass = isOpen
    ? "left-1/2"
    : "left-[calc(100%-201px)] md:left-1/2";

  return (
    <>
        {/* Backdrop - Only visible when open */}
        <div 
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        />

        {/* The Dynamic Container */}
        <div className={`
            fixed top-4 z-50 flex flex-col items-center -translate-x-1/2
            transition-[left,transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${positionClass}
            ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
            <div 
                className={`
                    relative overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border backdrop-blur-2xl
                    ${islandClasses}
                `}
                style={customTransition}
                onClick={() => !isOpen && setIsOpen(true)}
            >
                {/* STATE 1: COLLAPSED BUTTON */}
                <div 
                    className={`absolute inset-0 flex items-center justify-center md:gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-200'}`}
                >
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg">
                        <Plus size={18} />
                    </div>
                    <span className="font-semibold text-slate-800 tracking-tight hidden md:block">Drop Thought</span>
                </div>

                {/* STATE 2: EXPANDED CONTENT */}
                <div 
                    className={`w-full h-full flex flex-col transition-opacity duration-500 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Header inside Island */}
                    <div className="flex justify-between items-center p-5 pb-2 shrink-0">
                        <div className="flex items-center gap-2">
                             {step === 'text' && (
                                <button 
                                    onClick={() => setStep('mood')}
                                    className="p-2 hover:bg-black/5 rounded-full transition text-slate-500"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                             )}
                             <h3 className="font-black font-semibold text-lg text-slate-800 tracking-tight">
                                {step === 'mood' ? 'How are you feeling?' : 'Speak your mind'}
                             </h3>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="p-2 bg-black/5 hover:bg-black/10 rounded-full text-slate-500 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative overflow-hidden">
                        
                        {/* MOOD GRID */}
                        <div 
                            className={`absolute inset-0 p-5 pt-2 grid grid-cols-2 gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${step === 'mood' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
                        >
                            {MOOD_OPTIONS.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={(e) => { e.stopPropagation(); handleMoodSelect(option.type); }}
                                    className="relative group overflow-hidden rounded-2xl border border-transparent hover:border-black/5 transition-all duration-300"
                                    style={{ backgroundColor: `${SENTIMENT_COLORS[option.type]}20` }}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: SENTIMENT_COLORS[option.type] }} />
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 py-2">
                                        <div className="w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                                            {renderMoodIcon(option.type, SENTIMENT_COLORS[option.type])}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-white transition-colors uppercase tracking-wider">{option.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* TEXT INPUT */}
                        <div 
                             className={`absolute inset-0 p-5 pt-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${step === 'text' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                        >
                             <div className="relative flex-1">
                                <textarea
                                    ref={inputRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type something..."
                                    className="w-full h-full p-4 bg-white/50 rounded-2xl border-2 border-transparent focus:border-slate-200 focus:bg-white resize-none text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                                    maxLength={140}
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-white/80 px-2 py-1 rounded-lg">
                                    {text.length}/140
                                </div>
                             </div>

                             <button
                                onClick={(e) => handleSubmit(e)}
                                disabled={!text.trim() || isSubmitting}
                                className="mt-4 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                              >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                Drop It
                              </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default DynamicPostCreator;