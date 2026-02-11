import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, ArrowLeft } from 'lucide-react';
import { SentimentType } from '../types';
import { SENTIMENT_COLORS } from '../constants';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<'mood' | 'text'>('mood');
  const [selectedMood, setSelectedMood] = useState<SentimentType | null>(null);
  const [hoveredMood, setHoveredMood] = useState<SentimentType | null>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('mood');
      setSelectedMood(null);
      setHoveredMood(null);
      setText('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMoodSelect = (mood: SentimentType) => {
    setSelectedMood(mood);
    setStep('text');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedMood) return;

    setIsSubmitting(true);
    await onSubmit(text, selectedMood);
    setIsSubmitting(false);
    onClose();
  };

  const handleBack = () => {
    setStep('mood');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/30 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'text' && (
              <button 
                onClick={handleBack}
                className="p-1.5 hover:bg-white/50 rounded-full transition mr-1 text-gray-700"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {step === 'mood' ? 'Pick a Vibe' : 'Speak Your Mind'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 'mood' ? (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left duration-300">
              {MOOD_OPTIONS.map((option) => {
                const isHovered = hoveredMood === option.type;
                const baseColor = SENTIMENT_COLORS[option.type];
                
                // For lighter colors (Happy, Exciting), use dark text on hover. For others, use white.
                const isLightColor = option.type === SentimentType.HAPPY || option.type === SentimentType.EXCITING;

                return (
                  <button
                    key={option.type}
                    onClick={() => handleMoodSelect(option.type)}
                    onMouseEnter={() => setHoveredMood(option.type)}
                    onMouseLeave={() => setHoveredMood(null)}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ease-out backdrop-blur-sm"
                    style={{
                      backgroundColor: isHovered ? baseColor : 'rgba(255, 255, 255, 0.4)',
                      borderColor: isHovered ? baseColor : 'rgba(255, 255, 255, 0.6)',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      boxShadow: isHovered ? `0 10px 25px -5px ${baseColor}80` : 'none'
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 transition-colors duration-300"
                      style={{ 
                        backgroundColor: isHovered ? 'rgba(255,255,255,0.2)' : baseColor + '40'
                      }}
                    >
                      {option.emoji}
                    </div>
                    <span 
                      className="font-bold transition-colors duration-300"
                      style={{ color: isHovered ? (isLightColor ? '#374151' : 'white') : '#374151' }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="relative">
                <div 
                  className="absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-wider rounded-full py-0.5 border shadow-sm z-10"
                  style={{ 
                    backgroundColor: selectedMood ? SENTIMENT_COLORS[selectedMood] : '#eee',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }}
                >
                   {MOOD_OPTIONS.find(m => m.type === selectedMood)?.emoji} {MOOD_OPTIONS.find(m => m.type === selectedMood)?.label}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type something playful..."
                  className="w-full h-40 p-4 pt-6 rounded-xl border border-white/60 focus:border-purple-400 focus:ring-0 resize-none bg-white/40 backdrop-blur-sm text-lg transition-all placeholder-gray-400"
                  maxLength={140}
                  autoFocus
                />
                <div className="text-right text-xs text-gray-500 mt-1 font-medium">
                  {text.length}/140
                </div>
              </div>

              <button
                type="submit"
                disabled={!text.trim() || isSubmitting}
                className="w-full py-4 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                Drop into Pile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;