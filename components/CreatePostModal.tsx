import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { SentimentType } from '../types';
import { SENTIMENT_COLORS } from '../constants';

interface CreatePostModalProps {
  // We no longer need isOpen/onClose props as this component manages its own expansion state
  onSubmit: (text: string, sentiment: SentimentType) => Promise<void>;
}

const MOOD_OPTIONS = [
  { type: SentimentType.HAPPY, label: 'Happy', emoji: '😄' },
  { type: SentimentType.EXCITING, label: 'Excited', emoji: '🤩' },
  { type: SentimentType.LOVING, label: 'Loving', emoji: '😍' },
  { type: SentimentType.NEUTRAL, label: 'Chill', emoji: '☺️' },
  { type: SentimentType.SAD, label: 'Sad', emoji: '😢' },
  { type: SentimentType.ANGRY, label: 'Angry', emoji: '😡' },
];

const DynamicPostCreator: React.FC<CreatePostModalProps> = ({ onSubmit }) => {
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
  const islandClasses = isOpen 
    ? "w-[90vw] max-w-md h-[420px] rounded-[32px] bg-white/95 border-white/80" 
    : "w-[170px] max-w-md h-[52px] rounded-full bg-white/80 border-white/50 hover:scale-105 active:scale-95 cursor-pointer";

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

  return (
    <>
        {/* Backdrop - Only visible when open */}
        <div 
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        />

        {/* The Dynamic Container */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
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
                    className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-200'}`}
                >
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg">
                        <Plus size={18} />
                    </div>
                    <span className="font-semibold text-slate-800 tracking-tight">Drop Thought</span>
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
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
                                        <span className="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{option.emoji}</span>
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